import type { Request, Response, NextFunction } from "express";
import * as analyticsService from "./analytics.service";
import ApiResponse from "../../common/utils/api-response";
import PollModel from "../polls/polls.model";
import ApiError from "../../common/utils/api-error";

/** Owner-only analytics  */
const getForCreator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const pollId = String(req.params.pollId);
    const poll = await PollModel.findById(pollId);
    if (!poll) throw ApiError.notFound("Poll not found");
    if (poll.creatorId !== req.user!.id) throw ApiError.forbidden();

    const data = await analyticsService.getAnalytics(poll.id);
    return ApiResponse.ok(res, "Analytics", data);
  } catch (err) {
    next(err);
  }
};

/** Public analytics */
const getPublic = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = String(req.params.slug);
    const poll = await PollModel.findBySlug(slug);
    if (!poll) throw ApiError.notFound("Poll not found");
    if (!poll.resultsPublished) {
      throw ApiError.forbidden("Results have not been published yet");
    }
    const data = await analyticsService.getAnalytics(poll.id);
    return ApiResponse.ok(res, "Analytics", data);
  } catch (err) {
    next(err);
  }
};

export { getForCreator, getPublic };
