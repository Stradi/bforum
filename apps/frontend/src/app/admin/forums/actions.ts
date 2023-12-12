"use server";

import { revalidatePath } from "next/cache";
import type { ApiNode } from "../../../lib/api/api.types";
import createServerActionClient from "../../../lib/api/client/create-server-action-client";
import type { CreateNodeFormData } from "./_components/create-node-dialog";
import type { DndNode } from "./types";

export async function createNode(
  pathToRevalidate: string,
  data: CreateNodeFormData
) {
  const client = await createServerActionClient();
  const obj = await client.sendRequest<{
    message: string;
    payload: ApiNode;
  }>("/api/v1/nodes", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  revalidatePath(pathToRevalidate);

  return obj;
}

// TODO: implement
// eslint-disable-next-line @typescript-eslint/require-await -- not implemented
export async function updateNodeOrder(
  _pathToRevalidate: string,
  _data: DndNode[]
) {
  throw new Error("Not implemented");
}