import { getServer } from "./bootstrap";

Bun.serve({
  development: process.env.NODE_ENV === "development",
  port: process.env.PORT || 3000,
  fetch: getServer().fetch,
});
