import * as zod from "zod";

export type TGetSingleNodeQuerySchema = zod.infer<
  typeof GetSingleNodeQuerySchema
>;
export const GetSingleNodeQuerySchema = zod.object({
  with_parent: zod.coerce.boolean().optional(),
});

export type TGetAllNodesQuerySchema = zod.infer<typeof GetAllNodesQuerySchema>;
export const GetAllNodesQuerySchema = zod.object({
  with_parent: zod.coerce.boolean().optional(),
  limit: zod.coerce.number().optional(),
  offset: zod.coerce.number().optional(),
});

export type TCreateNodeBodySchema = zod.infer<typeof CreateNodeBodySchema>;
export const CreateNodeBodySchema = zod.object({
  name: zod.string().min(1).max(255),
  description: zod.string().min(1).max(255),
  parent_id: zod.number().optional(),
});

export type TUpdateNodeBodySchema = zod.infer<typeof UpdateNodeBodySchema>;
export const UpdateNodeBodySchema = zod.object({
  name: zod.string().min(1).max(255).optional(),
  description: zod.string().min(1).max(255).optional(),
  parent_id: zod.number().optional(),
});
