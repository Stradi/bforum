import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { accountsTable } from "./account";
import { nodesTable } from "./node"; // eslint-disable-line import/no-cycle -- there's nothing we can do
import { repliesTable } from "./reply"; // eslint-disable-line import/no-cycle -- there's nothing we can do

/**
 * ### `Thread` Schema
 *
 * `Thread` refers to a discussion in a forum. In bForum, `Thread` doesn't have a body attached to it.
 * Instead, it has multiple `Post`s. `Post`s are the actual messages in a `Thread`.
 *
 * An example of a `Thread` is "What are you currently reading?" or "What are you currently watching?".
 * Remember, `Thread` doesn't have a body, so the first post in the thread will be the body.
 *
 * In the future, we should add a `type` column to `Thread`. This will allow us to have different types of
 * `Thread`s. For example, we can have a `Thread` type called "Poll". In front-end, we can render the
 * `Thread` differently depending on the `type`.
 *
 * Apart from default columns, `Thread` has the following columns:
 *
 * | Column Name | Type | Description |
 * | ----------- | ---- | ----------- |
 * | `node_id` | `integer` | The ID of the `Node` that this `Thread` belongs to. |
 * | `name` | `text` | The name of the `Thread`. |
 * | `slug` | `text` | The slug of the `Thread`. |
 * | `created_by` | `integer` | The ID of the `Account` that created the `Thread`. |
 */
export const threadsTable = sqliteTable("threads", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  created_at: integer("created_at", { mode: "timestamp" }),
  updated_at: integer("updated_at", { mode: "timestamp" }),

  node_id: integer("node_id", { mode: "number" }).references(
    () => nodesTable.id
  ),

  name: text("name", { mode: "text" }).notNull(),
  slug: text("slug", { mode: "text" }).notNull().unique(),
  created_by: integer("created_by", { mode: "number" }).notNull(),

  // TODO: Add type
});

export const threadRelations = relations(threadsTable, ({ one, many }) => ({
  node: one(nodesTable, {
    fields: [threadsTable.node_id],
    references: [nodesTable.id],
  }),
  replies: many(repliesTable),
  creator: one(accountsTable, {
    fields: [threadsTable.created_by],
    references: [accountsTable.id],
  }),
}));
