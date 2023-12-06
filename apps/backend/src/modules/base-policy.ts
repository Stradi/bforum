import { and, eq, sql } from "drizzle-orm";
import { getDatabase } from "../database";
import { groupPermissionTable } from "../database/schemas/group-permission";
import type { JwtPayload } from "../types/jwt";
import PermissionsService from "./permissions/permissions-service";

export default class BasePolicy {
  private permissionsService = new PermissionsService();

  public async isGroupAllowed(
    permissionName: string,
    accountData: JwtPayload | null
  ) {
    const groups = accountData?.groups ?? [
      {
        // TODO: We should not hardcode this...
        id: 3, // Anonymous
      },
    ];

    const permission = await this.getPermission(permissionName);
    if (!permission) return false;

    for await (const { id } of groups) {
      const allowed = await this._isGroupAllowed(permission.id, id);
      if (allowed) return true;
    }

    return false;
  }

  private getPermission(permissionName: string) {
    return this.permissionsService.getPermissionByName(permissionName);
  }

  private async _isGroupAllowed(permissionId: number, groupId: number) {
    const db = getDatabase();
    const exists = await db
      .select({
        count: sql<number>`COUNT(*)`.mapWith(Number),
      })
      .from(groupPermissionTable)
      .where(
        and(
          eq(groupPermissionTable.group_id, groupId),
          eq(groupPermissionTable.permission_id, permissionId)
        )
      );

    return exists[0].count > 0;
  }
}
