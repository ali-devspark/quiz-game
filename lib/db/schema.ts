import { sqliteTable, text, integer, primaryKey, unique } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";

export const users = sqliteTable("user", {
    id: text("id").primaryKey(),
    name: text("name"),
    email: text("email").unique(),
    emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
    image: text("image"),
    password: text("password"),
    plan: text("plan").default("FREE"),
    createdAt: integer("createdAt", { mode: "timestamp_ms" })
        .notNull()
        .default(sql`(strftime('%s', 'now') * 1000)`),
    updatedAt: integer("updatedAt", { mode: "timestamp_ms" })
        .notNull()
        .default(sql`(strftime('%s', 'now') * 1000)`),
});

export const accounts = sqliteTable("account", {
    id: text("id").primaryKey(),
    userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
},
    (account) => ({
        providerUnique: unique().on(account.provider, account.providerAccountId),
    })
);

export const sessions = sqliteTable("session", {
    id: text("id").primaryKey(),
    sessionToken: text("sessionToken").notNull().unique(),
    userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const verificationTokens = sqliteTable(
    "verificationToken",
    {
        identifier: text("identifier").notNull(),
        token: text("token").notNull().unique(),
        expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
    },
    (vt) => ({
        compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
    })
);

export const quizzes = sqliteTable("quiz", {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description"),
    published: integer("published", { mode: "boolean" }).notNull().default(false),
    authorId: text("authorId")
        .notNull()
        .references(() => users.id),
    createdAt: integer("createdAt", { mode: "timestamp_ms" })
        .notNull()
        .default(sql`(strftime('%s', 'now') * 1000)`),
    updatedAt: integer("updatedAt", { mode: "timestamp_ms" })
        .notNull()
        .default(sql`(strftime('%s', 'now') * 1000)`),
});

export const questions = sqliteTable("question", {
    id: text("id").primaryKey(),
    text: text("text").notNull(),
    quizId: text("quizId")
        .notNull()
        .references(() => quizzes.id),
});

export const choices = sqliteTable("choice", {
    id: text("id").primaryKey(),
    text: text("text").notNull(),
    isCorrect: integer("isCorrect", { mode: "boolean" }).notNull().default(false),
    questionId: text("questionId")
        .notNull()
        .references(() => questions.id),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
    accounts: many(accounts),
    sessions: many(sessions),
    quizzes: many(quizzes),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
    user: one(users, {
        fields: [accounts.userId],
        references: [users.id],
    }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
    user: one(users, {
        fields: [sessions.userId],
        references: [users.id],
    }),
}));

export const quizzesRelations = relations(quizzes, ({ one, many }) => ({
    author: one(users, {
        fields: [quizzes.authorId],
        references: [users.id],
    }),
    questions: many(questions),
}));

export const questionsRelations = relations(questions, ({ one, many }) => ({
    quiz: one(quizzes, {
        fields: [questions.quizId],
        references: [quizzes.id],
    }),
    choices: many(choices),
}));

export const choicesRelations = relations(choices, ({ one }) => ({
    question: one(questions, {
        fields: [choices.questionId],
        references: [questions.id],
    }),
}));
