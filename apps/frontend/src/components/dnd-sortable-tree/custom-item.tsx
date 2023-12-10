import type { NodeModel, RenderParams } from "@minoru/react-dnd-treeview";
import { Button } from "@radix-ui/themes";
import {
  ChevronsDownUpIcon,
  ChevronsUpDownIcon,
  GripVerticalIcon,
} from "lucide-react";
import type { MouseEvent } from "react";
import { cn } from "../../utils/tw";
import type { Node } from ".";

type Props = RenderParams & {
  node: NodeModel<Partial<Node>>;
};

export default function CustomItem({
  node,
  depth,
  hasChild,
  onToggle,
  handleRef,
  isDropTarget,
  isDragging,
  isOpen,
}: Props) {
  function onCollapse(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    onToggle();
  }

  return (
    <div
      className={cn(
        "flex gap-4 items-center border rounded-md px-3 py-1 bg-neutral-100",
        isDropTarget && "border-neutral-300 bg-neutral-200",
        isDragging && "opacity-50"
      )}
      data-has-child={hasChild}
      style={{
        marginLeft: depth * 24,
      }}
    >
      <Button
        className={cn("!py-1 !px-1", isDragging && "opacity-0")}
        ref={handleRef}
        type="button"
        variant="ghost"
      >
        <GripVerticalIcon className="w-4 h-4" />
      </Button>
      {hasChild ? (
        <Button
          className={cn("!py-1 !px-1", isDragging && "opacity-0")}
          onClick={onCollapse}
          type="button"
          variant="ghost"
        >
          {isOpen ? (
            <ChevronsDownUpIcon className="w-4 h-4" />
          ) : (
            <ChevronsUpDownIcon className="w-4 h-4" />
          )}
        </Button>
      ) : null}
      <p className={cn(!hasChild && "pl-6", isDragging && "opacity-0")}>
        {node.text}
      </p>
    </div>
  );
}
