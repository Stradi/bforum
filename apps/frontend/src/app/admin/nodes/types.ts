import type { ApiNode } from "@lib/api/api.types";

export type DndNode = ApiNode & {
  dndId: number;
  dndParentId: number;
  dndLexoRank: string;
};
