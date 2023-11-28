import { Hono } from "hono";
import errorMiddleware from "./middlewares/error-middleware";
import notFoundMiddleware from "./middlewares/not-found-middleware";

export function getServer() {
  const app = new Hono();

  app.onError(errorMiddleware());
  app.notFound(notFoundMiddleware());

  return app;
}
