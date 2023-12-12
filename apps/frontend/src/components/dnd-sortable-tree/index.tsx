"use client";

import type { DropOptions, NodeModel } from "@minoru/react-dnd-treeview";
import {
  DndProvider,
  MultiBackend,
  Tree,
  getBackendOptions,
} from "@minoru/react-dnd-treeview";
import { useEffect, useState } from "react";
import CustomItem from "./custom-item";
import DragPreview from "./drag-preview";
import { itemToNodeModel, nodeModelToItem } from "./helpers";
import Placeholder from "./placeholder";

export type Node = {
  id: number;
  created_at: Date;
  updated_at: Date;
  parent_id: number;
  created_by: number;

  parent: Node;

  name: string;
  slug: string;
  description: string;
};

export type DndItem = {
  dndId: number;
  dndParentId: number;
};

type Props<T extends DndItem> = {
  items: T[];
  indent?: number;
  titleSelector?: string;
  onTreeUpdated?: (tree: T[], options: DropOptions<T>) => void;
};

export default function DndSortableTree<T extends DndItem>({
  items: initialItems,
  indent = 24,
  titleSelector = "name",
  onTreeUpdated,
}: Props<T>) {
  const [items, setItems] = useState<NodeModel<T>[]>(() => {
    return initialItems.map(itemToNodeModel);
  });

  useEffect(() => {
    setItems(initialItems.map(itemToNodeModel));
  }, [initialItems]);

  function onDrop(tree: NodeModel<T>[], options: DropOptions<T>) {
    setItems(tree);
    onTreeUpdated?.(tree.map(nodeModelToItem), options);
  }

  return (
    <DndProvider backend={MultiBackend} options={getBackendOptions()}>
      <Tree
        canDrop={(tree, { dragSource, dropTargetId }) => {
          if (dragSource?.parent === dropTargetId) {
            return true;
          }
        }}
        classes={{
          // This is a hack to make the tree object bigger in the DOM so that
          // the drop target is more bigger and easier to hit.
          root: "relative p-4 -m-4",
          placeholder: "relative",
          container: "space-y-1",
          listItem: "space-y-1",
        }}
        // eslint-disable-next-line react/no-unstable-nested-components -- i don't know what this means
        dragPreviewRender={(monitorProps) => (
          <DragPreview indent={indent} {...monitorProps} />
        )}
        dropTargetOffset={10}
        onDrop={onDrop}
        // eslint-disable-next-line react/no-unstable-nested-components -- i don't know what this means
        placeholderRender={(node, params) => (
          <Placeholder indent={indent} node={node} {...params} />
        )}
        render={(node, options) => (
          <CustomItem
            indent={indent}
            node={node}
            titleSelector={titleSelector}
            {...options}
          />
        )}
        rootId={0}
        sort={false}
        tree={items}
      />
    </DndProvider>
  );
}
