import { z } from "zod";
import type { ApiGroup } from "@lib/api/api.types";
import type { ApiResponse } from "@lib/api/client";

export const CreateGroupFormSchema = z.object({
  name: z.string().min(1).max(255),
});

export type CreateGroupFormData = z.infer<typeof CreateGroupFormSchema>;
export type CreateGroupApiFn = (data: CreateGroupFormData) => Promise<
  ApiResponse<{
    message: string;
    payload: ApiGroup;
  }>
>;

export const UpdateGroupPermissionsForm = z.array(
  z.object({
    permissionId: z.number(),
    groupId: z.number(),
    allowed: z.boolean(),
  })
);

export type UpdateGroupPermissionsFormData = z.infer<
  typeof UpdateGroupPermissionsForm
>;
export type UpdateGroupPermissionsApiFn = (
  data: UpdateGroupPermissionsFormData
) => Promise<
  ApiResponse<{
    message: string;
    payload: ApiGroup;
  }>
>;

export type DeleteGroupApiFn = (id: number) => Promise<
  ApiResponse<{
    message: string;
    payload: ApiGroup;
  }>
>;

export const UpdateGroupFormSchema = z.object({
  name: z.string().min(1).max(255),
});

export type UpdateGroupFormData = z.infer<typeof UpdateGroupFormSchema>;
export type UpdateGroupApiFn = (
  id: number,
  data: UpdateGroupFormData
) => Promise<
  ApiResponse<{
    message: string;
    payload: ApiGroup;
  }>
>;
