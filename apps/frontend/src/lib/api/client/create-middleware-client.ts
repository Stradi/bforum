import type { NextRequest, NextResponse } from "next/server";
import Client from ".";

export default async function createMiddlewareClient(
  request: NextRequest,
  response: NextResponse
) {
  const cookieStr = request.headers.get("Cookie") ?? "";

  const client = new Client();
  client.loadFromCookies(cookieStr);

  if (!client.isTokenValid()) {
    client.clearToken();
  } else {
    await client.refreshToken();
  }

  response.headers.append("Set-Cookie", client.exportToCookie());
  return client;
}
