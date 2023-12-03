import { checkEnv, getServer } from "./bootstrap";
import { runMigrations, seedDatabase } from "./database";
import { log } from "./utils/logger";
import { env } from "./utils/text";

log.info("Starting bForum server");

checkEnv();

runMigrations();
log.info("Migrations done");

await seedDatabase();
log.info("Database seeded with system data");

log.info(`Starting server on port ${env("PORT", 3000)}`);

Bun.serve({
  development: process.env.NODE_ENV === "development",
  port: env("PORT", 3000),
  fetch(request, server) {
    const app = getServer();

    const ip = server.requestIP(request);
    ip && request.headers.set("X-Client-IP", ip.address);

    return app.fetch(request, server);
  },
});

log.info("Server started");
