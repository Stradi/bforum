import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
// eslint-disable-next-line import/no-cycle -- there's nothing we can do
import { node } from "./node";

export const thread = sqliteTable("thread", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  created_at: integer("created_at", { mode: "timestamp" }),
  updated_at: integer("updated_at", { mode: "timestamp" }),

  node_id: integer("node_id", { mode: "number" }).references(() => node.id),

  name: text("name", { mode: "text" }).notNull(),
  slug: text("slug", { mode: "text" }).notNull().unique(),

  // TODO: Add type, and author_id
});

export const threadRelations = relations(thread, ({ one }) => ({
  node: one(node, {
    fields: [thread.node_id],
    references: [node.id],
  }),
}));
