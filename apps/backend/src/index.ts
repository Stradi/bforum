import { getServer } from "./bootstrap";
import { runMigrations } from "./database";

runMigrations();

Bun.serve({
  development: process.env.NODE_ENV === "development",
  port: process.env.PORT || 3000,
  fetch: getServer().fetch,
});
