import type { Request, Response, NextFunction } from "express";
import * as pollsService from "./polls.service.js";
import ApiResponse from "../../common/utils/api-response.js";

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const poll = await pollsService.createPoll(req.user!.id, req.body);
    return ApiResponse.created(res, "Poll created", poll);
  } catch (err) {
    next(err);
  }
};

const listMine = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const polls = await pollsService.listMyPolls(req.user!.id);
    return ApiResponse.ok(res, "My polls", polls);
  } catch (err) {
    next(err);
  }
};

const getMine = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const poll = await pollsService.getPollForCreator(
      String(req.params.pollId),
      req.user!.id,
    );
    return ApiResponse.ok(res, "Poll", poll);
  } catch (err) {
    next(err);
  }
};

const getPublic = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await pollsService.getPublicPoll(String(req.params.slug));
    return ApiResponse.ok(res, "Poll", result);
  } catch (err) {
    next(err);
  }
};

const close = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await pollsService.closePoll(String(req.params.pollId), req.user!.id);
    return ApiResponse.ok(res, "Poll closed");
  } catch (err) {
    next(err);
  }
};

const publish = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await pollsService.publishResults(String(req.params.pollId), req.user!.id);
    return ApiResponse.ok(res, "Results published");
  } catch (err) {
    next(err);
  }
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await pollsService.deletePoll(String(req.params.pollId), req.user!.id);
    return ApiResponse.ok(res, "Poll deleted");
  } catch (err) {
    next(err);
  }
};

const submit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await pollsService.submitResponse({
      pollId: String(req.params.pollId),
      respondentId: req.user?.id ?? null,
      ip: req.ip ?? null,
      answers: req.body.answers,
    });
    return ApiResponse.created(res, "Response recorded", result);
  } catch (err) {
    next(err);
  }
};

export { create, listMine, getMine, getPublic, close, publish, remove, submit };
