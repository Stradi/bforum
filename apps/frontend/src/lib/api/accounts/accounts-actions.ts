"use server";

import { revalidatePath } from "next/cache";
import type { ApiAccount } from "@lib/api/api.types";
import createServerActionClient from "@lib/api/client/create-server-action-client";
import type { UpdateAccountFormData } from "./account-types";

export async function updateAccount(
  pathToRevalidate: string,
  id: number,
  data: UpdateAccountFormData
) {
  const client = await createServerActionClient();
  const obj = await client.sendRequest<{
    message: string;
    payload: ApiAccount;
  }>(`/api/v1/accounts/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  revalidatePath(pathToRevalidate);

  return obj;
}

export async function deleteAccount(pathToRevalidate: string, id: number) {
  const client = await createServerActionClient();
  const obj = await client.sendRequest<{
    message: string;
  }>(`/api/v1/accounts/${id}`, {
    method: "DELETE",
  });

  revalidatePath(pathToRevalidate);

  return obj;
}
