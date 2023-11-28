import { Hono } from "hono";
import beNiceMiddleware from "./middlewares/be-nice-middleware";
import errorMiddleware from "./middlewares/error-middleware";
import notFoundMiddleware from "./middlewares/not-found-middleware";

export function getServer() {
  const app = new Hono();

  app.onError(errorMiddleware());
  app.notFound(notFoundMiddleware());
  app.use("*", beNiceMiddleware());

  return app;
}
