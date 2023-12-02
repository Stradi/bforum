import type { Hono } from "hono";
import { setCookie } from "hono/cookie";
import type { Handler } from "../base-controller";
import BaseController from "../base-controller";
import AuthService from "./auth-service";
import type { TLoginBodySchema, TRegisterBodySchema } from "./dto";
import { LoginBodySchema, RegisterBodySchema } from "./dto";

export default class AuthController extends BaseController {
  private authService = new AuthService();

  public router(): Hono {
    return this._app
      .post("/auth/login", this.login)
      .post("/auth/register", this.register);
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

    const token = await this.authService.generateJwtToken(account);

    setCookie(ctx, "auth-token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1, // 1 hour
    });

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

    const account = await this.authService.register(body);
    if (!account) {
      return this.badRequest(ctx, {
        code: "CREDENTIALS_ALREADY_EXISTS",
        message: "Username or email already exists",
        action: "Please try again with different credentials",
      });
    }

    const token = await this.authService.generateJwtToken(account);

    setCookie(ctx, "auth-token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1, // 1 hour
    });

    return this.ok(ctx, {
      message: "Successfully registered",
      payload: {
        token,
      },
    });
  };
}
