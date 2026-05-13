import { Router } from "express";
import * as controller from "./analytics.controller";
import { authenticate } from "../auth/auth.middleware";

const router = Router();

router.get("/public/:slug", controller.getPublic);

// Creator — protected behind auth and ownership check.
router.get("/:pollId", authenticate, controller.getForCreator);

export default router;
