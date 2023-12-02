import type { MiddlewareHandler } from "hono";
import { getCookie } from "hono/cookie";
import {
  JwtTokenExpired,
  JwtTokenInvalid,
  JwtTokenIssuedAt,
  JwtTokenSignatureMismatched,
} from "hono/utils/jwt/types";
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

    const jwtPayload = await authService
      .verifyJwtToken(authCookie)
      .catch((e) => {
        if (
          e instanceof JwtTokenInvalid ||
          e instanceof JwtTokenIssuedAt ||
          e instanceof JwtTokenSignatureMismatched
        ) {
          throw new BaseError({
            statusCode: 401,
            code: "INVALID_AUTH_TOKEN",
            message: "Auth token is invalid",
            action: "Provide a valid auth token in the 'auth-token' cookie",
          });
        } else if (e instanceof JwtTokenExpired) {
          throw new BaseError({
            statusCode: 401,
            code: "EXPIRED_AUTH_TOKEN",
            message: "Auth token has expired",
            action: "Provide a valid auth token in the 'auth-token' cookie",
          });
        }

        throw e;
      });

    ctx.set("jwtPayload", jwtPayload);

    await next();
  };
}
