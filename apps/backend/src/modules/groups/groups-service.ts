import { eq } from "drizzle-orm";
import { getDatabase } from "../../database";
import { groupsTable } from "../../database/schemas/group";
import type {
  TCreateGroupBodySchema,
  TGetAllGroupsQuerySchema,
  TUpdateGroupBodySchema,
} from "./dto";

export default class GroupsService {
  getAllGroups = async (dto: TGetAllGroupsQuerySchema) => {
    const db = getDatabase();
    const groups = await db.query.groups.findMany({
      limit: dto.limit || 25,
      offset: dto.offset || 0,
    });

    return groups;
  };

  getSingleGroup = async (id: number) => {
    const db = getDatabase();
    const group = await db.query.groups.findMany({
      where: eq(groupsTable.id, id),
    });

    if (group.length === 0) {
      return null;
    }

    return group[0];
  };

  createGroup = async (dto: TCreateGroupBodySchema) => {
    const db = getDatabase();
    const group = await db
      .insert(groupsTable)
      .values({
        name: dto.name,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning();

    return group[0];
  };

  updateGroup = async (id: number, dto: TUpdateGroupBodySchema) => {
    const db = getDatabase();
    const group = await db
      .update(groupsTable)
      .set({
        name: dto.name || undefined,
        updated_at: new Date(),
      })
      .where(eq(groupsTable.id, id))
      .returning();

    if (group.length === 0) {
      return null;
    }

    return group[0];
  };

  deleteGroup = async (id: number) => {
    const db = getDatabase();
    const group = await db
      .delete(groupsTable)
      .where(eq(groupsTable.id, id))
      .returning();

    if (group.length === 0) {
      return null;
    }

    return group[0];
  };
}
