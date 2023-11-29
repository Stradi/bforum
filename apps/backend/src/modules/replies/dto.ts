import * as zod from "zod";

export type TGetSingleReplyQuerySchema = zod.infer<
  typeof GetSingleReplyQuerySchema
>;
export const GetSingleReplyQuerySchema = zod.object({
  with_thread: zod.coerce.boolean().optional(),
  with_replies: zod.coerce.boolean().optional(),
  with_replied_to: zod.coerce.boolean().optional(),
});

export type TGetAllRepliesQuerySchema = zod.infer<
  typeof GetAllRepliesQuerySchema
>;
export const GetAllRepliesQuerySchema = zod.object({
  with_thread: zod.coerce.boolean().optional(),
  with_replies: zod.coerce.boolean().optional(),
  with_replied_to: zod.coerce.boolean().optional(),

  limit: zod.coerce.number().optional(),
  offset: zod.coerce.number().optional(),
});

export type TCreateReplyBodySchema = zod.infer<typeof CreateReplyBodySchema>;
export const CreateReplyBodySchema = zod.object({
  body: zod.string().min(1),
  reply_to_id: zod.number().optional(),
});

export type TUpdateReplyBodySchema = zod.infer<typeof UpdateReplyBodySchema>;
export const UpdateReplyBodySchema = zod.object({
  body: zod.string().min(1).optional(),
});
