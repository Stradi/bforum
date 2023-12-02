import { relations } from "drizzle-orm";
import type { AnySQLiteColumn } from "drizzle-orm/sqlite-core";
import { integer, primaryKey, sqliteTable } from "drizzle-orm/sqlite-core";
import { groupsTable } from "./group"; // eslint-disable-line import/no-cycle -- there's nothing we can do
import { permissionsTable } from "./permission"; // eslint-disable-line import/no-cycle -- there's nothing we can do

export const groupPermissionTable = sqliteTable(
  "group_permission",
  {
    group_id: integer("group_id", { mode: "number" })
      .notNull()
      .references((): AnySQLiteColumn => groupsTable.id),
    permission_id: integer("permission_id", { mode: "number" })
      .notNull()
      .references((): AnySQLiteColumn => permissionsTable.id),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.group_id, table.permission_id] }),
    };
  }
);

export const groupPermissionRelations = relations(
  groupPermissionTable,
  ({ one }) => ({
    group: one(groupsTable, {
      fields: [groupPermissionTable.group_id],
      references: [groupsTable.id],
    }),
    permission: one(permissionsTable, {
      fields: [groupPermissionTable.permission_id],
      references: [permissionsTable.id],
    }),
  })
);
