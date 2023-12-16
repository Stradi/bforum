"use server";

import type { ApiNode } from "@lib/api/api.types";
import createServerActionClient from "@lib/api/client/create-server-action-client";
import { revalidatePath } from "next/cache";
import type {
  CreateNodeFormData,
  UpdateNodeFormData,
  UpdateNodeOrderFormData,
} from "../types";

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

export async function updateNodeOrder(
  pathToRevalidate: string,
  data: UpdateNodeOrderFormData
) {
  const client = await createServerActionClient();
  const obj = await client.sendRequest<{
    message: string;
    payload: ApiNode[];
  }>("/api/v1/nodes/order", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  revalidatePath(pathToRevalidate);

  return obj;
}

export async function updateNode(
  pathToRevalidate: string,
  slug: string,
  data: UpdateNodeFormData
) {
  const client = await createServerActionClient();
  const obj = await client.sendRequest<{
    message: string;
    payload: ApiNode;
  }>(`/api/v1/nodes/${slug}`, {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  revalidatePath(pathToRevalidate);

  return obj;
}

export async function deleteNode(pathToRevalidate: string, slug: string) {
  const client = await createServerActionClient();
  const obj = await client.sendRequest<{
    message: string;
    payload: ApiNode;
  }>(`/api/v1/nodes/${slug}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  revalidatePath(pathToRevalidate);

  return obj;
}
