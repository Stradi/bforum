import { z } from "zod";
import type { ApiResponse } from "../client";
import type { ApiThread } from "../api.types";

export const CreateThreadFormSchema = z.object({
  name: z.string(),
});

export type CreateThreadFormData = z.infer<typeof CreateThreadFormSchema>;
export type CreateThreadApiFn = (
  pathToRevalidate: string,
  nodeSlug: string,
  data: CreateThreadFormData
) => Promise<
  ApiResponse<{
    message: string;
    payload: ApiThread;
  }>
>;
