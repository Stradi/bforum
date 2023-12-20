import { NextResponse } from "next/server";
import createMiddlewareClient from "@lib/api/client/create-middleware-client";
import type { ChainableMiddleware } from "@utils/middleware";

const protectMiddleware: ChainableMiddleware<{
  whenVisited: string[];
  redirectTo: string;
  redirectIfAuthenticated: boolean;
  requiredPermissions?: string[];
}> = (options) => {
  return async (request, response) => {
    const {
      whenVisited,
      redirectTo,
      redirectIfAuthenticated,
      requiredPermissions,
    } = options;
    const shouldRedirect = whenVisited.some((path) =>
      request.nextUrl.pathname.startsWith(path)
    );

    if (!shouldRedirect) return;

    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = redirectTo;

    if (redirectUrl.href === request.nextUrl.toString()) return;

    const client = await createMiddlewareClient(request, response);
    const isAuthenticated = client.isAuthenticated();

    if (redirectIfAuthenticated && isAuthenticated) {
      return NextResponse.redirect(redirectUrl, { ...response });
    } else if (!redirectIfAuthenticated && !isAuthenticated) {
      return NextResponse.redirect(redirectUrl, { ...response });
    }

    if (!requiredPermissions?.length) return;

    let hasPermission = false;
    for await (const permission of requiredPermissions) {
      const permissionResponse = await client.sendRequest<{
        message: string;
        payload: boolean;
      }>("/api/v1/permissions/canPerform", {
        method: "POST",
        body: JSON.stringify({
          permission_name: permission,
        }),
      });

      if (!permissionResponse.success) {
        return NextResponse.redirect(redirectUrl, { ...response });
      }

      if (permissionResponse.data.payload) {
        hasPermission = true;
        break;
      }
    }

    if (!hasPermission) {
      return NextResponse.redirect(redirectUrl, { ...response });
    }
  };
};

export default protectMiddleware;
