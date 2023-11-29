import { relations } from "drizzle-orm";
import type { AnySQLiteColumn } from "drizzle-orm/sqlite-core";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { threadsTable } from "./thread"; // eslint-disable-line import/no-cycle -- there's nothing we can do

export const repliesTable = sqliteTable("replies", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  created_at: integer("created_at", { mode: "timestamp" }),
  updated_at: integer("updated_at", { mode: "timestamp" }),

  thread_id: integer("thread_id", { mode: "number" }).references(
    () => threadsTable.id
  ),

  body: text("body", { mode: "text" }).notNull(),
  reply_to_id: integer("reply_to_id", { mode: "number" }).references(
    (): AnySQLiteColumn => repliesTable.id
  ),
});

export const repliesRelations = relations(repliesTable, ({ one, many }) => ({
  thread: one(threadsTable, {
    fields: [repliesTable.thread_id],
    references: [threadsTable.id],
  }),

  repliedTo: one(repliesTable, {
    fields: [repliesTable.reply_to_id],
    references: [repliesTable.id],
    relationName: "repliedTo",
  }),

  // This is a hack for self-referencing many-to-many relations.
  // Thanks to @arpadgabor on GitHub for the solution:
  // https://github.com/drizzle-team/drizzle-orm/issues/674#issuecomment-1676472956
  _repliesOne: one(repliesTable, {
    fields: [repliesTable.reply_to_id],
    references: [repliesTable.id],
    relationName: "replies",
  }),
  replies: many(repliesTable, {
    relationName: "replies",
  }),
}));
