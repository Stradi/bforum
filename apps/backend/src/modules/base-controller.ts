import type { Context, Env, Next } from "hono";
import { Hono } from "hono";
import * as zod from "zod";
import { InternalServerError, ValidationError } from "../utils/errors";
import type { ErrorResponseData, SuccessResponseData } from "../utils/response";
import { resp } from "../utils/response";

type ResponseType = Promise<Response> | Response;

export type Handler<Path extends string = "/"> = (
  ctx: Context<Env, Path>,
  next?: Next
) => ResponseType;

export default class BaseController {
  _app = new Hono();

  public router(): Hono {
    throw new Error(`Router is not implemented for ${this.constructor.name}.`);
  }

  public async validateBody<T>(
    ctx: Context,
    schema: zod.Schema<T>
  ): Promise<T> {
    const body = await ctx.req.json();
    return this._validate(body, schema);
  }

  public validateQuery<T>(ctx: Context, schema: zod.Schema<T>): T {
    const queries = ctx.req.queries();
    const normalizedQuery = Object.keys(queries).reduce<
      Record<string, unknown>
    >((acc, key) => {
      const value = queries[key];
      acc[key] = value.length === 1 ? value[0] : value;
      return acc;
    }, {});

    return this._validate(normalizedQuery, schema);
  }

  public ok(ctx: Context, additionalData?: SuccessResponseData): ResponseType {
    const obj = resp({
      message: additionalData?.message ?? "OK",
      payload: additionalData?.payload ?? null,
    });

    ctx.status(200);
    return ctx.json(obj);
  }

  public created(
    ctx: Context,
    additionalData?: SuccessResponseData
  ): ResponseType {
    const obj = resp({
      message: additionalData?.message ?? "Created",
      payload: additionalData?.payload ?? null,
    });

    ctx.status(201);
    return ctx.json(obj);
  }

  public noContent(ctx: Context): ResponseType {
    ctx.status(204);
    return ctx.text("");
  }

  public badRequest(
    ctx: Context,
    additionalData?: ErrorResponseData
  ): ResponseType {
    const obj = resp({
      code: additionalData?.code ?? "BAD_REQUEST",
      message: additionalData?.message ?? "Bad Request",
      action: additionalData?.action ?? undefined,
      additionalData: additionalData?.additionalData ?? undefined,
    });

    ctx.status(400);
    return ctx.json(obj);
  }

  public notAllowed(
    ctx: Context,
    additionalData?: ErrorResponseData
  ): ResponseType {
    const obj = resp({
      code: additionalData?.code ?? "NOT_ALLOWED",
      message: additionalData?.message ?? "Not Allowed",
      action: additionalData?.action ?? undefined,
      additionalData: additionalData?.additionalData ?? undefined,
    });

    ctx.status(405);
    return ctx.json(obj);
  }

  public notFound(
    ctx: Context,
    additionalData?: ErrorResponseData
  ): ResponseType {
    const obj = resp({
      code: additionalData?.code ?? "NOT_FOUND",
      message: additionalData?.message ?? "Not Found",
      action: additionalData?.action ?? undefined,
      additionalData: additionalData?.additionalData ?? undefined,
    });

    ctx.status(404);
    return ctx.json(obj);
  }

  public internalServerError(
    ctx: Context,
    additionalData?: ErrorResponseData
  ): ResponseType {
    const obj = resp({
      code: additionalData?.code ?? "INTERNAL_SERVER_ERROR",
      message: additionalData?.message ?? "Internal Server Error",
      action: additionalData?.action ?? undefined,
      additionalData: additionalData?.additionalData ?? undefined,
    });

    ctx.status(500);
    return ctx.json(obj);
  }

  private _validate<T>(obj: unknown, schema: zod.Schema<T>): T {
    try {
      return schema.parse(obj);
    } catch (error) {
      if (error instanceof zod.ZodError) {
        throw new ValidationError(error);
      }

      throw new InternalServerError(error as Error);
    }
  }
}
