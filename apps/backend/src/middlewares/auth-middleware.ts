import type { MiddlewareHandler } from "hono";
import { getCookie } from "hono/cookie";
import AuthService from "../modules/auth/auth-service";
import { BaseError } from "../utils/errors";

const authService = new AuthService();

export default function authMiddleware(): MiddlewareHandler {
  return async (ctx, next) => {
    const authCookie = getCookie(ctx, "auth-token");
    if (!authCookie) {
      throw new BaseError({
        statusCode: 401,
        code: "NO_AUTH_TOKEN",
        message: "Auth token does not exist",
        action: "Provide an auth token in the 'auth-token' cookie",
      });
    }

    const jwtPayload = await authService.extractJwtPayload(authCookie);
    ctx.set("jwtPayload", jwtPayload);

    await next();
  };
}
