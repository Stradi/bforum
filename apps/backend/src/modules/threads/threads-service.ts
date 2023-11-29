import { and, eq } from "drizzle-orm";
import { getDatabase } from "../../database";
import { thread as ThreadTable } from "../../database/schemas/thread";
import { slugify } from "../../utils/text";
import NodesService from "../nodes/nodes-service";
import type {
  TCreateThreadBodySchema,
  TGetAllThreadsQuerySchema,
  TGetSingleThreadQuerySchema,
  TUpdateThreadBodySchema,
} from "./dto";

export default class ThreadsService {
  private nodesService = new NodesService();

  getAllThreads = async (nodeSlug: string, dto: TGetAllThreadsQuerySchema) => {
    const node = await this.nodesService.getSingleNode(nodeSlug, {
      with_parent: false,
    });

    // We are sure that node is not null here because of the `ensureNodeMiddleware`
    // in the controller. But TS doesn't know that, so we have to do this check.
    if (!node) throw new Error("This should never happen. :fingers_crossed:");

    const db = getDatabase();
    const threads = await db.query.thread.findMany({
      with: {
        node: dto.with_node || undefined,
      },
      limit: dto.limit || 25,
      offset: dto.offset || 0,
      where: eq(ThreadTable.node_id, node.id),
    });

    return threads;
  };

  getSingleThread = async (
    nodeSlug: string,
    threadSlug: string,
    dto: TGetSingleThreadQuerySchema
  ) => {
    const node = await this.nodesService.getSingleNode(nodeSlug, {
      with_parent: false,
    });

    if (!node) throw new Error("This should never happen. :fingers_crossed:");

    const db = getDatabase();
    const thread = await db.query.thread.findMany({
      where: eq(ThreadTable.slug, threadSlug),
      with: {
        node: dto.with_node || undefined,
      },
    });

    if (thread.length === 0) {
      return null;
    }

    return thread[0];
  };

  createThread = async (nodeSlug: string, dto: TCreateThreadBodySchema) => {
    const node = await this.nodesService.getSingleNode(nodeSlug, {
      with_parent: false,
    });

    if (!node) throw new Error("This should never happen. :fingers_crossed:");

    const db = getDatabase();
    const thread = await db
      .insert(ThreadTable)
      .values({
        name: dto.name,
        node_id: node.id,
        slug: slugify(dto.name),
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning();

    return thread[0];
  };

  updateThread = async (
    nodeSlug: string,
    threadSlug: string,
    dto: TUpdateThreadBodySchema
  ) => {
    const node = await this.nodesService.getSingleNode(nodeSlug, {
      with_parent: false,
    });

    if (!node) throw new Error("This should never happen. :fingers_crossed:");

    const db = getDatabase();
    const thread = await db
      .update(ThreadTable)
      .set({
        name: dto.name || undefined,
        slug: dto.name ? slugify(dto.name) : undefined,
        updated_at: new Date(),
      })
      .where(
        and(eq(ThreadTable.node_id, node.id), eq(ThreadTable.slug, threadSlug))
      )
      .returning();

    if (thread.length === 0) {
      return null;
    }

    return thread[0];
  };

  deleteThread = async (nodeSlug: string, threadSlug: string) => {
    const node = await this.nodesService.getSingleNode(nodeSlug, {
      with_parent: false,
    });

    if (!node) throw new Error("This should never happen. :fingers_crossed:");

    const db = getDatabase();
    const thread = await db
      .delete(ThreadTable)
      .where(
        and(eq(ThreadTable.node_id, node.id), eq(ThreadTable.slug, threadSlug))
      )
      .returning();

    if (thread.length === 0) {
      return null;
    }

    return thread[0];
  };
}
