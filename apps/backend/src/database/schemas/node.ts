import { relations } from "drizzle-orm";
import {
  integer,
  sqliteTable,
  text,
  type AnySQLiteColumn,
} from "drizzle-orm/sqlite-core";

/**
 * ### `Node` Schema
 *
 * `Node` refers to forum. It can have sub-forums. Think of it like a tree, where each branch can have sub-branches.
 *
 * An example of a `Node` is General Discussion or Off-Topic. General Discussion can have sub-forums like
 * Introductions or Announcements. Off-Topic can have sub-forums like Gaming, Anime, or Movies.
 *
 * Apart from default columns, `Node` has the following columns:
 *
 * | Column Name | Type | Description |
 * | ----------- | ---- | ----------- |
 * | `parent_id` | `integer` | The ID of the parent `Node`. If `null`, then it is a root `Node`. |
 * | `name` | `text` | The name of the `Node`. |
 * | `slug` | `text` | The slug of the `Node`. |
 * | `description` | `text` | The description of the `Node`. |
 */
export const node = sqliteTable("node", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  created_at: integer("created_at", { mode: "timestamp" }),
  updated_at: integer("updated_at", { mode: "timestamp" }),

  parent_id: integer("parent_id", { mode: "number" }).references(
    (): AnySQLiteColumn => node.id
  ),

  name: text("name", { mode: "text" }).notNull(),
  slug: text("slug", { mode: "text" }).notNull().unique(),
  description: text("description", { mode: "text" }).notNull(),
});

export const nodeRelations = relations(node, ({ one }) => ({
  parent: one(node, {
    fields: [node.parent_id],
    references: [node.id],
  }),
}));
