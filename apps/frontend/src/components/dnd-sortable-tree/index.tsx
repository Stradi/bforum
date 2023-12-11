"use client";

import type { NodeModel } from "@minoru/react-dnd-treeview";
import {
  DndProvider,
  MultiBackend,
  Tree,
  getBackendOptions,
} from "@minoru/react-dnd-treeview";
import { useEffect, useState } from "react";
import CustomItem from "./custom-item";
import DragPreview from "./drag-preview";
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
};

function itemToNodeModel<T extends DndItem>(item: T): NodeModel<T> {
  return {
    id: item.dndId,
    parent: item.dndParentId,
    text: "",
    droppable: true,
    data: item,
  };
}

export default function DndSortableTree<T extends DndItem>({
  items: initialItems,
  indent = 24,
  titleSelector = "name",
}: Props<T>) {
  const [items, setItems] = useState<NodeModel<T>[]>(() => {
    return initialItems.map(itemToNodeModel);
  });

  useEffect(() => {
    setItems(initialItems.map(itemToNodeModel));
  }, [initialItems]);

  function onDrop(tree: NodeModel<T>[]) {
    setItems(tree);
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
