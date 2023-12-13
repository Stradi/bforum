import type { NodeModel, RenderParams } from "@minoru/react-dnd-treeview";
import { Button } from "@radix-ui/themes";
import {
  ChevronsDownUpIcon,
  ChevronsUpDownIcon,
  GripVerticalIcon,
} from "lucide-react";
import type { MouseEvent } from "react";
import type { DndItem } from ".";
import { cn } from "../../utils/tw";

type Props<T extends DndItem> = RenderParams & {
  node: NodeModel<T>;
  indent: number;
  titleSelector: string;
  onClick?: () => void;
};

export default function CustomItem<T extends DndItem>({
  node,
  indent,
  depth,
  hasChild,
  onToggle,
  handleRef,
  isDropTarget,
  isDragging,
  isOpen,
  titleSelector,
  onClick,
}: Props<T>) {
  function onCollapse(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    onToggle();
  }

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events -- no need for keyboard events
    <div
      className={cn(
        "flex gap-4 items-center border rounded-md px-3 py-1 bg-neutral-100",
        "transition duration-100",
        isDropTarget && "border-neutral-300 bg-neutral-200",
        isDragging && "opacity-50",
        onClick &&
          "cursor-pointer hover:bg-neutral-200 hover:border-neutral-300"
      )}
      data-has-child={hasChild}
      onClick={() => {
        onClick?.();
      }}
      role="button"
      style={{
        marginLeft: depth * indent,
      }}
      tabIndex={0}
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
      <p
        className={cn(isDragging && "opacity-0")}
        style={{
          paddingLeft: hasChild ? 0 : 24,
        }}
      >
        {node.data?.[titleSelector] ?? node.text ?? node.id ?? "Untitled"}
      </p>
    </div>
  );
}
