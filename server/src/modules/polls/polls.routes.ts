import { Router } from "express";
import * as controller from "./polls.controller.js";
import { authenticate, optionalAuth } from "../auth/auth.middleware.js";
import validate from "../../common/middleware/Validate.middleware.js";
import { submitResponseLimiter } from "../../common/middleware/rate-limit.middleware.js";
import CreatePollDto from "./dto/create-poll.dto.js";
import SubmitResponseDto from "./dto/submit-response.dto.js";

const router = Router();

router.get("/public/:slug", controller.getPublic);

router.use(authenticate);
router.get("/", controller.listMine);
router.post("/", validate(CreatePollDto), controller.create);
router.get("/:pollId", controller.getMine);
router.delete("/:pollId", controller.remove);
router.post("/:pollId/close", controller.close);
router.post("/:pollId/publish", controller.publish);

export default router;

export const responsesRouter = Router();
responsesRouter.post(
  "/polls/:pollId/responses",
  submitResponseLimiter,
  optionalAuth,
  validate(SubmitResponseDto),
  controller.submit,
);
