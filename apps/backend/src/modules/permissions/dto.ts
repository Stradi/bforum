import * as zod from "zod";

export type TGetAllPermissionsQuerySchema = zod.infer<
  typeof GetAllPermissionsQuerySchema
>;
export const GetAllPermissionsQuerySchema = zod.object({
  limit: zod.coerce.number().optional(),
  offset: zod.coerce.number().optional(),
});

export type TCreatePermissionBodySchema = zod.infer<
  typeof CreatePermissionBodySchema
>;
export const CreatePermissionBodySchema = zod.object({
  name: zod.string().min(1).max(255),
});

export type TUpdatePermissionBodySchema = zod.infer<
  typeof UpdatePermissionBodySchema
>;
export const UpdatePermissionBodySchema = zod.object({
  name: zod.string().min(1).max(255).optional(),
});
