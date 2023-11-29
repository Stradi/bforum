import { Hono } from "hono";
import beNiceMiddleware from "./middlewares/be-nice-middleware";
import errorMiddleware from "./middlewares/error-middleware";
import logMiddleware from "./middlewares/log-middleware";
import notFoundMiddleware from "./middlewares/not-found-middleware";
import { NodesController } from "./modules/nodes/nodes-controller";
import { ThreadsController } from "./modules/threads/threads-controller";

export function getServer() {
  const app = new Hono();

  app.use("*", logMiddleware(), beNiceMiddleware());
  app.onError(errorMiddleware());
  app.notFound(notFoundMiddleware());

  app
    .route("/api/v1")
    .route("/", new NodesController().router())
    .route("/", new ThreadsController().router());

  return app;
}
