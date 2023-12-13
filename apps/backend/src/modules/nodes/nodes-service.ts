import { desc, eq } from "drizzle-orm";
import { LexoRank } from "lexorank";
import { getDatabase } from "../../database";
import { nodesTable } from "../../database/schemas/node";
import type { JwtPayload } from "../../types/jwt";
import { slugify } from "../../utils/text";
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
    const nodes = await db.query.nodes.findMany({
      with: {
        parent: dto.with_parent || undefined,
      },
      limit: dto.limit || 25,
      offset: dto.offset || 0,
    });

    return nodes;
  };

  getSingleNode = async (slug: string, dto: TGetSingleNodeQuerySchema) => {
    const db = getDatabase();
    const node = await db.query.nodes.findMany({
      where: eq(nodesTable.slug, slug),
      with: {
        parent: dto.with_parent || undefined,
      },
    });

    if (node.length === 0) {
      return null;
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

    const node = await db
      .update(nodesTable)
      .set({
        name: dto.name || undefined,
        description: dto.description || undefined,
        parent_id: dto.parent_id || undefined,
        slug: dto.name ? slugify(dto.name) : undefined,
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
