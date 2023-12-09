import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";
import createMiddlewareClient from "../lib/api/client/create-middleware-client";

export type MiddlewareFunction = (
  request: NextRequest,
  response: NextResponse,
  event: NextFetchEvent
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type -- false positive
) => Promise<NextResponse | void>;

export type ChainableMiddleware<T = void> = (options: T) => MiddlewareFunction;

export async function chain(
  request: NextRequest,
  event: NextFetchEvent,
  middlewares: MiddlewareFunction[]
) {
  const response = NextResponse.next();

  for await (const middleware of middlewares) {
    const middlewareResponse = await middleware(request, response, event);
    if (middlewareResponse) return middlewareResponse;
  }

  return response;
}

export const clientMiddleware: ChainableMiddleware = () => {
  return async (request, response) => {
    await createMiddlewareClient(request, response);
  };
};
