import express from "express";
import type { Express } from "express";

export function createApplication(): Express {
  const app = express();

  // Middlewares
  app.use(express.json());

  // Routes
  app.get("/health", (_req, res) => {
    return res.status(200).json({
      success: true,
      message: "Server is up and running",
    });
  });

  return app;
}
