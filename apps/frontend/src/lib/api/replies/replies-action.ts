"use server";

import { revalidatePath } from "next/cache";
import type { ApiReply } from "../api.types";
import createServerActionClient from "../client/create-server-action-client";
import type { CreateReplyFormData } from "./replies-types";

export async function createReply(
  pathToRevalidate: string,
  nodeSlug: string,
  threadSlug: string,
  data: CreateReplyFormData
) {
  const client = await createServerActionClient();
  const obj = await client.sendRequest<{
    message: string;
    payload: ApiReply;
  }>(`/api/v1/nodes/${nodeSlug}/threads/${threadSlug}/replies`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  revalidatePath(pathToRevalidate);

  return obj;
}
