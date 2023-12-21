import { desc, eq, sql } from "drizzle-orm";
import { LexoRank } from "lexorank";
import { getDatabase } from "../../database";
import { nodesTable } from "../../database/schemas/node";
import type { JwtPayload } from "../../types/jwt";
import { slugify } from "../../utils/text";
import { threadsTable } from "../../database/schemas/thread";
import type {
  TCreateNodeBodySchema,
  TGetAllNodesQuerySchema,
  TGetSingleNodeQuerySchema,
  TUpdateNodeBodySchema,
  TUpdateNodeOrderBodySchema,
} from "./dto";

export default class NodesService {
  getAllNodes = async (dto: TGetAllNodesQuerySchema) => {
    const db = getDatabase();
    let nodes = await db.query.nodes.findMany({
      with: {
        parent: dto.with_parent || undefined,
        children: dto.with_children || undefined,
      },
      limit: dto.limit || 25,
      offset: dto.offset || 0,
    });

    if (dto.with_thread_count) {
      nodes = await Promise.all(
        nodes.map(async (node) => {
          const threadCount = await db
            .select({
              count: sql<number>`COUNT(*)`.mapWith(Number),
            })
            .from(threadsTable)
            .where(eq(threadsTable.node_id, node.id));

          return {
            ...node,
            thread_count: threadCount[0].count,
          };
        })
      );
    }

    return nodes;
  };

  getSingleNode = async (slug: string, dto: TGetSingleNodeQuerySchema) => {
    const db = getDatabase();
    const node = await db.query.nodes.findMany({
      where: eq(nodesTable.slug, slug),
      with: {
        parent: dto.with_parent || undefined,
        children: dto.with_children || undefined,
      },
    });

    if (node.length === 0) {
      return null;
    }

    if (dto.with_thread_count) {
      const threadCount = await db
        .select({
          count: sql<number>`COUNT(*)`.mapWith(Number),
        })
        .from(threadsTable)
        .where(eq(threadsTable.node_id, node[0].id));

      return {
        ...node[0],
        thread_count: threadCount[0].count,
      };
    }

    return node[0];
  };

  createNode = async (dto: TCreateNodeBodySchema, account: JwtPayload) => {
    const db = getDatabase();

    const latestNode = await db
      .select()
      .from(nodesTable)
      .orderBy(desc(nodesTable.id))
      .limit(1);
    let rank: LexoRank | null;
    if (latestNode.length) {
      rank = LexoRank.parse(latestNode[0].order).genNext();
    } else {
      rank = LexoRank.middle();
    }

    const node = await db
      .insert(nodesTable)
      .values({
        name: dto.name,
        description: dto.description,
        parent_id: dto.parent_id,
        slug: slugify(dto.name),
        order: rank.toString(),
        created_by: account.id,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning();

    return node[0];
  };

  updateNode = async (slug: string, dto: TUpdateNodeBodySchema) => {
    const db = getDatabase();

    let updatedSlug: string | undefined;

    if (dto.slug) updatedSlug = slugify(dto.slug, false);
    else if (dto.name) updatedSlug = slugify(dto.name);

    const node = await db
      .update(nodesTable)
      .set({
        name: dto.name || undefined,
        description: dto.description || undefined,
        slug: updatedSlug,
        updated_at: new Date(),
      })
      .where(eq(nodesTable.slug, slug))
      .returning();

    if (node.length === 0) {
      return null;
    }

    return node[0];
  };

  deleteNode = async (slug: string) => {
    const db = getDatabase();
    const node = await db
      .delete(nodesTable)
      .where(eq(nodesTable.slug, slug))
      .returning();

    if (node.length === 0) {
      return null;
    }

    const childrenNodes = await db.query.nodes.findMany({
      where: eq(nodesTable.parent_id, node[0].id),
    });

    for await (const child of childrenNodes) {
      await db
        .update(nodesTable)
        .set({
          parent_id: null,
        })
        .where(eq(nodesTable.id, child.id));
    }

    return node[0];
  };

  updateNodeOrder = async (dto: TUpdateNodeOrderBodySchema) => {
    const db = getDatabase();

    const nodes: (typeof nodesTable.$inferSelect)[] = [];

    for await (const node of dto) {
      const updatedNode = await db
        .update(nodesTable)
        .set({
          order: node.lexoRank,
          updated_at: new Date(),
          parent_id: node.parentId,
        })
        .where(eq(nodesTable.id, node.id))
        .returning();

      nodes.push(updatedNode[0]);
    }

    return nodes;
  };
}
