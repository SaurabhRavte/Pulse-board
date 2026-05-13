import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const responseModeEnum = pgEnum("response_mode", [
  "anonymous",
  "authenticated",
]);

export const pollStatusEnum = pgEnum("poll_status", [
  "draft",
  "active",
  "closed",
  "published",
]);

// User Schema

export const usersTable = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 120 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    // Null when the user signed up only via Clerk (OAuth)
    passwordHash: varchar("password_hash", { length: 255 }),
    // Clerk user id — present for users who signed up through Clerk
    clerkId: varchar("clerk_id", { length: 191 }),
    refreshTokenHash: varchar("refresh_token_hash", { length: 255 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    emailIdx: uniqueIndex("users_email_idx").on(table.email),
    clerkIdx: uniqueIndex("users_clerk_id_idx").on(table.clerkId),
  }),
);

// Poll Schema

export const pollsTable = pgTable(
  "polls",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    creatorId: uuid("creator_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 200 }).notNull(),
    description: text("description"),
    slug: varchar("slug", { length: 32 }).notNull(),
    responseMode: responseModeEnum("response_mode")
      .notNull()
      .default("anonymous"),
    status: pollStatusEnum("status").notNull().default("active"),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    resultsPublished: boolean("results_published").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    slugIdx: uniqueIndex("polls_slug_idx").on(table.slug),
    creatorIdx: index("polls_creator_idx").on(table.creatorId),
  }),
);

// Questions Schema

export const questionsTable = pgTable(
  "questions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    pollId: uuid("poll_id")
      .notNull()
      .references(() => pollsTable.id, { onDelete: "cascade" }),
    prompt: varchar("prompt", { length: 500 }).notNull(),
    isMandatory: boolean("is_mandatory").notNull().default(true),
    position: integer("position").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    pollIdx: index("questions_poll_idx").on(table.pollId),
  }),
);

// Options Schema

export const optionsTable = pgTable(
  "options",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    questionId: uuid("question_id")
      .notNull()
      .references(() => questionsTable.id, { onDelete: "cascade" }),
    label: varchar("label", { length: 200 }).notNull(),
    position: integer("position").notNull().default(0),
  },
  (table) => ({
    questionIdx: index("options_question_idx").on(table.questionId),
  }),
);

// Responses (one row per submission)

export const responsesTable = pgTable(
  "responses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    pollId: uuid("poll_id")
      .notNull()
      .references(() => pollsTable.id, { onDelete: "cascade" }),
    respondentId: uuid("respondent_id").references(() => usersTable.id, {
      onDelete: "set null",
    }),
    // Hashed IP — for dedup / abuse mitigation only, never returned to clients
    ipHash: varchar("ip_hash", { length: 64 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    pollIdx: index("responses_poll_idx").on(table.pollId),
    respondentIdx: index("responses_respondent_idx").on(table.respondentId),
  }),
);

// Response answers (one row per answered question)

export const responseAnswersTable = pgTable(
  "response_answers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    responseId: uuid("response_id")
      .notNull()
      .references(() => responsesTable.id, { onDelete: "cascade" }),
    questionId: uuid("question_id")
      .notNull()
      .references(() => questionsTable.id, { onDelete: "cascade" }),
    optionId: uuid("option_id")
      .notNull()
      .references(() => optionsTable.id, { onDelete: "cascade" }),
  },
  (table) => ({
    responseIdx: index("answers_response_idx").on(table.responseId),
    questionIdx: index("answers_question_idx").on(table.questionId),
    optionIdx: index("answers_option_idx").on(table.optionId),
  }),
);

// Relations  Schema

export const usersRelations = relations(usersTable, ({ many }) => ({
  polls: many(pollsTable),
  responses: many(responsesTable),
}));

export const pollsRelations = relations(pollsTable, ({ one, many }) => ({
  creator: one(usersTable, {
    fields: [pollsTable.creatorId],
    references: [usersTable.id],
  }),
  questions: many(questionsTable),
  responses: many(responsesTable),
}));

export const questionsRelations = relations(
  questionsTable,
  ({ one, many }) => ({
    poll: one(pollsTable, {
      fields: [questionsTable.pollId],
      references: [pollsTable.id],
    }),
    options: many(optionsTable),
    answers: many(responseAnswersTable),
  }),
);

export const optionsRelations = relations(optionsTable, ({ one, many }) => ({
  question: one(questionsTable, {
    fields: [optionsTable.questionId],
    references: [questionsTable.id],
  }),
  answers: many(responseAnswersTable),
}));

export const responsesRelations = relations(
  responsesTable,
  ({ one, many }) => ({
    poll: one(pollsTable, {
      fields: [responsesTable.pollId],
      references: [pollsTable.id],
    }),
    respondent: one(usersTable, {
      fields: [responsesTable.respondentId],
      references: [usersTable.id],
    }),
    answers: many(responseAnswersTable),
  }),
);

export const responseAnswersRelations = relations(
  responseAnswersTable,
  ({ one }) => ({
    response: one(responsesTable, {
      fields: [responseAnswersTable.responseId],
      references: [responsesTable.id],
    }),
    question: one(questionsTable, {
      fields: [responseAnswersTable.questionId],
      references: [questionsTable.id],
    }),
    option: one(optionsTable, {
      fields: [responseAnswersTable.optionId],
      references: [optionsTable.id],
    }),
  }),
);

// Inferred types

export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;
export type Poll = typeof pollsTable.$inferSelect;
export type NewPoll = typeof pollsTable.$inferInsert;
export type Question = typeof questionsTable.$inferSelect;
export type Option = typeof optionsTable.$inferSelect;
export type ResponseRow = typeof responsesTable.$inferSelect;
export type ResponseAnswer = typeof responseAnswersTable.$inferSelect;
