import { Hono } from "hono";
import beNiceMiddleware from "./middlewares/be-nice-middleware";
import errorMiddleware from "./middlewares/error-middleware";
import notFoundMiddleware from "./middlewares/not-found-middleware";
import { NodesController } from "./modules/nodes/nodes-controller";

export function getServer() {
  const app = new Hono();

  app.onError(errorMiddleware());
  app.notFound(notFoundMiddleware());
  app.use("*", beNiceMiddleware());

  app.route("/api/v1").route("/", new NodesController().router());

  return app;
}
