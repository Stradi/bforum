import type { Hono } from "hono";
import authMiddleware from "../../middlewares/auth-middleware";
import ensureNodeMiddleware from "../../middlewares/ensure-node-middleware";
import ensureThreadMiddleware from "../../middlewares/ensure-thread-middleware";
import { tryParseInt } from "../../utils/text";
import type { Handler } from "../base-controller";
import BaseController from "../base-controller";
import type {
  TCreateReplyBodySchema,
  TGetAllRepliesQuerySchema,
  TUpdateReplyBodySchema,
} from "./dto";
import {
  CreateReplyBodySchema,
  GetAllRepliesQuerySchema,
  UpdateReplyBodySchema,
} from "./dto";
import RepliesPolicy from "./replies-policy";
import RepliesService from "./replies-service";

export class RepliesController extends BaseController {
  private repliesService = new RepliesService();
  private repliesPolicy = new RepliesPolicy();

  public router(): Hono {
    return this._app
      .get(
        "/nodes/:nodeSlug/threads/:threadSlug/replies",
        ensureNodeMiddleware("nodeSlug"),
        ensureThreadMiddleware("threadSlug"),
        authMiddleware(),
        this.getAllReplies
      )
      .get(
        "/nodes/:nodeSlug/threads/:threadSlug/replies/:replyId",
        ensureNodeMiddleware("nodeSlug"),
        ensureThreadMiddleware("threadSlug"),
        authMiddleware(),
        this.getSingleReply
      )
      .post(
        "/nodes/:nodeSlug/threads/:threadSlug/replies",
        ensureNodeMiddleware("nodeSlug"),
        ensureThreadMiddleware("threadSlug"),
        authMiddleware(),
        this.createReply
      )
      .patch(
        "/nodes/:nodeSlug/threads/:threadSlug/replies/:replyId",
        ensureNodeMiddleware("nodeSlug"),
        ensureThreadMiddleware("threadSlug"),
        authMiddleware(),
        this.updateReply
      )
      .delete(
        "/nodes/:nodeSlug/threads/:threadSlug/replies/:replyId",
        ensureNodeMiddleware("nodeSlug"),
        ensureThreadMiddleware("threadSlug"),
        authMiddleware(),
        this.deleteReply
      );
  }

  getAllReplies: Handler<"/nodes/:nodeSlug/threads/:threadSlug/replies"> =
    async (ctx) => {
      const allowed = await this.repliesPolicy.canList(ctx.get("jwtPayload"));
      if (!allowed) {
        return this.notAllowed(ctx, {
          code: "FORBIDDEN",
          message: "You are not allowed to list replies.",
          action: "Log in with an account that has the required permissions.",
        });
      }

      const query = this.validateQuery<TGetAllRepliesQuerySchema>(
        ctx,
        GetAllRepliesQuerySchema
      );

      const replies = await this.repliesService.getAllReplies(
        ctx.req.param("nodeSlug"),
        ctx.req.param("threadSlug"),
        query
      );

      return this.ok(ctx, {
        message: `Successfully retrieved ${replies.length} replies`,
        payload: replies,
      });
    };

  getSingleReply: Handler<"/nodes/:nodeSlug/threads/:threadSlug/replies/:replyId"> =
    async (ctx) => {
      const replyId = tryParseInt(ctx.req.param("replyId"));
      if (!replyId) {
        return this.badRequest(ctx, {
          code: "INVALID_REPLY_ID",
          message: "Supplied reply id is invalid.",
          action: "Try again with a different reply id.",
        });
      }

      const query = this.validateQuery<TGetAllRepliesQuerySchema>(
        ctx,
        GetAllRepliesQuerySchema
      );

      const reply = await this.repliesService.getSingleReply(replyId, query);

      if (!reply) {
        return this.notFound(ctx, {
          code: "REPLY_NOT_FOUND",
          message: "Reply not found",
          action: "Try again with a different reply id.",
        });
      }

      const allowed = await this.repliesPolicy.canRead(
        reply,
        ctx.get("jwtPayload")
      );

      if (!allowed) {
        return this.notAllowed(ctx, {
          code: "FORBIDDEN",
          message: "You are not allowed to read this reply.",
          action: "Log in with an account that has the required permissions.",
        });
      }

      return this.ok(ctx, {
        message: `Reply with id '${replyId}' successfully retrieved.`,
        payload: reply,
      });
    };

  createReply: Handler<"/nodes/:nodeSlug/threads/:threadSlug/replies"> = async (
    ctx
  ) => {
    const allowed = await this.repliesPolicy.canCreate(ctx.get("jwtPayload"));

    if (!allowed) {
      return this.notAllowed(ctx, {
        code: "FORBIDDEN",
        message: "You are not allowed to create replies.",
        action: "Log in with an account that has the required permissions.",
      });
    }

    const body = await this.validateBody<TCreateReplyBodySchema>(
      ctx,
      CreateReplyBodySchema
    );

    const reply = await this.repliesService.createReply(
      ctx.req.param("nodeSlug"),
      ctx.req.param("threadSlug"),
      body
    );

    return this.created(ctx, {
      message: `Reply successfully created.`,
      payload: reply,
    });
  };

  updateReply: Handler<"/nodes/:nodeSlug/threads/:threadSlug/replies/:replyId"> =
    async (ctx) => {
      const replyId = tryParseInt(ctx.req.param("replyId"));
      if (!replyId) {
        return this.badRequest(ctx, {
          code: "INVALID_REPLY_ID",
          message: "Supplied reply id is invalid.",
          action: "Try again with a different reply id.",
        });
      }

      const body = await this.validateBody<TUpdateReplyBodySchema>(
        ctx,
        UpdateReplyBodySchema
      );

      const reply = await this.repliesService.updateReply(replyId, body);

      if (!reply) {
        return this.notFound(ctx, {
          code: "REPLY_NOT_FOUND",
          message: `Reply with id '${replyId}' does not exist.`,
          action: "Try again with a different reply id.",
        });
      }

      const allowed = await this.repliesPolicy.canUpdate(
        reply,
        ctx.get("jwtPayload")
      );

      if (!allowed) {
        return this.notAllowed(ctx, {
          code: "FORBIDDEN",
          message: "You are not allowed to update this reply.",
          action: "Log in with an account that has the required permissions.",
        });
      }

      return this.ok(ctx, {
        message: `Reply with id '${replyId}' successfully updated.`,
        payload: reply,
      });
    };

  deleteReply: Handler<"/nodes/:nodeSlug/threads/:threadSlug/replies/:replyId"> =
    async (ctx) => {
      const replyId = tryParseInt(ctx.req.param("replyId"));
      if (!replyId) {
        return this.badRequest(ctx, {
          code: "INVALID_REPLY_ID",
          message: "Supplied reply id is invalid.",
          action: "Try again with a different reply id.",
        });
      }

      const reply = await this.repliesService.deleteReply(replyId);

      if (!reply) {
        return this.notFound(ctx, {
          code: "REPLY_NOT_FOUND",
          message: `Reply with id '${replyId}' does not exist.`,
          action: "Try again with a different reply id.",
        });
      }

      const allowed = await this.repliesPolicy.canDelete(
        reply,
        ctx.get("jwtPayload")
      );

      if (!allowed) {
        return this.notAllowed(ctx, {
          code: "FORBIDDEN",
          message: "You are not allowed to delete this reply.",
          action: "Log in with an account that has the required permissions.",
        });
      }

      return this.ok(ctx, {
        message: `Reply with id '${replyId}' successfully deleted.`,
        payload: reply,
      });
    };
}
