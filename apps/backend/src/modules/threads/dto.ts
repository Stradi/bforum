import * as zod from "zod";

export type TGetSingleThreadQuerySchema = zod.infer<
  typeof GetSingleThreadQuerySchema
>;
export const GetSingleThreadQuerySchema = zod.object({
  with_node: zod.coerce.boolean().optional(),
});

export type TGetAllThreadsQuerySchema = zod.infer<
  typeof GetAllThreadsQuerySchema
>;
export const GetAllThreadsQuerySchema = zod.object({
  with_node: zod.coerce.boolean().optional(),
  limit: zod.coerce.number().optional(),
  offset: zod.coerce.number().optional(),
});

export type TCreateThreadBodySchema = zod.infer<typeof CreateThreadBodySchema>;
export const CreateThreadBodySchema = zod.object({
  name: zod.string().min(1).max(255),
});

export type TUpdateThreadBodySchema = zod.infer<typeof UpdateThreadBodySchema>;
export const UpdateThreadBodySchema = zod.object({
  name: zod.string().min(1).max(255).optional(),
});
