import Client from ".";

export default async function createClientComponentClient() {
  const cookieStr = document.cookie;

  const client = new Client();
  client.loadFromCookies(cookieStr, "__bforum");

  if (!client.isTokenValid()) {
    client.clearToken();
  } else {
    await client.refreshToken();
  }

  return client;
}
