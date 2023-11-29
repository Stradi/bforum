import Database from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import * as nodesSchema from "./schemas/node";
import * as repliesSchema from "./schemas/reply";
import * as threadsSchema from "./schemas/thread";

export function getDatabase() {
  const file = new Database("main.db", {
    create: true,
  });

  return drizzle(file, {
    schema: {
      nodes: nodesSchema.nodesTable,
      threads: threadsSchema.threadsTable,
      replies: repliesSchema.repliesTable,
      nodesRelations: nodesSchema.nodesRelations,
      threadsRelations: threadsSchema.threadRelations,
      repliesRelations: repliesSchema.repliesRelations,
    },
  });
}

export function runMigrations() {
  const db = getDatabase();

  migrate(db, {
    migrationsFolder: "drizzle",
  });
}
