import createMiddlewareClient from "@lib/api/client/create-middleware-client";
import type { ChainableMiddleware } from "@utils/middleware";
import { NextResponse } from "next/server";

const protectMiddleware: ChainableMiddleware<{
  whenVisited: string[];
  redirectTo: string;
  redirectIfAuthenticated: boolean;
}> = (options) => {
  return async (request, response) => {
    const shouldRedirect = options.whenVisited.some((path) =>
      request.nextUrl.pathname.startsWith(path)
    );

    // User is not visiting any of the routes we care about.
    if (!shouldRedirect) return;

    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = options.redirectTo;

    // User is already on the redirect page.
    if (redirectUrl.href === request.nextUrl.toString()) return;

    const client = await createMiddlewareClient(request, response);
    const isAuthenticated = client.isAuthenticated();

    if (options.redirectIfAuthenticated) {
      if (isAuthenticated) {
        return NextResponse.redirect(redirectUrl, {
          ...response,
        });
      }
    } else if (!isAuthenticated) {
      return NextResponse.redirect(redirectUrl, {
        ...response,
      });
    }
  };
};

export default protectMiddleware;
