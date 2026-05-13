import { eq, sql, and, desc } from "drizzle-orm";
import { db } from "../../common/db/index";
import {
  pollsTable,
  responsesTable,
  questionsTable,
  optionsTable,
  responseAnswersTable,
  usersTable,
} from "../../common/db/schema";
import ApiError from "../../common/utils/api-error";

interface QuestionSummary {
  questionId: string;
  prompt: string;
  isMandatory: boolean;
  type: "single" | "multiple";
  totalAnswers: number;
  options: Array<{
    optionId: string;
    label: string;
    count: number;
    percentage: number;
  }>;
}

interface RespondentSummary {
  responseId: string;
  userId: string | null;
  name: string | null;
  email: string | null;
  submittedAt: string;
}

interface AnalyticsResult {
  pollId: string;
  totalResponses: number;
  questions: QuestionSummary[];
  responsesOverTime: Array<{ date: string; count: number }>;
  respondents?: RespondentSummary[];
}

const getAnalytics = async (
  pollId: string,
  opts: { includeRespondents?: boolean } = {},
): Promise<AnalyticsResult> => {
  const poll = await db
    .select({ id: pollsTable.id })
    .from(pollsTable)
    .where(eq(pollsTable.id, pollId))
    .limit(1);
  if (poll.length === 0) throw ApiError.notFound("Poll not found");

  const totalRow = await db
    .select({ count: sql<number>`COUNT(*)::int` })
    .from(responsesTable)
    .where(eq(responsesTable.pollId, pollId));
  const totalResponses = totalRow[0]?.count ?? 0;

  const rows = await db
    .select({
      questionId: questionsTable.id,
      prompt: questionsTable.prompt,
      isMandatory: questionsTable.isMandatory,
      type: questionsTable.type,
      questionPosition: questionsTable.position,
      optionId: optionsTable.id,
      label: optionsTable.label,
      optionPosition: optionsTable.position,
      count: sql<number>`COALESCE(COUNT(${responseAnswersTable.id}), 0)::int`,
    })
    .from(questionsTable)
    .innerJoin(optionsTable, eq(optionsTable.questionId, questionsTable.id))
    .leftJoin(
      responseAnswersTable,
      and(
        eq(responseAnswersTable.questionId, questionsTable.id),
        eq(responseAnswersTable.optionId, optionsTable.id),
      ),
    )
    .where(eq(questionsTable.pollId, pollId))
    .groupBy(
      questionsTable.id,
      questionsTable.prompt,
      questionsTable.isMandatory,
      questionsTable.type,
      questionsTable.position,
      optionsTable.id,
      optionsTable.label,
      optionsTable.position,
    )
    .orderBy(questionsTable.position, optionsTable.position);

  const byQuestion = new Map<string, QuestionSummary>();
  for (const r of rows) {
    let q = byQuestion.get(r.questionId);
    if (!q) {
      q = {
        questionId: r.questionId,
        prompt: r.prompt,
        isMandatory: r.isMandatory,
        type: r.type as "single" | "multiple",
        totalAnswers: 0,
        options: [],
      };
      byQuestion.set(r.questionId, q);
    }
    q.options.push({
      optionId: r.optionId,
      label: r.label,
      count: r.count,
      percentage: 0,
    });
    q.totalAnswers += r.count;
  }
  for (const q of byQuestion.values()) {
    if (q.totalAnswers > 0) {
      for (const o of q.options) {
        o.percentage = Math.round((o.count / q.totalAnswers) * 1000) / 10;
      }
    }
  }

  const timeRows = await db
    .select({
      day: sql<string>`TO_CHAR(DATE_TRUNC('day', ${responsesTable.createdAt}), 'YYYY-MM-DD')`,
      count: sql<number>`COUNT(*)::int`,
    })
    .from(responsesTable)
    .where(eq(responsesTable.pollId, pollId))
    .groupBy(sql`DATE_TRUNC('day', ${responsesTable.createdAt})`)
    .orderBy(sql`DATE_TRUNC('day', ${responsesTable.createdAt})`);

  let respondents: RespondentSummary[] | undefined;
  if (opts.includeRespondents) {
    const respRows = await db
      .select({
        responseId: responsesTable.id,
        userId: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        submittedAt: responsesTable.createdAt,
      })
      .from(responsesTable)
      .leftJoin(usersTable, eq(usersTable.id, responsesTable.respondentId))
      .where(eq(responsesTable.pollId, pollId))
      .orderBy(desc(responsesTable.createdAt));

    respondents = respRows.map((r) => ({
      responseId: r.responseId,
      userId: r.userId,
      name: r.name,
      email: r.email,
      submittedAt: r.submittedAt.toISOString(),
    }));
  }

  return {
    pollId,
    totalResponses,
    questions: Array.from(byQuestion.values()),
    responsesOverTime: timeRows.map((r) => ({ date: r.day, count: r.count })),
    respondents,
  };
};

export {
  getAnalytics,
  type AnalyticsResult,
  type QuestionSummary,
  type RespondentSummary,
};
