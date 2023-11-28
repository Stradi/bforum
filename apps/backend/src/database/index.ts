import Database from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";

export function getDatabase() {
  const file = new Database("main.db", {
    create: true,
  });

  return drizzle(file);
}

export function runMigrations() {
  const db = getDatabase();

  migrate(db, {
    migrationsFolder: "drizzle",
  });
}
