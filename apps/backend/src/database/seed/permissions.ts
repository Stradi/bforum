import { and, eq, sql } from "drizzle-orm";
// eslint-disable-next-line import/no-cycle -- there's nothing we can do
import { getDatabase } from "..";
import { log } from "../../utils/logger";
import * as groupPermissionSchema from "../schemas/group-permission";
import * as permissionsSchema from "../schemas/permission";
import { DefaultGroupIds, DefaultGroups } from "./groups";

type Resource = "Node" | "Thread" | "Reply" | "Group" | "Permission";
type Scope = string;
type BaseActions = "List" | "Read" | "Create" | "Update" | "Delete";
type NodeActions = BaseActions | "UpdateOrder";
type Action = BaseActions | NodeActions;

type PermissionString =
  | `${Resource}.${Scope}.${Action}`
  | `${Resource}.${Action}`;

const DefaultPermissionMatrix: Record<
  (typeof DefaultGroups)[number],
  PermissionString[]
> = {
  Admin: [
    "Node.List",
    "Node.*.Read",
    "Node.Create",
    "Node.*.Update",
    "Node.*.Delete",
    "Node.UpdateOrder",

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

    "Group.List",
    "Group.*.Read",
    "Group.Create",
    "Group.*.Update",
    "Group.*.Delete",

    "Permission.List",
    "Permission.*.Read",
    "Permission.Create",
    "Permission.*.Update",
    "Permission.*.Delete",
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

    "Group.List",
    "Group.*.Read",

    "Permission.List",
    "Permission.*.Read",
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

export async function seedPermissions() {
  for await (const groupName of DefaultGroups) {
    const groupId = DefaultGroupIds[groupName];

    for await (const permissionName of DefaultPermissionMatrix[groupName]) {
      const permission = await createPermissionOrDie(permissionName);
      await createGroupPermissionOrDie(groupId, permission.id);
    }
  }
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
