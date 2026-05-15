import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/auth.routes";
import pollsRoutes, { responsesRouter } from "./modules/polls/polls.routes";
import analyticsRoutes from "./modules/analytics/analytics.routes";
import {
  errorHandler,
  notFoundHandler,
} from "./common/middleware/error.middleware";
import { apiLimiter } from "./common/middleware/rate-limit.middleware";

export function createApplication(): Express {
  const app = express();

  // Trust proxy so req.ip is the real client IP behind a reverse proxy.
  app.set("trust proxy", 1);

  app.use(
    helmet({
      // We serve API only — relax CSP so dev tooling isn't blocked.
      contentSecurityPolicy: false,
    }),
  );

  const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  console.log("[cors] allowed origins:", allowedOrigins);
  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
    }),
  );

  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());

  app.use((req, _res, next) => {
    if (req.path === "/health") return next();
    console.log(
      `[req] ${req.method} ${req.originalUrl} from ${req.get("origin") ?? "no-origin"}`,
    );
    next();
  });

  // Global rate limit on every API path — auth/submit get tighter limits too.
  app.use("/api", apiLimiter);

  app.get("/health", (_req, res) => {
    res.status(200).json({
      success: true,
      message: "Server is up and running",
    });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/polls", pollsRoutes);
  // Mount the response submission router at /api so its path is /api/polls/:pollId/responses
  app.use("/api", responsesRouter);
  app.use("/api/analytics", analyticsRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
