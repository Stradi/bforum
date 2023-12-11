import type { MiddlewareHandler } from "hono";
import { getCookie } from "hono/cookie";
import AuthService from "../modules/auth/auth-service";
import { BaseError } from "../utils/errors";

const authService = new AuthService();

export default function authMiddleware(require = false): MiddlewareHandler {
  return async (ctx, next) => {
    const cookie = getCookie(ctx, "__bforum");
    if (!cookie) {
      if (require) {
        throw new BaseError({
          statusCode: 401,
          code: "NO_COOKIE",
          message: "Cookie does not exist",
          action: "Please provide a cookie",
        });
      } else {
        await next();
        return;
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- need any
    let cookiePayload: any;
    try {
      cookiePayload = JSON.parse(cookie);
    } catch (e) {
      if (require) {
        throw new BaseError({
          statusCode: 400,
          code: "MALFORMED_COOKIE",
          message: "Malformed cookie",
          action: "Provide a valid cookie",
        });
      } else {
        await next();
        return;
      }
    }

    const authToken = cookiePayload.token;
    if (!authToken) {
      if (require) {
        throw new BaseError({
          statusCode: 401,
          code: "NO_AUTH_TOKEN",
          message: "Auth token does not exist",
          action: "Provide an auth token in the 'auth-token' cookie",
        });
      } else {
        await next();
        return;
      }
    }

    const jwtPayload = await authService.extractJwtPayload(authToken);
    ctx.set("jwtPayload", jwtPayload);

    await next();
  };
}
