"use server";

import type { ApiGroup } from "@lib/api/api.types";
import createServerActionClient from "@lib/api/client/create-server-action-client";
import { revalidatePath } from "next/cache";
import type { CreateGroupFormData } from "../types";

export async function createGroup(
  pathToRevalidate: string,
  data: CreateGroupFormData
) {
  const client = await createServerActionClient();
  const obj = await client.sendRequest<{
    message: string;
    payload: ApiGroup;
  }>("/api/v1/groups", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  revalidatePath(pathToRevalidate);
  return obj;
}
