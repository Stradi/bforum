import type { Hono } from "hono";
import { tryParseInt } from "../../utils/text";
import type { Handler } from "../base-controller";
import BaseController from "../base-controller";
import type {
  TCreateGroupBodySchema,
  TGetAllGroupsQuerySchema,
  TUpdateGroupBodySchema,
} from "./dto";
import {
  CreateGroupBodySchema,
  GetAllGroupsQuerySchema,
  UpdateGroupBodySchema,
} from "./dto";
import GroupsService from "./groups-service";

export class GroupsController extends BaseController {
  private groupsService = new GroupsService();

  public router(): Hono {
    return this._app
      .get("/groups", this.getAllGroups)
      .get("/groups/:id", this.getSingleGroup)
      .post("/groups", this.createGroup)
      .patch("/groups/:id", this.updateGroup)
      .delete("/groups/:id", this.deleteGroup);
  }

  getAllGroups: Handler<"/groups"> = async (ctx) => {
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

    const group = await this.groupsService.getSingleGroup(groupId);

    if (!group) {
      return this.notFound(ctx, {
        code: "GROUP_NOT_FOUND",
        message: `Group with id '${groupId}' does not exist.`,
        action: "Try again with a different group id.",
      });
    }

    return this.ok(ctx, {
      message: `Group with ID '${groupId}' successfully retrieved`,
      payload: group,
    });
  };

  createGroup: Handler<"/groups"> = async (ctx) => {
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

    return this.ok(ctx, {
      message: `Group with id '${groupId}' successfully deleted.`,
      payload: group,
    });
  };
}
