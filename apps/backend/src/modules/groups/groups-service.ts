import { and, eq } from "drizzle-orm";
import { getDatabase } from "../../database";
import { accountGroupTable } from "../../database/schemas/account-group";
import { groupsTable } from "../../database/schemas/group";
import { groupPermissionTable } from "../../database/schemas/group-permission";
import type {
  TCreateGroupBodySchema,
  TGetAllGroupsQuerySchema,
  TGetSingleGroupQuerySchema,
  TUpdateGroupBodySchema,
  TUpdateGroupPermissionsBodySchema,
} from "./dto";

export default class GroupsService {
  getAllGroups = async (dto: TGetAllGroupsQuerySchema) => {
    const db = getDatabase();
    const groups = await db.query.groups.findMany({
      with: {
        groupPermission: {
          with: {
            permission: dto.with_permissions || undefined,
          },
        },
        accountGroup: {
          with: {
            account: dto.with_accounts || undefined,
          },
        },
      },
      limit: dto.limit || 25,
      offset: dto.offset || 0,
    });

    return groups;
  };

  getSingleGroup = async (id: number, dto: TGetSingleGroupQuerySchema) => {
    const db = getDatabase();
    const group = await db.query.groups.findMany({
      where: eq(groupsTable.id, id),
      with: {
        groupPermission: {
          with: {
            permission: dto.with_permissions || undefined,
          },
        },
        accountGroup: {
          with: {
            account: dto.with_accounts || undefined,
          },
        },
      },
    });

    if (group.length === 0) {
      return null;
    }

    return group[0];
  };

  createGroup = async (dto: TCreateGroupBodySchema) => {
    const db = getDatabase();
    const group = await db
      .insert(groupsTable)
      .values({
        name: dto.name,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning();

    return group[0];
  };

  updateGroup = async (id: number, dto: TUpdateGroupBodySchema) => {
    const db = getDatabase();
    const group = await db
      .update(groupsTable)
      .set({
        name: dto.name || undefined,
        updated_at: new Date(),
      })
      .where(eq(groupsTable.id, id))
      .returning();

    if (group.length === 0) {
      return null;
    }

    return group[0];
  };

  deleteGroup = async (id: number) => {
    const db = getDatabase();
    const group = await db
      .delete(groupsTable)
      .where(eq(groupsTable.id, id))
      .returning();

    await db
      .delete(accountGroupTable)
      .where(eq(accountGroupTable.group_id, id));
    await db
      .delete(groupPermissionTable)
      .where(eq(groupPermissionTable.group_id, id));

    if (group.length === 0) {
      return null;
    }

    return group[0];
  };

  updatePermissions = async (dto: TUpdateGroupPermissionsBodySchema) => {
    const db = getDatabase();

    const affectedGroups = [];

    for await (const update of dto) {
      if (update.allowed) {
        const result = await db
          .insert(groupPermissionTable)
          .values({
            group_id: update.groupId,
            permission_id: update.permissionId,
          })
          .onConflictDoNothing()
          .returning();
        affectedGroups.push(result[0]);
      } else {
        const result = await db
          .delete(groupPermissionTable)
          .where(
            and(
              eq(groupPermissionTable.group_id, update.groupId),
              eq(groupPermissionTable.permission_id, update.permissionId)
            )
          )
          .returning();
        affectedGroups.push(result[0]);
      }
    }

    return affectedGroups;
  };
}
