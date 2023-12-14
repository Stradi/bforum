import type { Hono } from "hono";
import authMiddleware from "../../middlewares/auth-middleware";
import ensureNodeMiddleware from "../../middlewares/ensure-node-middleware";
import type { Handler } from "../base-controller";
import BaseController from "../base-controller";
import type {
  TCreateThreadBodySchema,
  TGetAllThreadsQuerySchema,
  TGetSingleThreadQuerySchema,
  TUpdateThreadBodySchema,
} from "./dto";
import {
  CreateThreadBodySchema,
  GetAllThreadsQuerySchema,
  GetSingleThreadQuerySchema,
  UpdateThreadBodySchema,
} from "./dto";
import ThreadsPolicy from "./threads-policy";
import ThreadsService from "./threads-service";

export class ThreadsController extends BaseController {
  private threadsService = new ThreadsService();
  private threadsPolicy = new ThreadsPolicy();

  /**
   * Initializes the controller. Ensures that a Node with the given `nodeSlug` exists.
   *
   * #### Available Routes
   * - `GET /nodes/:nodeSlug/threads` - Returns a list of threads for a given node. Supports pagination.
   * - `GET /nodes/:nodeSlug/threads/:slug` - Returns a single thread for a given node.
   * - `POST /nodes/:nodeSlug/threads` - Creates a new thread for a given node.
   * - `PATCH /nodes/:nodeSlug/threads/:slug` - Updates a node for a given node.
   * - `DELETE /nodes/:nodeSlug/threads/:slug` - Deletes a node for a given node.
   */
  public router(): Hono {
    return this._app
      .get(
        "/nodes/:nodeSlug/threads",
        ensureNodeMiddleware("nodeSlug"),
        authMiddleware(),
        this.getAllThreads
      )
      .get(
        "/nodes/:nodeSlug/threads/:slug",
        ensureNodeMiddleware("nodeSlug"),
        authMiddleware(),
        this.getThread
      )
      .post(
        "/nodes/:nodeSlug/threads",
        ensureNodeMiddleware("nodeSlug"),
        authMiddleware(),
        this.createThread
      )
      .patch(
        "/nodes/:nodeSlug/threads/:slug",
        ensureNodeMiddleware("nodeSlug"),
        authMiddleware(),
        this.updateThread
      )
      .delete(
        "/nodes/:nodeSlug/threads/:slug",
        ensureNodeMiddleware("nodeSlug"),
        authMiddleware(),
        this.deleteThread
      );
  }

  /**
   * ### GET /nodes/:nodeSlug/threads
   * Returns a list of threads for a given node. Supports pagination.
   *
   * #### Returns
   * - `200 OK` - If the request is successful, returns a list of threads.
   * - `400 Bad Request` - If the request is malformed (if the query parameters are invalid).
   * - `500 Internal Server Error` - If an internal server error occurs.
   *
   * #### Query Parameters
   * - `with_node` - If `true`, the parent node will be included in the response.
   * - `limit` - The maximum number of threads to return.
   * - `offset` - The number of threads to skip before returning results.
   *
   * @see {@link GetAllThreadsQuerySchema}
   */
  getAllThreads: Handler<"/nodes/:nodeSlug/threads"> = async (ctx) => {
    await this.checkPolicy(
      this.threadsPolicy,
      "canList",
      ctx.get("jwtPayload")
    );

    const query = this.validateQuery<TGetAllThreadsQuerySchema>(
      ctx,
      GetAllThreadsQuerySchema
    );

    const threads = await this.threadsService.getAllThreads(
      ctx.req.param("nodeSlug"),
      query
    );

    return this.ok(ctx, {
      message: `Successfully retrieved ${threads.length} threads`,
      payload: threads,
    });
  };

  /**
   * ### GET /nodes/:nodeSlug/threads/:slug
   * Returns a single thread for a given node.
   *
   * #### Returns
   * - `200 OK` - If the request is successful, returns the thread.
   * - `400 Bad Request` - If the request is malformed (if the query parameters are invalid).
   * - `404 Not Found` - If the thread or node does not exist.
   * - `500 Internal Server Error` - If an internal server error occurs.
   *
   * #### Query Parameters
   * - `with_node` - If `true`, the parent node will be included in the response.
   *
   * @see {@link GetSingleThreadQuerySchema}
   */
  getThread: Handler<"/nodes/:nodeSlug/threads/:slug"> = async (ctx) => {
    const query = this.validateQuery<TGetSingleThreadQuerySchema>(
      ctx,
      GetSingleThreadQuerySchema
    );

    const thread = await this.threadsService.getSingleThread(
      ctx.req.param("nodeSlug"),
      ctx.req.param("slug"),
      query
    );

    if (!thread) {
      return this.notFound(ctx, {
        code: "THREAD_NOT_FOUND",
        message: `Thread with '${ctx.req.param("slug")} does not exist.'`,
        action: "Try again with a different slug.",
      });
    }

    await this.checkPolicy(
      this.threadsPolicy,
      "canRead",
      thread,
      ctx.get("jwtPayload")
    );

    return this.ok(ctx, {
      message: `Thread with slug '${ctx.req.param(
        "slug"
      )}' successfully retrieved.`,
      payload: thread,
    });
  };

  /**
   * ### POST /nodes/:nodeSlug/threads
   * Creates a new thread for a given node.
   *
   * #### Returns
   * - `201 Created` - If the request is successful, returns the created thread.
   * - `400 Bad Request` - If the request is malformed (if the body is invalid).
   * - `500 Internal Server Error` - If an internal server error occurs.
   *
   * #### Body Parameters
   * - `name` - The name of the thread.
   *
   * @see {@link CreateThreadBodySchema}
   */
  createThread: Handler<"/nodes/:nodeSlug/threads"> = async (ctx) => {
    await this.checkPolicy(
      this.threadsPolicy,
      "canCreate",
      ctx.get("jwtPayload")
    );

    const body = await this.validateBody<TCreateThreadBodySchema>(
      ctx,
      CreateThreadBodySchema
    );

    const thread = await this.threadsService.createThread(
      ctx.req.param("nodeSlug"),
      body,
      ctx.get("jwtPayload")
    );

    return this.created(ctx, {
      message: `Thread successfully created.`,
      payload: thread,
    });
  };

  /**
   * ### PATCH /nodes/:nodeSlug/threads/:slug
   * Updates a thread for a given node.
   *
   * #### Returns
   * - `200 OK` - If the request is successful, returns the updated thread.
   * - `400 Bad Request` - If the request is malformed (if the body is invalid).
   * - `404 Not Found` - If the thread or node does not exist.
   * - `500 Internal Server Error` - If an internal server error occurs.
   *
   * #### Body Parameters
   * - `name` - The name of the thread.
   *
   * @see {@link UpdateNodeBodySchema}
   */
  updateThread: Handler<"/nodes/:nodeSlug/threads/:slug"> = async (ctx) => {
    const body = await this.validateBody<TUpdateThreadBodySchema>(
      ctx,
      UpdateThreadBodySchema
    );

    const thread = await this.threadsService.getSingleThread(
      ctx.req.param("nodeSlug"),
      ctx.req.param("slug"),
      {}
    );

    if (!thread) {
      return this.notFound(ctx, {
        code: "THREAD_NOT_FOUND",
        message: `Thread with '${ctx.req.param("slug")} does not exist.'`,
        action: "Try again with a different slug.",
      });
    }

    await this.checkPolicy(
      this.threadsPolicy,
      "canUpdate",
      thread,
      ctx.get("jwtPayload")
    );

    const updatedThread = await this.threadsService.updateThread(
      ctx.req.param("nodeSlug"),
      ctx.req.param("slug"),
      body
    );

    return this.ok(ctx, {
      message: `Thread with slug '${ctx.req.param(
        "slug"
      )}' successfully updated.`,
      payload: updatedThread,
    });
  };

  /**
   * ### DELETE /nodes/:nodeSlug/threads/:slug
   * Deletes a thread for a given node.
   *
   * #### Returns
   * - `200 OK` - If the request is successful, returns the deleted thread.
   * - `404 Not Found` - If the thread or node does not exist.
   * - `500 Internal Server Error` - If an internal server error occurs.
   *
   */
  deleteThread: Handler<"/nodes/:nodeSlug/threads/:slug"> = async (ctx) => {
    const thread = await this.threadsService.getSingleThread(
      ctx.req.param("nodeSlug"),
      ctx.req.param("slug"),
      {}
    );

    if (!thread) {
      return this.notFound(ctx, {
        code: "THREAD_NOT_FOUND",
        message: `Thread with '${ctx.req.param("slug")} does not exist.'`,
        action: "Try again with a different slug.",
      });
    }

    await this.checkPolicy(
      this.threadsPolicy,
      "canDelete",
      thread,
      ctx.get("jwtPayload")
    );

    const deletedThread = await this.threadsService.deleteThread(
      ctx.req.param("nodeSlug"),
      ctx.req.param("slug")
    );

    return this.ok(ctx, {
      message: `Thread with slug '${ctx.req.param(
        "slug"
      )}' successfully deleted.`,
      payload: deletedThread,
    });
  };
}
