import { and, eq, sql } from "drizzle-orm";
import { getDatabase } from "../../database";
import { threadsTable } from "../../database/schemas/thread";
import type { JwtPayload } from "../../types/jwt";
import { slugify } from "../../utils/text";
import NodesService from "../nodes/nodes-service";
import { repliesTable } from "../../database/schemas/reply";
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
    let threads = await db.query.threads.findMany({
      with: {
        node: dto.with_node || undefined,
        creator: dto.with_creator || undefined,
      },
      limit: dto.limit || 25,
      offset: dto.offset || 0,
      where: eq(threadsTable.node_id, node.id),
    });

    if (dto.with_reply_count) {
      threads = await Promise.all(
        threads.map(async (thread) => {
          const replyCount = await db
            .select({
              count: sql<number>`COUNT(*)`.mapWith(Number),
            })
            .from(repliesTable)
            .where(eq(repliesTable.thread_id, thread.id));

          return {
            ...thread,
            reply_count: replyCount[0].count,
          };
        })
      );
    }

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
    const thread = await db.query.threads.findMany({
      where: eq(threadsTable.slug, threadSlug),
      with: {
        node: dto.with_node || undefined,
        creator: dto.with_creator || undefined,
      },
    });

    if (thread.length === 0) {
      return null;
    }

    if (dto.with_reply_count) {
      const replyCount = await db
        .select({
          count: sql<number>`COUNT(*)`.mapWith(Number),
        })
        .from(repliesTable)
        .where(eq(repliesTable.thread_id, thread[0].id));

      return {
        ...thread[0],
        reply_count: replyCount[0].count,
      };
    }

    return thread[0];
  };

  createThread = async (
    nodeSlug: string,
    dto: TCreateThreadBodySchema,
    account: JwtPayload
  ) => {
    const node = await this.nodesService.getSingleNode(nodeSlug, {
      with_parent: false,
    });

    if (!node) throw new Error("This should never happen. :fingers_crossed:");

    const db = getDatabase();
    const thread = await db
      .insert(threadsTable)
      .values({
        name: dto.name,
        node_id: node.id,
        slug: slugify(dto.name),
        created_by: account.id,
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
      .update(threadsTable)
      .set({
        name: dto.name || undefined,
        slug: dto.name ? slugify(dto.name) : undefined,
        updated_at: new Date(),
      })
      .where(
        and(
          eq(threadsTable.node_id, node.id),
          eq(threadsTable.slug, threadSlug)
        )
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
      .delete(threadsTable)
      .where(
        and(
          eq(threadsTable.node_id, node.id),
          eq(threadsTable.slug, threadSlug)
        )
      )
      .returning();

    if (thread.length === 0) {
      return null;
    }

    return thread[0];
  };
}
