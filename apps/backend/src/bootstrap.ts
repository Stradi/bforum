import { Hono } from "hono";
import beNiceMiddleware from "./middlewares/be-nice-middleware";
import errorMiddleware from "./middlewares/error-middleware";
import logMiddleware from "./middlewares/log-middleware";
import notFoundMiddleware from "./middlewares/not-found-middleware";
import AuthController from "./modules/auth/auth-controller";
import { GroupsController } from "./modules/groups/groups-controller";
import { NodesController } from "./modules/nodes/nodes-controller";
import { PermissionsController } from "./modules/permissions/permissions-controller";
import { RepliesController } from "./modules/replies/replies-controller";
import { ThreadsController } from "./modules/threads/threads-controller";
import { env } from "./utils/text";

export function getServer() {
  const app = new Hono();

  app.use("*", logMiddleware(), beNiceMiddleware());
  app.onError(errorMiddleware());
  app.notFound(notFoundMiddleware());

  app
    .route("/api/v1")
    .route("/", new NodesController().router())
    .route("/", new ThreadsController().router())
    .route("/", new RepliesController().router())
    .route("/", new AuthController().router())
    .route("/", new GroupsController().router())
    .route("/", new PermissionsController().router());

  return app;
}

export function checkEnv() {
  env("PORT", 3000);
  env("JWT_SECRET");
  env("JWT_EXPIRES_IN", 1 * 60 * 60);
}
