import { getServer } from "./bootstrap";
import { runMigrations } from "./database";
import { log } from "./utils/logger";

log.info("Starting bForum server");

runMigrations();

log.info(`Starting server on port ${process.env.PORT || 3000}`);

Bun.serve({
  development: process.env.NODE_ENV === "development",
  port: process.env.PORT || 3000,
  fetch(request, server) {
    const app = getServer();

    const ip = server.requestIP(request);
    ip && request.headers.set("X-Client-IP", ip.address);

    return app.fetch(request, server);
  },
});

log.info("Server started");
