"use server";

import { revalidatePath } from "next/cache";
import type { ApiThread } from "../api.types";
import createServerActionClient from "../client/create-server-action-client";
import type { CreateThreadFormData } from "./threads-types";

export async function createThread(
  pathToRevalidate: string,
  nodeSlug: string,
  data: CreateThreadFormData
) {
  const client = await createServerActionClient();
  const obj = await client.sendRequest<{
    message: string;
    payload: ApiThread;
  }>(`/api/v1/nodes/${nodeSlug}/threads`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  revalidatePath(pathToRevalidate);

  return obj;
}
