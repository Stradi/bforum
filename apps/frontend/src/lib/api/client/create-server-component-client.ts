import { cookies } from "next/headers";
import Client from ".";

export default async function createServerComponentClient() {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- cookies() could be undefined?
  const cookieStr = cookies().toString() ?? "";

  const client = new Client();
  client.loadFromCookies(cookieStr, "__bforum");

  if (!client.isTokenValid()) {
    client.clearToken();
  } else {
    await client.refreshToken();
  }

  return client;
}
