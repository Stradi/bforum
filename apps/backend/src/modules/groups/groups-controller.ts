import type { Hono } from "hono";
import authMiddleware from "../../middlewares/auth-middleware";
import { tryParseInt } from "../../utils/text";
import type { Handler } from "../base-controller";
import BaseController from "../base-controller";
import type {
  TCreateGroupBodySchema,
  TGetAllGroupsQuerySchema,
  TGetSingleGroupQuerySchema,
  TUpdateGroupBodySchema,
  TUpdateGroupPermissionsBodySchema,
} from "./dto";
import {
  CreateGroupBodySchema,
  GetAllGroupsQuerySchema,
  GetSingleGroupQuerySchema,
  UpdateGroupBodySchema,
  UpdateGroupPermissionsBodySchema,
} from "./dto";
import GroupsPolicy from "./groups-policy";
import GroupsService from "./groups-service";

export class GroupsController extends BaseController {
  private groupsService = new GroupsService();
  private groupsPolicy = new GroupsPolicy();

  public router(): Hono {
    return this._app
      .get("/groups", authMiddleware(), this.getAllGroups)
      .get("/groups/:id", authMiddleware(), this.getSingleGroup)
      .post("/groups", authMiddleware(), this.createGroup)
      .patch("/groups/:id", authMiddleware(), this.updateGroup)
      .delete("/groups/:id", authMiddleware(), this.deleteGroup)
      .post("/groups/permissions", authMiddleware(), this.updatePermissions);
  }

  getAllGroups: Handler<"/groups"> = async (ctx) => {
    await this.checkPolicy(this.groupsPolicy, "canList", ctx.get("jwtPayload"));

    const query = this.validateQuery<TGetAllGroupsQuerySchema>(
      ctx,
      GetAllGroupsQuerySchema
    );

    const groups = await this.groupsService.getAllGroups(query);

    return this.ok(ctx, {
      message: `Successfully retrieved ${groups.length} groups`,
      payload: groups,
    });
  };

  getSingleGroup: Handler<"/groups/:id"> = async (ctx) => {
    const groupId = tryParseInt(ctx.req.param("id"));
    if (!groupId) {
      return this.badRequest(ctx, {
        code: "INVALID_GROUP_ID",
        message: "Supplied group id is invalid.",
        action: "Try again with a different group id.",
      });
    }

    const query = this.validateQuery<TGetSingleGroupQuerySchema>(
      ctx,
      GetSingleGroupQuerySchema
    );

    const group = await this.groupsService.getSingleGroup(groupId, query);

    if (!group) {
      return this.notFound(ctx, {
        code: "GROUP_NOT_FOUND",
        message: `Group with id '${groupId}' does not exist.`,
        action: "Try again with a different group id.",
      });
    }

    await this.checkPolicy(
      this.groupsPolicy,
      "canRead",
      group,
      ctx.get("jwtPayload")
    );

    return this.ok(ctx, {
      message: `Group with ID '${groupId}' successfully retrieved`,
      payload: group,
    });
  };

  createGroup: Handler<"/groups"> = async (ctx) => {
    await this.checkPolicy(
      this.groupsPolicy,
      "canCreate",
      ctx.get("jwtPayload")
    );

    const body = await this.validateBody<TCreateGroupBodySchema>(
      ctx,
      CreateGroupBodySchema
    );

    const group = await this.groupsService.createGroup(body);

    return this.created(ctx, {
      message: "Group successfully created.",
      payload: group,
    });
  };

  updateGroup: Handler<"/groups/:id"> = async (ctx) => {
    const groupId = tryParseInt(ctx.req.param("id"));
    if (!groupId) {
      return this.badRequest(ctx, {
        code: "INVALID_GROUP_ID",
        message: "Supplied group id is invalid.",
        action: "Try again with a different group id.",
      });
    }

    const body = await this.validateBody<TUpdateGroupBodySchema>(
      ctx,
      UpdateGroupBodySchema
    );

    const group = await this.groupsService.updateGroup(groupId, body);

    if (!group) {
      return this.notFound(ctx, {
        code: "GROUP_NOT_FOUND",
        message: `Group with id '${groupId}' does not exist.`,
        action: "Try again with a different group id.",
      });
    }

    await this.checkPolicy(
      this.groupsPolicy,
      "canUpdate",
      group,
      ctx.get("jwtPayload")
    );

    return this.ok(ctx, {
      message: `Group with id '${groupId}' successfully updated.`,
      payload: group,
    });
  };

  deleteGroup: Handler<"/groups/:id"> = async (ctx) => {
    const groupId = tryParseInt(ctx.req.param("id"));
    if (!groupId) {
      return this.badRequest(ctx, {
        code: "INVALID_GROUP_ID",
        message: "Supplied group id is invalid.",
        action: "Try again with a different group id.",
      });
    }

    const group = await this.groupsService.deleteGroup(groupId);

    if (!group) {
      return this.notFound(ctx, {
        code: "GROUP_NOT_FOUND",
        message: `Group with id '${groupId}' does not exist.`,
        action: "Try again with a different group id.",
      });
    }

    await this.checkPolicy(
      this.groupsPolicy,
      "canDelete",
      group,
      ctx.get("jwtPayload")
    );

    return this.ok(ctx, {
      message: `Group with id '${groupId}' successfully deleted.`,
      payload: group,
    });
  };

  updatePermissions: Handler<"/groups/permissions"> = async (ctx) => {
    await this.checkPolicy(
      this.groupsPolicy,
      "canUpdatePermissions",
      ctx.get("jwtPayload")
    );

    const body = await this.validateBody<TUpdateGroupPermissionsBodySchema>(
      ctx,
      UpdateGroupPermissionsBodySchema
    );

    const updatedGroups = await this.groupsService.updatePermissions(body);
    const affectedMultipleGroups = updatedGroups.length > 1;

    const message = affectedMultipleGroups
      ? `Permissions for ${updatedGroups.length} groups successfully updated.`
      : `Permissions for group with id ${updatedGroups[0].group_id} successfully updated.`;

    return this.ok(ctx, {
      message,
      payload: updatedGroups,
    });
  };
}
