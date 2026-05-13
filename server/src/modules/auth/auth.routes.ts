import { Router } from "express";
import * as controller from "./auth.controller";
import { authenticate } from "./auth.middleware";
import validate from "../../common/middleware/Validate.middleware";
import { authLimiter } from "../../common/middleware/rate-limit.middleware";
import RegisterDto from "./dto/register.dto";
import LoginDto from "./dto/login.dto";
import ClerkSyncDto from "./dto/clerk-sync.dto";

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
