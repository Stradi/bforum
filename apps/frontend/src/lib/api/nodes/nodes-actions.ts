"use server";

import { revalidatePath } from "next/cache";
import type { ApiNode } from "../api.types";
import createServerActionClient from "../client/create-server-action-client";
import type {
  CreateNodeFormData,
  UpdateNodeFormData,
  UpdateNodeOrderFormData,
} from "./nodes-types";

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
