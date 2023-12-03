import type { MiddlewareHandler } from "hono";
import { getCookie } from "hono/cookie";
import AuthService from "../modules/auth/auth-service";
import PermissionsService from "../modules/permissions/permissions-service";
import { BaseError } from "../utils/errors";

const permissionService = new PermissionsService();
const authService = new AuthService();

export default function canMiddleware(
  permissionName: string
): MiddlewareHandler {
  return async (ctx, next) => {
    const authCookie = getCookie(ctx, "auth-token");
    const groups: string[] = [];

    if (!authCookie) {
      // TODO: Don't hardcode this.
      groups.push("Anonymous");
    } else {
      const jwtPayload = await authService.extractJwtPayload(authCookie);
      groups.push(...jwtPayload.groups.map((g) => g.name));
    }

    const permission = await permissionService.getPermissionByName(
      permissionName
    );
    if (!permission) {
      throw new BaseError({
        code: "PERMISSION_NOT_FOUND",
        message: `Permission with name '${permissionName}' does not exist.`,
        action: "Try again with a different permission name.",
        statusCode: 404,
      });
    }

    for (const perm of permission.groupPermission) {
      if (groups.includes(perm.group.name)) {
        return next();
      }
    }

    throw new BaseError({
      code: "PERMISSION_DENIED",
      message: `You do not have permission to perform this action.`,
      action: "Try again with a different permission name.",
      statusCode: 403,
    });
  };
}
