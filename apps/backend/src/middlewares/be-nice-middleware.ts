import { type MiddlewareHandler } from "hono";

export default function beNiceMiddleware(): MiddlewareHandler {
  return async (ctx, next) => {
    await next();

    ctx.res.headers.set("X-Please-Be-Nice", "Thanks!");
  };
}
