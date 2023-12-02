import * as zod from "zod";

export type TGetAllGroupsQuerySchema = zod.infer<
  typeof GetAllGroupsQuerySchema
>;
export const GetAllGroupsQuerySchema = zod.object({
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
