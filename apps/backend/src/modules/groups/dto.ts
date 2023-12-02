import * as zod from "zod";

export type TGetSingleGroupQuerySchema = zod.infer<
  typeof GetSingleGroupQuerySchema
>;
export const GetSingleGroupQuerySchema = zod.object({
  with_permissions: zod.coerce.boolean().optional(),
  with_accounts: zod.coerce.boolean().optional(),
});

export type TGetAllGroupsQuerySchema = zod.infer<
  typeof GetAllGroupsQuerySchema
>;
export const GetAllGroupsQuerySchema = zod.object({
  with_permissions: zod.coerce.boolean().optional(),
  with_accounts: zod.coerce.boolean().optional(),
  limit: zod.coerce.number().optional(),
  offset: zod.coerce.number().optional(),
});

export type TCreateGroupBodySchema = zod.infer<typeof CreateGroupBodySchema>;
export const CreateGroupBodySchema = zod.object({
  name: zod.string().min(1).max(255),
});

export type TUpdateGroupBodySchema = zod.infer<typeof UpdateGroupBodySchema>;
export const UpdateGroupBodySchema = zod.object({
  name: zod.string().min(1).max(255).optional(),
});
