import Database from "bun:sqlite";
import { and, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { log } from "../utils/logger";
import * as accountsSchema from "./schemas/account";
import * as accountGroupSchema from "./schemas/account-group";
import * as groupsSchema from "./schemas/group";
import * as groupPermissionSchema from "./schemas/group-permission";
import * as nodesSchema from "./schemas/node";
import * as permissionsSchema from "./schemas/permission";
import * as repliesSchema from "./schemas/reply";
import * as threadsSchema from "./schemas/thread";

export function getDatabase() {
  const file = new Database("main.db", {
    create: true,
  });

  return drizzle(file, {
    schema: {
      nodes: nodesSchema.nodesTable,
      threads: threadsSchema.threadsTable,
      replies: repliesSchema.repliesTable,
      accounts: accountsSchema.accountsTable,
      groups: groupsSchema.groupsTable,
      accountGroup: accountGroupSchema.accountGroupTable,
      permissions: permissionsSchema.permissionsTable,
      groupPermission: groupPermissionSchema.groupPermissionTable,

      nodesRelations: nodesSchema.nodesRelations,
      threadsRelations: threadsSchema.threadRelations,
      repliesRelations: repliesSchema.repliesRelations,
      accountsRelations: accountsSchema.accountsRelations,
      groupsRelations: groupsSchema.groupsRelations,
      accountToGroupsRelations: accountGroupSchema.accountGroupRelations,
      permissionsRelations: permissionsSchema.permissionsRelations,
      groupPermissionsRelations: groupPermissionSchema.groupPermissionRelations,
    },
  });
}

export function runMigrations() {
  const db = getDatabase();

  migrate(db, {
    migrationsFolder: "drizzle",
  });
}

export async function seedDatabase() {
  await seedPermissionsAndGroups();
}

async function seedPermissionsAndGroups() {
  // TODO: For Testing...
  const permissionMatrix = {
    Admin: [
      "Node.List",
      "Node.*.Read",
      "Node.Create",
      "Node.*.Update",
      "Node.*.Delete",
      "Thread.List",
      "Thread.*.Read",
      "Thread.Create",
      "Thread.*.Update",
      "Thread.*.Delete",
      "Reply.List",
      "Reply.*.Read",
      "Reply.Create",
      "Reply.*.Update",
      "Reply.*.Delete",
    ],
    User: [
      "Node.List",
      "Node.*.Read",
      "Node.&.Update",
      "Node.&.Delete",
      "Thread.List",
      "Thread.*.Read",
      "Thread.Create",
      "Thread.&.Update",
      "Thread.&.Delete",
      "Reply.List",
      "Reply.*.Read",
      "Reply.Create",
      "Reply.&.Update",
      "Reply.&.Delete",
    ],
    Anonymous: [
      "Node.List",
      "Node.Read",
      "Thread.List",
      "Thread.Read",
      "Reply.List",
      "Reply.Read",
    ],
  };

  for await (const [groupName, permissionNames] of Object.entries(
    permissionMatrix
  )) {
    const group = await createGroupOrDie(groupName);

    for await (const permissionName of permissionNames) {
      const permission = await createPermissionOrDie(permissionName);
      await createGroupPermissionOrDie(group.id, permission.id);
    }
  }
}

async function createGroupOrDie(groupName: string) {
  const db = getDatabase();

  const exists = await db
    .select({
      count: sql<number>`COUNT(*)`.mapWith(Number),
      id: sql<number>`id`.mapWith(Number),
    })
    .from(groupsSchema.groupsTable)
    .where(eq(groupsSchema.groupsTable.name, groupName));

  if (exists[0].count > 0) {
    return exists[0];
  }

  const group = await db
    .insert(groupsSchema.groupsTable)
    .values({
      name: groupName,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .onConflictDoNothing()
    .returning();

  if (group.length === 0) {
    log.fatal(`Failed to create group '${groupName}'`);
    process.exit(1);
  }

  return group[0];
}

async function createPermissionOrDie(permissionName: string) {
  const db = getDatabase();

  const exists = await db
    .select({
      count: sql<number>`COUNT(*)`.mapWith(Number),
      id: sql<number>`id`.mapWith(Number),
    })
    .from(permissionsSchema.permissionsTable)
    .where(eq(permissionsSchema.permissionsTable.name, permissionName));

  if (exists[0].count > 0) {
    return exists[0];
  }

  const permission = await db
    .insert(permissionsSchema.permissionsTable)
    .values({
      name: permissionName,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .onConflictDoNothing()
    .returning();

  if (permission.length === 0) {
    log.fatal(`Failed to create permission '${permissionName}'`);
    process.exit(1);
  }

  return permission[0];
}

async function createGroupPermissionOrDie(
  groupId: number,
  permissionId: number
) {
  const db = getDatabase();

  const exists = await db
    .select({
      count: sql<number>`COUNT(*)`.mapWith(Number),
    })
    .from(groupPermissionSchema.groupPermissionTable)
    .where(
      and(
        eq(groupPermissionSchema.groupPermissionTable.group_id, groupId),
        eq(
          groupPermissionSchema.groupPermissionTable.permission_id,
          permissionId
        )
      )
    );

  if (exists[0].count > 0) {
    return exists[0];
  }

  const groupPermission = await db
    .insert(groupPermissionSchema.groupPermissionTable)
    .values({
      group_id: groupId,
      permission_id: permissionId,
    })
    .onConflictDoNothing()
    .returning();

  if (groupPermission.length === 0) {
    log.fatal(
      `Failed to create group permission '${groupId}' '${permissionId}'`
    );
    process.exit(1);
  }

  return groupPermission[0];
}
