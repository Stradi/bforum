import * as zod from "zod";

export type TGetAllAccountsQuerySchema = zod.infer<
  typeof GetAllAccountsQuerySchema
>;
export const GetAllAccountsQuerySchema = zod.object({
  with_groups: zod.coerce.boolean().optional(),
  limit: zod.coerce.number().optional(),
  offset: zod.coerce.number().optional(),
});

export type TGetSingleAccountQuerySchema = zod.infer<
  typeof GetSingleAccountQuerySchema
>;
export const GetSingleAccountQuerySchema = zod.object({
  with_groups: zod.coerce.boolean().optional(),
});

export type TUpdateAccountBodySchema = zod.infer<
  typeof UpdateAccountBodySchema
>;
export const UpdateAccountBodySchema = zod.object({
  username: zod.string().optional(),
  display_name: zod.string().optional(),
  groups: zod.array(zod.number()).optional(),
});
