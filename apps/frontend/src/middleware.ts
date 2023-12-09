import type { NextFetchEvent, NextRequest } from "next/server";
import { chain, clientMiddleware } from "./utils/middleware";

export default async function middleware(
  req: NextRequest,
  event: NextFetchEvent
) {
  return chain(req, event, [clientMiddleware()]);
}

/*
 * Match every route except the ones listed below:
 * 1. /api/        -> API routes
 * 2. /_next/      -> Next.js internals
 * 3. /_static/    -> inside /public folder
 * 4. /_vercel/    -> Vercel internals
 * 5. /favicon.ico -> favicon
 * 6. /sitemap.xml -> sitemap
 * 7. /robots.txt  -> robots.txt
 */
export const config = {
  matcher: [
    "/((?!api/|_next|_static|_vercel|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
