import type { Hono } from "hono";
import authMiddleware from "../../middlewares/auth-middleware";
import { tryParseInt } from "../../utils/text";
import type { Handler } from "../base-controller";
import BaseController from "../base-controller";
import type {
  TCanPerformBodySchema,
  TCreatePermissionBodySchema,
  TGetAllPermissionsQuerySchema,
  TGetSinglePermissionQuerySchema,
  TUpdatePermissionBodySchema,
} from "./dto";
import {
  CanPerformBodySchema,
  CreatePermissionBodySchema,
  GetAllPermissionsQuerySchema,
  UpdatePermissionBodySchema,
} from "./dto";
import PermissionsPolicy from "./permissions-policy";
import PermissionsService from "./permissions-service";

export class PermissionsController extends BaseController {
  private permissionsService = new PermissionsService();
  private permissionsPolicy = new PermissionsPolicy();

  public router(): Hono {
    return this._app
      .get("/permissions", authMiddleware(), this.getAllPermissions)
      .get("/permissions/:id", authMiddleware(), this.getSinglePermission)
      .post("/permissions", authMiddleware(), this.createPermission)
      .patch("/permissions/:id", authMiddleware(), this.updatePermission)
      .delete("/permissions/:id", authMiddleware(), this.deletePermission)
      .post("/permissions/canPerform", authMiddleware(), this.canPerform);
  }

  getAllPermissions: Handler<"/permissions"> = async (ctx) => {
    await this.checkPolicy(
      this.permissionsPolicy,
      "canList",
      ctx.get("jwtPayload")
    );

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

    const query = this.validateQuery<TGetSinglePermissionQuerySchema>(
      ctx,
      GetAllPermissionsQuerySchema
    );

    const permission = await this.permissionsService.getSinglePermission(
      permissionId,
      query
    );

    if (!permission) {
      return this.notFound(ctx, {
        code: "PERMISSION_NOT_FOUND",
        message: `Permission with id '${permissionId}' does not exist.`,
        action: "Try again with a different permission id.",
      });
    }

    await this.checkPolicy(
      this.permissionsPolicy,
      "canRead",
      permission,
      ctx.get("jwtPayload")
    );

    return this.ok(ctx, {
      message: `Permission with ID '${permissionId}' successfully retrieved`,
      payload: permission,
    });
  };

  createPermission: Handler<"/permissions"> = async (ctx) => {
    await this.checkPolicy(
      this.permissionsPolicy,
      "canCreate",
      ctx.get("jwtPayload")
    );

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

    const permission = await this.permissionsService.getSinglePermission(
      permissionId,
      {}
    );

    if (!permission) {
      return this.notFound(ctx, {
        code: "PERMISSION_NOT_FOUND",
        message: `Permission with id '${permissionId}' does not exist.`,
        action: "Try again with a different permission id.",
      });
    }

    await this.checkPolicy(
      this.permissionsPolicy,
      "canUpdate",
      permission,
      ctx.get("jwtPayload")
    );

    const updatedPermission = await this.permissionsService.updatePermission(
      permissionId,
      body
    );

    return this.ok(ctx, {
      message: `Permission with id '${permissionId}' successfully updated.`,
      payload: updatedPermission,
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

    const permission = await this.permissionsService.getSinglePermission(
      permissionId,
      {}
    );

    if (!permission) {
      return this.notFound(ctx, {
        code: "PERMISSION_NOT_FOUND",
        message: `Permission with id '${permissionId}' does not exist.`,
        action: "Try again with a different permission id.",
      });
    }

    await this.checkPolicy(
      this.permissionsPolicy,
      "canDelete",
      permission,
      ctx.get("jwtPayload")
    );

    const deletedPermission = await this.permissionsService.deletePermission(
      permissionId
    );

    return this.ok(ctx, {
      message: `Permission with id '${permissionId}' successfully deleted.`,
      payload: deletedPermission,
    });
  };

  canPerform: Handler<"/permissions/canPerform"> = async (ctx) => {
    const body = await this.validateBody<TCanPerformBodySchema>(
      ctx,
      CanPerformBodySchema
    );

    let canPerform = false;
    try {
      await this.checkPolicy(
        this.permissionsPolicy,
        "can",
        body.permission_name,
        ctx.get("jwtPayload")
      );
      canPerform = true;
    } catch (error) {
      canPerform = false;
    }

    return this.ok(ctx, {
      message: `Permission check successful.`,
      payload: canPerform,
    });
  };
}
