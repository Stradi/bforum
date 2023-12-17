import type { ApiAccount } from "@lib/api/api.types";
import type { ApiResponse } from "@lib/api/client";
import { z } from "zod";

export const UpdateAccountFormSchema = z.object({
  username: z.string().min(1).max(255),
  display_name: z.string().min(1).max(255),
  groups: z.array(z.number()).min(1),
});

export type UpdateAccountFormData = z.infer<typeof UpdateAccountFormSchema>;
export type UpdateAccountApiFn = (
  id: number,
  data: UpdateAccountFormData
) => Promise<
  ApiResponse<{
    message: string;
    payload: ApiAccount;
  }>
>;

export type DeleteAccountApiFn = (id: number) => Promise<
  ApiResponse<{
    message: string;
  }>
>;
