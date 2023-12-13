import { z } from "zod";
import type { ApiNode } from "../../../lib/api/api.types";
import type { ApiResponse } from "../../../lib/api/client";

export type DndNode = ApiNode & {
  dndId: number;
  dndParentId: number;
  dndLexoRank: string;
};

export const CreateNodeFormSchema = z.object({
  name: z.string().min(3).max(63),
  description: z.string().min(3).max(255),
  parent_id: z.number().optional(),
});

export type CreateNodeFormData = z.infer<typeof CreateNodeFormSchema>;
export type CreateNodeApiFn = (data: CreateNodeFormData) => Promise<
  ApiResponse<{
    message: string;
    payload: ApiNode;
  }>
>;

export const UpdateNodeFormSchema = z.object({
  name: z.string().min(3).max(63),
  description: z.string().min(3).max(255),
  slug: z.string().min(1).max(63),
});

export type UpdateNodeFormData = z.infer<typeof UpdateNodeFormSchema>;
export type UpdateNodeApiFn = (
  slug: string,
  data: UpdateNodeFormData
) => Promise<
  ApiResponse<{
    message: string;
    payload: ApiNode[];
  }>
>;

export const UpdateNodeOrderFormSchema = z.array(
  z.object({
    id: z.number(),
    lexoRank: z.string(),
    parentId: z.number().or(z.null()),
  })
);

export type UpdateNodeOrderFormData = z.infer<typeof UpdateNodeOrderFormSchema>;
export type UpdateNodeOrderApiFn = (data: UpdateNodeOrderFormData) => Promise<
  ApiResponse<{
    message: string;
    payload: ApiNode[];
  }>
>;

export type DeleteNodeApiFn = (slug: string) => Promise<
  ApiResponse<{
    message: string;
    payload: ApiNode;
  }>
>;
