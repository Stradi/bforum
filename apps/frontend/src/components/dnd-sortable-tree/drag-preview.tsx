"use client";

import type { DragLayerMonitorProps } from "@minoru/react-dnd-treeview";
import { ChevronsDownUpIcon, GripVerticalIcon } from "lucide-react";
import { Button } from "@components/ui/button";
import type { DndItem } from ".";

type Props<T extends DndItem> = DragLayerMonitorProps<T> & {
  indent: number;
};
export default function DragPreview<T extends DndItem>({
  item,
  indent,
}: Props<T>) {
  const hasChild =
    item.ref.current?.querySelector("*>div[data-has-child='true']") !== null;
  return (
    <div className="flex gap-4 items-center bg-neutral-100 border border-neutral-300 rounded-md px-3 py-1 w-full">
      <Button className="p-0" size="icon" type="button" variant="ghost">
        <GripVerticalIcon className="w-4 h-4" />
      </Button>
      {hasChild ? (
        <Button size="icon" type="button" variant="ghost">
          <ChevronsDownUpIcon className="w-4 h-4" />
        </Button>
      ) : null}
      <p
        style={{
          paddingLeft: hasChild ? 0 : indent,
        }}
      >
        {item.text}
      </p>
    </div>
  );
}
