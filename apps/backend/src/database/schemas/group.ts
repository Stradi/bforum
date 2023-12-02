import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { accountGroupTable } from "./account-group"; // eslint-disable-line import/no-cycle -- there's nothing we can do

export const groupsTable = sqliteTable("groups", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  created_at: integer("created_at", { mode: "timestamp" }),
  updated_at: integer("updated_at", { mode: "timestamp" }),

  name: text("name", { mode: "text" }).notNull().unique(),
});

export const groupsRelations = relations(groupsTable, ({ many }) => ({
  accountGroup: many(accountGroupTable),
}));
