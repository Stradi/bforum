import { type MiddlewareHandler } from "hono";
import { log } from "../utils/logger";

export default function logMiddleware(): MiddlewareHandler {
  return async (ctx, next) => {
    await next();
    const { pathname, search } = new URL(ctx.req.url);
    log.info(
      `${ctx.req.header("X-Client-IP")} - ${
        ctx.req.method
      } ${pathname}${search} - ${ctx.res.status}`
    );
  };
}
