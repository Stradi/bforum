import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { nodesTable } from "./node"; // eslint-disable-line import/no-cycle -- there's nothing we can do

export const threadsTable = sqliteTable("threads", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  created_at: integer("created_at", { mode: "timestamp" }),
  updated_at: integer("updated_at", { mode: "timestamp" }),

  node_id: integer("node_id", { mode: "number" }).references(
    () => nodesTable.id
  ),

  name: text("name", { mode: "text" }).notNull(),
  slug: text("slug", { mode: "text" }).notNull().unique(),

  // TODO: Add type, and author_id
});

export const threadRelations = relations(threadsTable, ({ one }) => ({
  node: one(nodesTable, {
    fields: [threadsTable.node_id],
    references: [nodesTable.id],
  }),
}));
