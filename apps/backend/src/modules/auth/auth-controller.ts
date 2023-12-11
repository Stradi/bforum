import type { Context, Hono } from "hono";
import { setCookie as _setCookie } from "hono/cookie";
import type { Handler } from "../base-controller";
import BaseController from "../base-controller";
import AuthService from "./auth-service";
import type {
  TLoginBodySchema,
  TRefreshTokenBodySchema,
  TRegisterBodySchema,
} from "./dto";
import {
  LoginBodySchema,
  RefreshTokenBodySchema,
  RegisterBodySchema,
} from "./dto";

export default class AuthController extends BaseController {
  private authService = new AuthService();

  public router(): Hono {
    return this._app
      .post("/auth/login", this.login)
      .post("/auth/register", this.register)
      .post("/auth/refresh-token", this.refreshToken)
      .post("/auth/logout", this.logout);
  }

  login: Handler<"/auth/login"> = async (ctx) => {
    const body = await this.validateBody<TLoginBodySchema>(
      ctx,
      LoginBodySchema
    );

    const account = await this.authService.login(body);
    if (!account) {
      return this.badRequest(ctx, {
        code: "INVALID_CREDENTIALS",
        message: "Provided credentials are invalid",
        action: "Please check your username and password and try again",
      });
    }

    const token = await this.authService.generateJwtToken({
      id: account.id,
      username: account.username,
      display_name: account.display_name,
      email: account.email,
      groups: account.accountGroup.map((g) => ({
        id: g.group.id,
        name: g.group.name,
      })),
    });

    this.setCookie(ctx, token);

    return this.ok(ctx, {
      message: "Successfully logged in",
      payload: {
        token,
      },
    });
  };

  register: Handler<"/auth/register"> = async (ctx) => {
    const body = await this.validateBody<TRegisterBodySchema>(
      ctx,
      RegisterBodySchema
    );

    const registered = await this.authService.register(body);
    if (!registered) {
      return this.badRequest(ctx, {
        code: "CREDENTIALS_ALREADY_EXISTS",
        message: "Username or email already exists",
        action: "Please try again with different credentials",
      });
    }

    const token = await this.authService.generateJwtToken({
      id: registered.account.id,
      username: registered.account.username,
      display_name: registered.account.display_name,
      email: registered.account.email,
      groups: registered.groups,
    });

    this.setCookie(ctx, token);

    return this.ok(ctx, {
      message: "Successfully registered",
      payload: {
        token,
      },
    });
  };

  refreshToken: Handler<"/auth/refresh-token"> = async (ctx) => {
    const body = await this.validateBody<TRefreshTokenBodySchema>(
      ctx,
      RefreshTokenBodySchema
    );

    const account = await this.authService.extractJwtPayload(body.token);
    const newToken = await this.authService.generateJwtToken(account);

    this.setCookie(ctx, newToken);

    return this.ok(ctx, {
      message: "Successfully refreshed token",
      payload: {
        token: newToken,
      },
    });
  };

  logout: Handler<"/auth/logout"> = async (ctx) => {
    this.removeCookie(ctx);

    return this.ok(ctx, {
      message: "Successfully logged out",
      payload: {},
    });
  };

  private setCookie(ctx: Context, token: string) {
    _setCookie(
      ctx,
      "__bforum",
      JSON.stringify({
        token,
      }),
      {
        httpOnly: true,
        maxAge: 60 * 60 * 1, // 1 hour
        path: "/",
      }
    );
  }

  private removeCookie(ctx: Context) {
    _setCookie(ctx, "__bforum", "", {
      httpOnly: true,
      maxAge: 0,
    });
  }
}
