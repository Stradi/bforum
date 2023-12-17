import type { accountsTable } from "../database/schemas/account";
import type { nodesTable } from "../database/schemas/node";
import type { permissionsTable } from "../database/schemas/permission";
import type { repliesTable } from "../database/schemas/reply";
import type { threadsTable } from "../database/schemas/thread";
import { DefaultGroupIds, type DefaultGroups } from "../database/seed/groups";
import type { JwtPayload } from "../types/jwt";
import { BaseError } from "../utils/errors";
import PermissionsService from "./permissions/permissions-service";

type AvailableResources =
  | typeof nodesTable.$inferSelect
  | typeof threadsTable.$inferSelect
  | typeof repliesTable.$inferSelect
  | typeof permissionsTable.$inferSelect
  | typeof accountsTable.$inferSelect;

type PermissionWithGroups = typeof permissionsTable.$inferSelect & {
  groupPermission: {
    group: {
      id: number;
      name: string;
      created_at: Date | null;
      updated_at: Date | null;
    };
  }[];
};

const DefaultAccountGroups: (typeof DefaultGroups)[number][] = ["Anonymous"];

export default class BasePolicy {
  private permissionsService = new PermissionsService();

  public async can<T extends AvailableResources>(
    permissionName: string,
    accountData?: JwtPayload,
    resourceObj?: T,
    resourceField?: keyof T
  ) {
    const { scope } = this.parsePermissionName(permissionName);

    // If scope is ID and if id of the resource is not the same as the scope,
    // there is no need to check the permission. Just return false.
    if (scope && scope !== "&" && scope !== "*") {
      if (!resourceObj) return false;
      if (isNaN(Number(scope))) return false;
      if (resourceObj.id !== Number(scope)) return false;
    }

    const permission = await this.getPermission(permissionName);
    if (!permission) return false;

    const groups = accountData
      ? accountData.groups
      : DefaultAccountGroups.map((groupName) => ({
          id: DefaultGroupIds[groupName],
          name: groupName,
        }));
    const groupIds = groups.map((g) => g.id);

    // If scope is `&` and the creator of the resource is the same as the account
    // then allow the action.
    if (scope && scope === "&" && resourceObj && resourceField) {
      if (!accountData) return false;
      if (resourceObj[resourceField] !== accountData.id) return false;

      for (const id of groupIds) {
        const allowed = this.isGroupAllowedTo(id, permission);
        if (allowed) return true;
      }

      return false;
    }

    for (const id of groupIds) {
      if (this.isGroupAllowedTo(id, permission)) return true;
    }

    return false;
  }

  private getPermission(
    permissionName: string
  ): Promise<PermissionWithGroups | null> {
    return this.permissionsService.getPermissionByName(permissionName);
  }

  private parsePermissionName(permissionName: string) {
    const arr = permissionName.split(".");
    if (arr.length !== 2 && arr.length !== 3)
      throw new BaseError({
        code: "INVALID_PERMISSION_NAME",
        message: "Could not parse permission name",
        action:
          "Permission name must be in the format of 'Resource.Action' or 'Resource.Scope.Action'",
        statusCode: 500,
        additionalData: {
          permissionName,
        },
      });

    if (arr.length === 2) {
      return {
        resource: arr[0],
        action: arr[1],
      };
    }

    return {
      resource: arr[0],
      scope: arr[1],
      action: arr[2],
    };
  }

  private isGroupAllowedTo(groupId: number, permission: PermissionWithGroups) {
    const groupPermission = permission.groupPermission.find(
      (gp) => gp.group.id === groupId
    );

    if (!groupPermission) return false;
    return true;
  }
}
