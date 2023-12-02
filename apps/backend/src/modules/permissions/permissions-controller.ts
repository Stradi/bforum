import type { Hono } from "hono";
import { tryParseInt } from "../../utils/text";
import type { Handler } from "../base-controller";
import BaseController from "../base-controller";
import type {
  TCreatePermissionBodySchema,
  TGetAllPermissionsQuerySchema,
  TUpdatePermissionBodySchema,
} from "./dto";
import {
  CreatePermissionBodySchema,
  GetAllPermissionsQuerySchema,
  UpdatePermissionBodySchema,
} from "./dto";
import PermissionsService from "./permissions-service";

export class PermissionsController extends BaseController {
  private permissionsService = new PermissionsService();

  public router(): Hono {
    return this._app
      .get("/permissions", this.getAllPermissions)
      .get("/permissions/:id", this.getSinglePermission)
      .post("/permissions", this.createPermission)
      .patch("/permissions/:id", this.updatePermission)
      .delete("/permissions/:id", this.deletePermission);
  }

  getAllPermissions: Handler<"/permissions"> = async (ctx) => {
    const query = this.validateQuery<TGetAllPermissionsQuerySchema>(
      ctx,
      GetAllPermissionsQuerySchema
    );

    const permissions = await this.permissionsService.getAllPermissions(query);

    return this.ok(ctx, {
      message: `Successfully retrieved ${permissions.length} permissions`,
      payload: permissions,
    });
  };

  getSinglePermission: Handler<"/permissions/:id"> = async (ctx) => {
    const permissionId = tryParseInt(ctx.req.param("id"));
    if (!permissionId) {
      return this.badRequest(ctx, {
        code: "INVALID_PERMISSION_ID",
        message: "Supplied permission id is invalid.",
        action: "Try again with a different permission id.",
      });
    }

    const permission = await this.permissionsService.getSinglePermission(
      permissionId
    );

    if (!permission) {
      return this.notFound(ctx, {
        code: "PERMISSION_NOT_FOUND",
        message: `Permission with id '${permissionId}' does not exist.`,
        action: "Try again with a different permission id.",
      });
    }

    return this.ok(ctx, {
      message: `Permission with ID '${permissionId}' successfully retrieved`,
      payload: permission,
    });
  };

  createPermission: Handler<"/permissions"> = async (ctx) => {
    const body = await this.validateBody<TCreatePermissionBodySchema>(
      ctx,
      CreatePermissionBodySchema
    );

    const permission = await this.permissionsService.createPermission(body);

    return this.created(ctx, {
      message: "Permission successfully created.",
      payload: permission,
    });
  };

  updatePermission: Handler<"/permissions/:id"> = async (ctx) => {
    const permissionId = tryParseInt(ctx.req.param("id"));
    if (!permissionId) {
      return this.badRequest(ctx, {
        code: "INVALID_PERMISSION_ID",
        message: "Supplied permissin id is invalid.",
        action: "Try again with a different permission id.",
      });
    }

    const body = await this.validateBody<TUpdatePermissionBodySchema>(
      ctx,
      UpdatePermissionBodySchema
    );

    const permission = await this.permissionsService.updatePermission(
      permissionId,
      body
    );

    if (!permission) {
      return this.notFound(ctx, {
        code: "PERMISSION_NOT_FOUND",
        message: `Permission with id '${permissionId}' does not exist.`,
        action: "Try again with a different permission id.",
      });
    }

    return this.ok(ctx, {
      message: `Permission with id '${permissionId}' successfully updated.`,
      payload: permission,
    });
  };

  deletePermission: Handler<"/permissions/:id"> = async (ctx) => {
    const permissionId = tryParseInt(ctx.req.param("id"));
    if (!permissionId) {
      return this.badRequest(ctx, {
        code: "INVALID_PERMISSION_ID",
        message: "Supplied permission id is invalid.",
        action: "Try again with a different permission id.",
      });
    }

    const permission = await this.permissionsService.deletePermission(
      permissionId
    );

    if (!permission) {
      return this.notFound(ctx, {
        code: "PERMISSION_NOT_FOUND",
        message: `Permission with id '${permissionId}' does not exist.`,
        action: "Try again with a different permission id.",
      });
    }

    return this.ok(ctx, {
      message: `Permission with id '${permissionId}' successfully deleted.`,
      payload: permission,
    });
  };
}
