import Database from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import * as node from "./schemas/node";
import * as thread from "./schemas/thread";

export function getDatabase() {
  const file = new Database("main.db", {
    create: true,
  });

  return drizzle(file, {
    schema: {
      ...node,
      ...thread,
    },
  });
}

export function runMigrations() {
  const db = getDatabase();

  migrate(db, {
    migrationsFolder: "drizzle",
  });
}
