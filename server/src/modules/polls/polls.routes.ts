import { Router } from "express";
import * as controller from "./polls.controller";
import { authenticate, optionalAuth } from "../auth/auth.middleware";
import validate from "../../common/middleware/Validate.middleware";
import { submitResponseLimiter } from "../../common/middleware/rate-limit.middleware";
import CreatePollDto from "./dto/create-poll.dto";
import SubmitResponseDto from "./dto/submit-response.dto";

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
