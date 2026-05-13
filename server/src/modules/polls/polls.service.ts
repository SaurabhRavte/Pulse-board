import crypto from "node:crypto";
import ApiError from "../../common/utils/api-error.js";
import { hashString } from "../../common/utils/jwt.utils.js";
import {
  emitPollResponse,
  emitPollPublished,
  emitPollClosed,
} from "../../common/sockets/index.js";
import PollModel from "./polls.model.js";

interface CreatePollInput {
  title: string;
  description?: string | null;
  responseMode: "anonymous" | "authenticated";
  expiresAt: string | null; from client
  questions: Array<{
    prompt: string;
    isMandatory: boolean;
    options: string[];
  }>;
}

interface SubmitInput {
  pollId: string;
  respondentId: string | null;
  ip: string | null;
  answers: Array<{ questionId: string; optionId: string }>;
}

/** 12 char URL-safe slug from random bytes. */
const generateSlug = (): string =>
  crypto.randomBytes(9).toString("base64url").slice(0, 12);

/**
 * Treats a poll as "open for responses" if status is active and either it has
 * no expiry, or expiry is still in the future. Centralised so the same rule
 * applies in every route that accepts a submission.
 */
const isAcceptingResponses = (poll: {
  status: string;
  expiresAt: Date | null;
}): boolean => {
  if (poll.status !== "active") return false;
  if (poll.expiresAt && poll.expiresAt.getTime() <= Date.now()) return false;
  return true;
};

const createPoll = async (creatorId: string, input: CreatePollInput) => {
  // Defensive — DTO already validates, but never trust transformed values.
  if (input.questions.length === 0) {
    throw ApiError.badRequest("Poll must have at least one question");
  }

  let expiresAt: Date | null = null;
  if (input.expiresAt) {
    const parsed = new Date(input.expiresAt);
    if (Number.isNaN(parsed.getTime())) {
      throw ApiError.badRequest("Invalid expiry date");
    }
    if (parsed.getTime() <= Date.now()) {
      throw ApiError.badRequest("Expiry must be in the future");
    }
    expiresAt = parsed;
  }

  // Retry slug a few times in the (extremely unlikely) collision case.
  let slug = generateSlug();
  for (let i = 0; i < 5; i++) {
    const existing = await PollModel.findBySlug(slug);
    if (!existing) break;
    slug = generateSlug();
  }

  const poll = await PollModel.createWithQuestions({
    creatorId,
    title: input.title,
    description: input.description ?? null,
    slug,
    responseMode: input.responseMode,
    expiresAt,
    questions: input.questions,
  });

  return poll;
};

const getPollForCreator = async (pollId: string, creatorId: string) => {
  const poll = await PollModel.findFullById(pollId);
  if (!poll) throw ApiError.notFound("Poll not found");
  if (poll.creatorId !== creatorId) {
    throw ApiError.forbidden("You do not own this poll");
  }
  return poll;
};

/**
 * Public view used by respondents. Returns a poll only when it's still
 * accepting responses OR when its results have been published. Otherwise we
 * surface a 410 so the UI can show "this poll has closed".
 */
const getPublicPoll = async (slug: string) => {
  const poll = await PollModel.findFullBySlug(slug);
  if (!poll) throw ApiError.notFound("Poll not found");

  const accepting = isAcceptingResponses(poll);
  return { poll, accepting, resultsPublished: poll.resultsPublished };
};

const listMyPolls = (creatorId: string) => PollModel.listByCreator(creatorId);

const closePoll = async (pollId: string, creatorId: string) => {
  const poll = await PollModel.findById(pollId);
  if (!poll) throw ApiError.notFound("Poll not found");
  if (poll.creatorId !== creatorId) throw ApiError.forbidden();

  await PollModel.updateStatus(pollId, "closed");
  emitPollClosed(pollId);
};

const publishResults = async (pollId: string, creatorId: string) => {
  const poll = await PollModel.findById(pollId);
  if (!poll) throw ApiError.notFound("Poll not found");
  if (poll.creatorId !== creatorId) throw ApiError.forbidden();

  await PollModel.publishResults(pollId);
  emitPollPublished(pollId);
};

const deletePoll = async (pollId: string, creatorId: string) => {
  const deleted = await PollModel.deleteById(pollId, creatorId);
  if (deleted === 0) throw ApiError.notFound("Poll not found");
};

const submitResponse = async (input: SubmitInput) => {
  const poll = await PollModel.findById(input.pollId);
  if (!poll) throw ApiError.notFound("Poll not found");

  if (!isAcceptingResponses(poll)) {
    throw ApiError.gone("This poll is no longer accepting responses");
  }

  // Authenticated-mode polls require a logged-in respondent.
  if (poll.responseMode === "authenticated" && !input.respondentId) {
    throw ApiError.unauthorized(
      "This poll requires you to be signed in to respond",
    );
  }


  if (input.respondentId) {
    const already = await PollModel.hasResponded(
      input.pollId,
      input.respondentId,
    );
    if (already) {
      throw ApiError.conflict("You have already responded to this poll");
    }
  }


  const full = await PollModel.loadQuestionsAndOptions(input.pollId);
  if (!full) throw ApiError.notFound("Poll not found");

  const questionIndex = new Map<
    string,
    { id: string; isMandatory: boolean; optionIds: Set<string> }
  >();
  for (const q of full.questions) {
    questionIndex.set(q.id, {
      id: q.id,
      isMandatory: q.isMandatory,
      optionIds: new Set(q.options.map((o) => o.id)),
    });
  }

  const seen = new Set<string>();
  for (const a of input.answers) {
    const q = questionIndex.get(a.questionId);
    if (!q) {
      throw ApiError.badRequest(`Unknown question: ${a.questionId}`);
    }
    if (!q.optionIds.has(a.optionId)) {
      throw ApiError.badRequest(
        `Option ${a.optionId} does not belong to question ${a.questionId}`,
      );
    }
    if (seen.has(a.questionId)) {
      throw ApiError.badRequest("Each question may be answered only once");
    }
    seen.add(a.questionId);
  }

  for (const q of questionIndex.values()) {
    if (q.isMandatory && !seen.has(q.id)) {
      throw ApiError.badRequest(`Question ${q.id} is mandatory`);
    }
  }

  const ipHash = input.ip ? hashString(input.ip) : null;
  const result = await PollModel.recordResponse({
    pollId: input.pollId,
    respondentId: input.respondentId,
    ipHash,
    answers: input.answers,
  });

 
  emitPollResponse({
    pollId: input.pollId,
    totalResponses: result.totalResponses,
    optionCounts: result.optionCounts,
  });

  return { responseId: result.responseId };
};

export {
  createPoll,
  getPollForCreator,
  getPublicPoll,
  listMyPolls,
  closePoll,
  publishResults,
  deletePoll,
  submitResponse,
  isAcceptingResponses,
};
