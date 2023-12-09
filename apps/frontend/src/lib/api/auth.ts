import type Client from "./client";

export async function register(
  client: Client | null,
  data: {
    email: string;
    username: string;
    password: string;
  }
) {
  if (!client) throw new Error("Client is not initialized");

  return client.sendRequest<{
    message: string;
    payload: {
      token: string;
    };
  }>("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function login(
  client: Client | null,
  data: {
    username: string;
    password: string;
  }
) {
  if (!client) throw new Error("Client is not initialized");

  return client.sendRequest<{
    message: string;
    payload: {
      token: string;
    };
  }>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
}
