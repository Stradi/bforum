import { relations } from "drizzle-orm";
import type { AnySQLiteColumn } from "drizzle-orm/sqlite-core";
import { integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { accountsTable } from "./account"; // eslint-disable-line import/no-cycle -- there's nothing we can do
import { groupsTable } from "./group"; // eslint-disable-line import/no-cycle -- there's nothing we can do

export const accountGroupTable = sqliteTable("account_group", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  created_at: integer("created_at", { mode: "timestamp" }),
  updated_at: integer("updated_at", { mode: "timestamp" }),

  account_id: integer("account_id", { mode: "number" })
    .notNull()
    .references((): AnySQLiteColumn => accountsTable.id),
  group_id: integer("group_id", { mode: "number" })
    .notNull()
    .references((): AnySQLiteColumn => groupsTable.id),
});

export const accountGroupRelations = relations(
  accountGroupTable,
  ({ one }) => ({
    account: one(accountsTable, {
      fields: [accountGroupTable.account_id],
      references: [accountsTable.id],
    }),
    group: one(groupsTable, {
      fields: [accountGroupTable.group_id],
      references: [groupsTable.id],
    }),
  })
);
