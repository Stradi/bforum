import type { Context } from "hono";
import * as zod from "zod";
import { InternalServerError, ValidationError } from "./errors";

export function validate<T>(obj: unknown, schema: zod.Schema<T>): T {
  try {
    return schema.parse(obj);
  } catch (error) {
    if (error instanceof zod.ZodError) {
      throw new ValidationError(error);
    }

    throw new InternalServerError(error as Error);
  }
}

export async function validateBody<T>(
  ctx: Context,
  schema: zod.Schema<T>
): Promise<T> {
  const body = await ctx.req.json();
  return validate(body, schema);
}

export function validateQuery<T>(ctx: Context, schema: zod.Schema<T>): T {
  const queries = ctx.req.queries();
  const normalizedQuery = Object.keys(queries).reduce<Record<string, unknown>>(
    (acc, key) => {
      const value = queries[key];
      acc[key] = value.length === 1 ? value[0] : value;
      return acc;
    },
    {}
  );

  return validate(normalizedQuery, schema);
}
