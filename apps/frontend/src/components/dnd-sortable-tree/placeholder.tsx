"use client";

import type {
  NodeModel,
  PlaceholderRenderParams,
} from "@minoru/react-dnd-treeview";
import type { DndItem } from ".";

type Props<T extends DndItem> = PlaceholderRenderParams & {
  node: NodeModel<T>;
  indent: number;
};

export default function Placeholder<T extends DndItem>({
  depth,
  indent,
}: Props<T>) {
  return (
    <div
      className="absolute right-0 top-0 h-1 -translate-y-2/3 rounded-full bg-blue-400"
      style={{
        left: depth * indent,
      }}
    />
  );
}
