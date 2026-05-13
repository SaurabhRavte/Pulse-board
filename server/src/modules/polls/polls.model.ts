import { and, eq, sql, desc } from "drizzle-orm";
import { db } from "../../common/db/index";
import {
  pollsTable,
  questionsTable,
  optionsTable,
  responsesTable,
  responseAnswersTable,
  type Poll,
} from "../../common/db/schema";

interface CreatePollData {
  creatorId: string;
  title: string;
  description?: string | null;
  slug: string;
  responseMode: "anonymous" | "authenticated";
  expiresAt: Date | null;
  questions: Array<{
    prompt: string;
    isMandatory: boolean;
    type: "single" | "multiple";
    options: string[];
  }>;
}

const PollModel = {
  async createWithQuestions(data: CreatePollData): Promise<Poll> {
    return await db.transaction(async (tx) => {
      const [poll] = await tx
        .insert(pollsTable)
        .values({
          creatorId: data.creatorId,
          title: data.title,
          description: data.description ?? null,
          slug: data.slug,
          responseMode: data.responseMode,
          expiresAt: data.expiresAt,
        })
        .returning();

      for (const [qIdx, q] of data.questions.entries()) {
        const [question] = await tx
          .insert(questionsTable)
          .values({
            pollId: poll!.id,
            prompt: q.prompt,
            isMandatory: q.isMandatory,
            type: q.type ?? "single",
            position: qIdx,
          })
          .returning();

        await tx.insert(optionsTable).values(
          q.options.map((label, oIdx) => ({
            questionId: question!.id,
            label,
            position: oIdx,
          })),
        );
      }

      return poll!;
    });
  },

  async findById(id: string): Promise<Poll | undefined> {
    const rows = await db
      .select()
      .from(pollsTable)
      .where(eq(pollsTable.id, id))
      .limit(1);
    return rows[0];
  },

  async findBySlug(slug: string): Promise<Poll | undefined> {
    const rows = await db
      .select()
      .from(pollsTable)
      .where(eq(pollsTable.slug, slug))
      .limit(1);
    return rows[0];
  },

  async findFullById(id: string) {
    return await db.query.pollsTable.findFirst({
      where: eq(pollsTable.id, id),
      with: {
        questions: {
          orderBy: (q, { asc }) => [asc(q.position)],
          with: {
            options: {
              orderBy: (o, { asc }) => [asc(o.position)],
            },
          },
        },
      },
    });
  },

  async findFullBySlug(slug: string) {
    return await db.query.pollsTable.findFirst({
      where: eq(pollsTable.slug, slug),
      with: {
        questions: {
          orderBy: (q, { asc }) => [asc(q.position)],
          with: {
            options: {
              orderBy: (o, { asc }) => [asc(o.position)],
            },
          },
        },
      },
    });
  },

  async listByCreator(creatorId: string) {
    return await db
      .select({
        id: pollsTable.id,
        title: pollsTable.title,
        slug: pollsTable.slug,
        status: pollsTable.status,
        responseMode: pollsTable.responseMode,
        expiresAt: pollsTable.expiresAt,
        resultsPublished: pollsTable.resultsPublished,
        createdAt: pollsTable.createdAt,
        responseCount: sql<number>`COALESCE(COUNT(${responsesTable.id}), 0)::int`,
      })
      .from(pollsTable)
      .leftJoin(responsesTable, eq(responsesTable.pollId, pollsTable.id))
      .where(eq(pollsTable.creatorId, creatorId))
      .groupBy(pollsTable.id)
      .orderBy(desc(pollsTable.createdAt));
  },

  async updateStatus(
    id: string,
    status: "draft" | "active" | "closed" | "published",
  ): Promise<void> {
    await db
      .update(pollsTable)
      .set({ status, updatedAt: new Date() })
      .where(eq(pollsTable.id, id));
  },

  async publishResults(id: string): Promise<void> {
    await db
      .update(pollsTable)
      .set({
        resultsPublished: true,
        status: "published",
        updatedAt: new Date(),
      })
      .where(eq(pollsTable.id, id));
  },

  async deleteById(id: string, creatorId: string): Promise<number> {
    const rows = await db
      .delete(pollsTable)
      .where(and(eq(pollsTable.id, id), eq(pollsTable.creatorId, creatorId)))
      .returning({ id: pollsTable.id });
    return rows.length;
  },

  async loadQuestionsAndOptions(pollId: string) {
    return await db.query.pollsTable.findFirst({
      where: eq(pollsTable.id, pollId),
      columns: { id: true },
      with: {
        questions: {
          columns: { id: true, isMandatory: true, type: true },
          with: { options: { columns: { id: true } } },
        },
      },
    });
  },

  async recordResponse(input: {
    pollId: string;
    respondentId: string | null;
    ipHash: string | null;
    answers: Array<{ questionId: string; optionId: string }>;
  }) {
    return await db.transaction(async (tx) => {
      const [response] = await tx
        .insert(responsesTable)
        .values({
          pollId: input.pollId,
          respondentId: input.respondentId,
          ipHash: input.ipHash,
        })
        .returning();

      if (input.answers.length > 0) {
        await tx.insert(responseAnswersTable).values(
          input.answers.map((a) => ({
            responseId: response!.id,
            questionId: a.questionId,
            optionId: a.optionId,
          })),
        );
      }

      const totalRow = await tx
        .select({ count: sql<number>`COUNT(*)::int` })
        .from(responsesTable)
        .where(eq(responsesTable.pollId, input.pollId));
      const totalResponses = totalRow[0]?.count ?? 0;

      const counts = await tx
        .select({
          optionId: responseAnswersTable.optionId,
          count: sql<number>`COUNT(*)::int`,
        })
        .from(responseAnswersTable)
        .innerJoin(
          responsesTable,
          eq(responsesTable.id, responseAnswersTable.responseId),
        )
        .where(eq(responsesTable.pollId, input.pollId))
        .groupBy(responseAnswersTable.optionId);

      const optionCounts: Record<string, number> = {};
      for (const row of counts) optionCounts[row.optionId] = row.count;

      return { responseId: response!.id, totalResponses, optionCounts };
    });
  },

  async hasResponded(pollId: string, respondentId: string): Promise<boolean> {
    const rows = await db
      .select({ id: responsesTable.id })
      .from(responsesTable)
      .where(
        and(
          eq(responsesTable.pollId, pollId),
          eq(responsesTable.respondentId, respondentId),
        ),
      )
      .limit(1);
    return rows.length > 0;
  },
};

export default PollModel;
