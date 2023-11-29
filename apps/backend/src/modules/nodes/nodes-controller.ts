import type { Hono } from "hono";
import BaseController, { type Handler } from "../base-controller";
import type {
  TCreateNodeBodySchema,
  TGetAllNodesQuerySchema,
  TGetSingleNodeQuerySchema,
  TUpdateNodeBodySchema,
} from "./dto";
import {
  CreateNodeBodySchema,
  GetAllNodesQuerySchema,
  GetSingleNodeQuerySchema,
  UpdateNodeBodySchema,
} from "./dto";
import NodesService from "./nodes-service";

export class NodesController extends BaseController {
  private nodesService = new NodesService();

  /**
   * Initializes the controller.
   *
   * #### Available Routes
   * - `GET /nodes` - Returns a list of nodes. Supports pagination.
   * - `GET /nodes/:slug` - Returns a single node.
   * - `POST /nodes` - Creates a new node.
   * - `PATCH /nodes/:slug` - Updates a node.
   * - `DELETE /nodes/:slug` - Deletes a node.
   */
  public router(): Hono {
    return this._app
      .get("/nodes", this.getAllNodes)
      .get("/nodes/:slug", this.getSingleNode)
      .post("/nodes", this.createNode)
      .patch("/nodes/:slug", this.updateNode)
      .delete("/nodes/:slug", this.deleteNode);
  }

  /**
   * ### GET /nodes
   * Returns a list of nodes. Supports pagination.
   *
   * #### Returns
   * - `200 OK` - If the request is successful, returns a list of nodes.
   * - `400 Bad Request` - If the request is malformed (if the query parameters are invalid).
   * - `500 Internal Server Error` - If an internal server error occurs.
   *
   * #### Query Parameters
   * - `with_parent` - If `true`, the parent node will be included in the response.
   * - `limit` - The maximum number of nodes to return.
   * - `offset` - The number of nodes to skip before returning results.
   *
   * @see {@link GetAllNodesQuerySchema}
   */
  getAllNodes: Handler<"/nodes"> = async (ctx) => {
    const query = this.validateQuery<TGetAllNodesQuerySchema>(
      ctx,
      GetAllNodesQuerySchema
    );

    const nodes = await this.nodesService.getAllNodes(query);

    return this.ok(ctx, {
      message: `Successfully retrieved ${nodes.length} nodes`,
      payload: nodes,
    });
  };

  /**
   * ### GET /nodes/:slug
   * Returns a single node.
   *
   * #### Returns
   * - `200 OK` - If the request is successful, returns the node.
   * - `400 Bad Request` - If the request is malformed (if the query parameters are invalid).
   * - `404 Not Found` - If the node does not exist.
   * - `500 Internal Server Error` - If an internal server error occurs.
   *
   * #### Query Parameters
   * - `with_parent` - If `true`, the parent node will be included in the response.
   *
   * @see {@link GetSingleNodeQuerySchema}
   */
  getSingleNode: Handler<"/nodes/:slug"> = async (ctx) => {
    const query = this.validateQuery<TGetSingleNodeQuerySchema>(
      ctx,
      GetSingleNodeQuerySchema
    );

    const node = await this.nodesService.getSingleNode(
      ctx.req.param("slug"),
      query
    );

    if (!node) {
      return this.notFound(ctx, {
        code: "NODE_NOT_FOUND",
        message: `Node with slug '${ctx.req.param("slug")}' does not exist.`,
        action: "Try again with a different slug.",
      });
    }

    return this.ok(ctx, {
      message: `Node with slug '${ctx.req.param(
        "slug"
      )}' successfully retrieved.`,
      payload: node,
    });
  };

  /**
   * ### POST /nodes
   * Creates a new node.
   *
   * #### Returns
   * - `201 Created` - If the request is successful, returns the created node.
   * - `400 Bad Request` - If the request is malformed (if the body is invalid).
   * - `500 Internal Server Error` - If an internal server error occurs.
   *
   * #### Body Parameters
   * - `name` - The name of the node.
   * - `description` - The description of the node.
   * - `parent_id` - The ID of the parent node.
   *
   * @see {@link CreateNodeBodySchema}
   */
  createNode: Handler<"/nodes"> = async (ctx) => {
    const body = await this.validateBody<TCreateNodeBodySchema>(
      ctx,
      CreateNodeBodySchema
    );

    const node = await this.nodesService.createNode(body);

    return this.created(ctx, {
      message: "Node successfully created.",
      payload: node,
    });
  };

  /**
   * ### PATCH /nodes/:slug
   * Updates a node.
   *
   * #### Returns
   * - `200 OK` - If the request is successful, returns the updated node.
   * - `400 Bad Request` - If the request is malformed (if the body is invalid).
   * - `404 Not Found` - If the node does not exist.
   * - `500 Internal Server Error` - If an internal server error occurs.
   *
   * #### Body Parameters
   * - `name` - The name of the node.
   * - `description` - The description of the node.
   * - `parent_id` - The ID of the parent node.
   *
   * @see {@link UpdateNodeBodySchema}
   */
  updateNode: Handler<"/nodes/:slug"> = async (ctx) => {
    const body = await this.validateBody<TUpdateNodeBodySchema>(
      ctx,
      UpdateNodeBodySchema
    );

    const node = await this.nodesService.updateNode(
      ctx.req.param("slug"),
      body
    );

    if (!node) {
      return this.notFound(ctx, {
        code: "NODE_NOT_FOUND",
        message: `Node with slug '${ctx.req.param("slug")}' does not exist.`,
        action: "Try again with a different slug.",
      });
    }

    return this.ok(ctx, {
      message: `Node with slug '${ctx.req.param(
        "slug"
      )}' successfully updated.`,
      payload: node,
    });
  };

  /**
   * ### DELETE /nodes/:slug
   * Deletes a node.
   *
   * #### Returns
   * - `200 OK` - If the request is successful, returns the deleted node.
   * - `404 Not Found` - If the node does not exist.
   * - `500 Internal Server Error` - If an internal server error occurs.
   *
   */
  deleteNode: Handler<"nodes/:slug"> = async (ctx) => {
    const node = await this.nodesService.deleteNode(ctx.req.param("slug"));

    if (!node) {
      return this.notFound(ctx, {
        code: "NODE_NOT_FOUND",
        message: `Node with slug '${ctx.req.param("slug")}' does not exist.`,
        action: "Try again with a different slug.",
      });
    }

    return this.ok(ctx, {
      message: `Node with slug '${ctx.req.param(
        "slug"
      )}' successfully deleted.`,
      payload: node,
    });
  };
}
