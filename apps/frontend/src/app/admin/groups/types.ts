import type { ApiGroup } from "@lib/api/api.types";
import type { ApiResponse } from "@lib/api/client";
import { z } from "zod";

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
