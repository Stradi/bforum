import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { accountGroupTable } from "./account-group"; // eslint-disable-line import/no-cycle -- there's nothing we can do

export const accountsTable = sqliteTable("accounts", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  created_at: integer("created_at", { mode: "timestamp" }),
  updated_at: integer("updated_at", { mode: "timestamp" }),

  username: text("username", { mode: "text" }).notNull().unique(),
  email: text("email", { mode: "text" }).notNull().unique(),
  password_hash: text("password", { mode: "text" }).notNull(),
  display_name: text("display_name", { mode: "text" }).notNull(),
});

export const accountsRelations = relations(accountsTable, ({ many }) => ({
  accountGroup: many(accountGroupTable),
}));
