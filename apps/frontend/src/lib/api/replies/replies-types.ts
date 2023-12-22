import { z } from "zod";
import type { ApiResponse } from "../client";
import type { ApiReply } from "../api.types";

export const CreateReplyFormSchema = z.object({
  body: z.string(),
  reply_to_id: z.string().optional(),
});

export type CreateReplyFormData = z.infer<typeof CreateReplyFormSchema>;
export type CreateReplyApiFn = (
  pathToRevalidate: string,
  nodeSlug: string,
  threadSlug: string,
  data: CreateReplyFormData
) => Promise<
  ApiResponse<{
    message: string;
    payload: ApiReply;
  }>
>;
