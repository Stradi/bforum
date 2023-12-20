import * as zod from "zod";

export type TGetSinglePermissionQuerySchema = zod.infer<
  typeof GetSinglePermissionQuerySchema
>;
export const GetSinglePermissionQuerySchema = zod.object({
  with_groups: zod.coerce.boolean().optional(),
});

export type TGetAllPermissionsQuerySchema = zod.infer<
  typeof GetAllPermissionsQuerySchema
>;
export const GetAllPermissionsQuerySchema = zod.object({
  with_groups: zod.coerce.boolean().optional(),
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

export type TCanPerformBodySchema = zod.infer<typeof CanPerformBodySchema>;
export const CanPerformBodySchema = zod.object({
  permission_name: zod.string().min(1).max(255),
});
