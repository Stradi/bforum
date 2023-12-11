"use client";

import { Button, Text } from "@radix-ui/themes";
import { SaveIcon, TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";
import DndSortableTree from "../../../../components/dnd-sortable-tree";
import type { updateNodeOrder } from "../actions";
import type { DndNode } from "../types";

type Props = {
  nodes: DndNode[];
  updateNodeOrderApi: (nodes: DndNode[]) => ReturnType<typeof updateNodeOrder>;
};

export default function NodesEditor({ nodes, updateNodeOrderApi }: Props) {
  const [savedNodesState, setSavedNodesState] = useState<DndNode[]>(nodes);
  const [updatedNodes, setUpdatedNodes] = useState<DndNode[]>(nodes);

  const hasChanges =
    JSON.stringify(savedNodesState) !== JSON.stringify(updatedNodes);

  useEffect(() => {
    setSavedNodesState(nodes);
    setUpdatedNodes(nodes);
  }, [nodes]);

  return (
    <div>
      <div className="pb-1 flex justify-end items-center">
        <div className="space-x-1">
          <Button
            color="red"
            disabled={!hasChanges}
            onClick={() => {
              setUpdatedNodes(savedNodesState);
            }}
          >
            <TrashIcon className="w-3 h-3" />
            Discard Changes
          </Button>
          <Button
            disabled={!hasChanges}
            // eslint-disable-next-line @typescript-eslint/no-misused-promises -- I don't know why this happens
            onClick={async () => {
              // I don't know if we should update the saved nodes state here
              // needs testing
              await updateNodeOrderApi(updatedNodes);
            }}
          >
            <SaveIcon className="w-3 h-3" /> Save
          </Button>
        </div>
      </div>
      {nodes.length > 0 ? (
        <DndSortableTree<DndNode>
          items={updatedNodes}
          onTreeUpdated={setUpdatedNodes}
          titleSelector="name"
        />
      ) : (
        <Text my="6">You don&apos;t have any nodes yet. Create one!</Text>
      )}
    </div>
  );
}
