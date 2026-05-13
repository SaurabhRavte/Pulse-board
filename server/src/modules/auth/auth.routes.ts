import { Router } from "express";
import * as controller from "./auth.controller.js";
import { authenticate } from "./auth.middleware.js";
import validate from "../../common/middleware/Validate.middleware.js";
import { authLimiter } from "../../common/middleware/rate-limit.middleware.js";
import RegisterDto from "./dto/register.dto.js";
import LoginDto from "./dto/login.dto.js";
import ClerkSyncDto from "./dto/clerk-sync.dto.js";

const router = Router();

router.post(
  "/register",
  authLimiter,
  validate(RegisterDto),
  controller.register,
);
router.post("/login", authLimiter, validate(LoginDto), controller.login);
router.post("/refresh-token", controller.refreshToken);
router.post("/logout", authenticate, controller.logout);
router.get("/me", authenticate, controller.getMe);
router.post(
  "/clerk-sync",
  authLimiter,
  validate(ClerkSyncDto),
  controller.clerkSync,
);

export default router;
