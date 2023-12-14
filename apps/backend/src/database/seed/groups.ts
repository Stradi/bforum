import { eq, sql } from "drizzle-orm";
// eslint-disable-next-line import/no-cycle -- there's nothing we can do
import { getDatabase } from "..";
import { log } from "../../utils/logger";
import * as groupsSchema from "../schemas/group";

export const DefaultGroups = ["Admin", "User", "Anonymous"] as const;
export const DefaultGroupIds = {
  Admin: 1,
  User: 2,
  Anonymous: 3,
} as const;

export async function seedGroups() {
  for await (const groupName of DefaultGroups) {
    const group = await createGroupOrDie(groupName);
    if (group.id !== DefaultGroupIds[groupName]) {
      log.fatal(
        `Group '${groupName}' should have id ${DefaultGroupIds[groupName]} but has id ${group.id}`
      );
      process.exit(1);
    }
  }
}

export async function createGroupOrDie(groupName: string) {
  const db = getDatabase();

  const exists = await db
    .select({
      count: sql<number>`COUNT(*)`.mapWith(Number),
      id: sql<number>`id`.mapWith(Number),
    })
    .from(groupsSchema.groupsTable)
    .where(eq(groupsSchema.groupsTable.name, groupName));

  if (exists[0].count > 0) {
    return exists[0];
  }

  const group = await db
    .insert(groupsSchema.groupsTable)
    .values({
      name: groupName,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .onConflictDoNothing()
    .returning();

  if (group.length === 0) {
    log.fatal(`Failed to create group '${groupName}'`);
    process.exit(1);
  }

  return group[0];
}
