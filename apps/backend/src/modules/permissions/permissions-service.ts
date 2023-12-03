import { eq } from "drizzle-orm";
import { getDatabase } from "../../database";
import { permissionsTable } from "../../database/schemas/permission";
import type {
  TCreatePermissionBodySchema,
  TGetAllPermissionsQuerySchema,
  TGetSinglePermissionQuerySchema,
  TUpdatePermissionBodySchema,
} from "./dto";

export default class PermissionsService {
  getAllPermissions = async (dto: TGetAllPermissionsQuerySchema) => {
    const db = getDatabase();
    const permissions = await db.query.permissions.findMany({
      with: {
        groupPermission: {
          with: {
            group: dto.with_groups || undefined,
          },
        },
      },
      limit: dto.limit || 25,
      offset: dto.offset || 0,
    });

    return permissions;
  };

  getSinglePermission = async (
    id: number,
    dto: TGetSinglePermissionQuerySchema
  ) => {
    const db = getDatabase();
    const permission = await db.query.permissions.findMany({
      where: eq(permissionsTable, id),
      with: {
        groupPermission: {
          with: {
            group: dto.with_groups || undefined,
          },
        },
      },
    });

    if (permission.length === 0) {
      return null;
    }

    return permission[0];
  };

  createPermission = async (dto: TCreatePermissionBodySchema) => {
    const db = getDatabase();
    const permission = await db
      .insert(permissionsTable)
      .values({
        name: dto.name,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning();

    return permission[0];
  };

  updatePermission = async (id: number, dto: TUpdatePermissionBodySchema) => {
    const db = getDatabase();
    const permission = await db
      .update(permissionsTable)
      .set({
        name: dto.name || undefined,
        updated_at: new Date(),
      })
      .where(eq(permissionsTable.id, id))
      .returning();

    if (permission.length === 0) {
      return null;
    }

    return permission[0];
  };

  deletePermission = async (id: number) => {
    const db = getDatabase();
    const permission = await db
      .delete(permissionsTable)
      .where(eq(permissionsTable.id, id))
      .returning();

    if (permission.length === 0) {
      return null;
    }

    return permission[0];
  };

  getPermissionByName = async (name: string) => {
    const db = getDatabase();
    const permission = await db.query.permissions.findMany({
      where: eq(permissionsTable.name, name),
      with: {
        groupPermission: {
          columns: {
            permission_id: false,
            group_id: false,
          },
          with: {
            group: true,
          },
        },
      },
    });

    if (permission.length === 0) {
      return null;
    }

    return permission[0];
  };
}
