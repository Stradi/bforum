"use server";

import type { ApiGroup } from "@lib/api/api.types";
import createServerActionClient from "@lib/api/client/create-server-action-client";
import { revalidatePath } from "next/cache";
import type {
  CreateGroupFormData,
  UpdateGroupFormData,
  UpdateGroupPermissionsFormData,
} from "../types";

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

export async function updateGroupPermissions(
  pathToRevalidate: string,
  data: UpdateGroupPermissionsFormData
) {
  const client = await createServerActionClient();
  const obj = await client.sendRequest<{
    message: string;
    payload: ApiGroup;
  }>(`/api/v1/groups/permissions`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  revalidatePath(pathToRevalidate);
  return obj;
}

export async function updateGroup(
  pathToRevalidate: string,
  id: string,
  data: UpdateGroupFormData
) {
  const client = await createServerActionClient();
  const obj = await client.sendRequest<{
    message: string;
    payload: ApiGroup;
  }>(`/api/v1/groups/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  revalidatePath(pathToRevalidate);
  return obj;
}

export async function deleteGroup(pathToRevalidate: string, id: string) {
  const client = await createServerActionClient();
  const obj = await client.sendRequest<{
    message: string;
    payload: ApiGroup;
  }>(`/api/v1/groups/${id}`, {
    method: "DELETE",
  });

  revalidatePath(pathToRevalidate);
  return obj;
}
