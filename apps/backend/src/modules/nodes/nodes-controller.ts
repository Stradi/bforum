import { eq } from "drizzle-orm";
import type { Hono } from "hono";
import { getDatabase } from "../../database";
import { node as NodeTable } from "../../database/schemas/node";
import { slugify } from "../../utils/text";
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

export class NodesController extends BaseController {
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

    const db = getDatabase();
    const nodes = await db.query.node.findMany({
      with: {
        parent: query.with_parent || undefined,
      },
      limit: query.limit || 25,
      offset: query.offset || 0,
    });

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

    const db = getDatabase();
    const node = await db.query.node.findMany({
      where: eq(NodeTable.slug, ctx.req.param("slug")),
      with: {
        parent: query.with_parent || undefined,
      },
    });

    if (node.length === 0) {
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
      payload: node[0],
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

    const db = getDatabase();
    const insertedNode = await db
      .insert(NodeTable)
      .values({
        name: body.name,
        description: body.description,
        parent_id: body.parent_id,
        slug: slugify(body.name),
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning();

    return this.created(ctx, {
      message: "Node successfully created.",
      payload: insertedNode,
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

    const db = getDatabase();
    const updatedNode = await db
      .update(NodeTable)
      .set({
        name: body.name || undefined,
        description: body.description || undefined,
        parent_id: body.parent_id || undefined,
        slug: body.name ? slugify(body.name) : undefined,
        updated_at: new Date(),
      })
      .where(eq(NodeTable.slug, ctx.req.param("slug")))
      .returning();

    if (updatedNode.length === 0) {
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
      payload: updatedNode,
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
    const db = getDatabase();
    const deletedNode = await db
      .delete(NodeTable)
      .where(eq(NodeTable.slug, ctx.req.param("slug")))
      .returning();

    if (deletedNode.length === 0) {
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
      payload: deletedNode,
    });
  };
}
