import type { NodeModel } from "@minoru/react-dnd-treeview";
import {
  DndProvider,
  MultiBackend,
  Tree,
  getBackendOptions,
} from "@minoru/react-dnd-treeview";
import { useState } from "react";
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

const initialNodes: NodeModel<Partial<Node>>[] = [
  {
    id: 1,
    parent: 0,
    text: "Announcements",
    droppable: true,
    data: {
      id: 0,
    },
  },
  {
    id: 2,
    parent: 0,
    text: "Introductions",
    droppable: true,
    data: {
      id: 1,
    },
  },
  {
    id: 3,
    parent: 0,
    text: "Programming",
    droppable: true,
    data: {
      id: 2,
    },
  },
  {
    id: 4,
    parent: 3,
    text: "C#",
    droppable: true,
    data: {
      id: 3,
    },
  },
  {
    id: 5,
    parent: 3,
    text: "JavaScript",
    droppable: true,
    data: {
      id: 4,
    },
  },
];

export default function DndSortableTree() {
  const [items, setItems] = useState(initialNodes);

  function onDrop(tree: NodeModel<Partial<Node>>[]) {
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
          root: "relative p-32 -m-32",
          placeholder: "relative",
          container: "space-y-1",
          listItem: "space-y-1",
        }}
        // eslint-disable-next-line react/no-unstable-nested-components -- i don't know what this means
        dragPreviewRender={(monitorProps) => <DragPreview {...monitorProps} />}
        dropTargetOffset={10}
        onDrop={onDrop}
        // eslint-disable-next-line react/no-unstable-nested-components -- i don't know what this means
        placeholderRender={(node, params) => (
          <Placeholder node={node} {...params} />
        )}
        render={(node, options) => <CustomItem node={node} {...options} />}
        rootId={0}
        sort={false}
        tree={items}
      />
    </DndProvider>
  );
}
