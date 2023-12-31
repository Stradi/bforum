import { Hono } from "hono";
import { cors } from "hono/cors";
import beNiceMiddleware from "./middlewares/be-nice-middleware";
import errorMiddleware from "./middlewares/error-middleware";
import logMiddleware from "./middlewares/log-middleware";
import notFoundMiddleware from "./middlewares/not-found-middleware";
import { AccountsController } from "./modules/accounts/accounts-controller";
import AuthController from "./modules/auth/auth-controller";
import { GroupsController } from "./modules/groups/groups-controller";
import { NodesController } from "./modules/nodes/nodes-controller";
import { PermissionsController } from "./modules/permissions/permissions-controller";
import { RepliesController } from "./modules/replies/replies-controller";
import { ThreadsController } from "./modules/threads/threads-controller";
import { env } from "./utils/text";

export function getServer() {
  const app = new Hono();

  app.use(
    "*",
    logMiddleware(),
    beNiceMiddleware(),
    cors({
      credentials: true,
      origin: [env("FRONTEND_URL", "http://localhost:3000")],
    })
  );
  app.onError(errorMiddleware());
  app.notFound(notFoundMiddleware());

  app
    .route("/api/v1")
    .route("/", new NodesController().router())
    .route("/", new ThreadsController().router())
    .route("/", new RepliesController().router())
    .route("/", new AuthController().router())
    .route("/", new GroupsController().router())
    .route("/", new PermissionsController().router())
    .route("/", new AccountsController().router());

  return app;
}

export function checkEnv() {
  env("PORT", 3000);
  env("JWT_SECRET");
  env("JWT_EXPIRES_IN", 1 * 60 * 60);
}
