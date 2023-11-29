import { eq } from "drizzle-orm";
import { getDatabase } from "../../database";
import { node as NodeTable } from "../../database/schemas/node";
import { slugify } from "../../utils/text";
import type {
  TCreateNodeBodySchema,
  TGetAllNodesQuerySchema,
  TGetSingleNodeQuerySchema,
  TUpdateNodeBodySchema,
} from "./dto";

export default class NodesService {
  getAllNodes = async (dto: TGetAllNodesQuerySchema) => {
    const db = getDatabase();
    const nodes = await db.query.node.findMany({
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
    const node = await db.query.node.findMany({
      where: eq(NodeTable.slug, slug),
      with: {
        parent: dto.with_parent || undefined,
      },
    });

    if (node.length === 0) {
      return null;
    }

    return node[0];
  };

  createNode = async (dto: TCreateNodeBodySchema) => {
    const db = getDatabase();
    const node = await db
      .insert(NodeTable)
      .values({
        name: dto.name,
        description: dto.description,
        parent_id: dto.parent_id,
        slug: slugify(dto.name),
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning();

    return node[0];
  };

  updateNode = async (slug: string, dto: TUpdateNodeBodySchema) => {
    const db = getDatabase();

    const node = await db
      .update(NodeTable)
      .set({
        name: dto.name || undefined,
        description: dto.description || undefined,
        parent_id: dto.parent_id || undefined,
        slug: dto.name ? slugify(dto.name) : undefined,
        updated_at: new Date(),
      })
      .where(eq(NodeTable.slug, slug))
      .returning();

    if (node.length === 0) {
      return null;
    }

    return node[0];
  };

  deleteNode = async (slug: string) => {
    const db = getDatabase();
    const node = await db
      .delete(NodeTable)
      .where(eq(NodeTable.slug, slug))
      .returning();

    if (node.length === 0) {
      return null;
    }

    return node[0];
  };
}
