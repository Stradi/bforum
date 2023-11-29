import { eq, sql } from "drizzle-orm";
import { type MiddlewareHandler } from "hono";
import { getDatabase } from "../../database";
import { nodesTable } from "../../database/schemas/node";
import { resp } from "../../utils/response";

export default function ensureNodeMiddleware(
  paramKey: string
): MiddlewareHandler {
  return async (ctx, next) => {
    const db = getDatabase();
    const nodeSlug = ctx.req.param(paramKey as never) as string;

    const exists = await db
      .select({
        count: sql<number>`COUNT(*)`.mapWith(Number),
      })
      .from(nodesTable)
      .where(eq(nodesTable.slug, nodeSlug));

    if (exists[0].count === 0) {
      ctx.status(404);
      return ctx.json(
        resp({
          code: "NODE_NOT_FOUND",
          message: `Node with slug '${nodeSlug}' does not exist.`,
          action: "Try again with a different slug.",
        })
      );
    }

    await next();
  };
}
