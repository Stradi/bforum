"use client";

import type { DropOptions, NodeModel } from "@minoru/react-dnd-treeview";
import { Button, Text } from "@radix-ui/themes";
import { SaveIcon, TrashIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import DndSortableTree from "../../../../components/dnd-sortable-tree";
import {
  calculateLexoRanks,
  itemToNodeModel,
} from "../../../../components/dnd-sortable-tree/helpers";
import type { updateNodeOrder } from "../actions";
import type { DndNode } from "../types";

type Props = {
  nodes: DndNode[];
  updateNodeOrderApi: (nodes: DndNode[]) => ReturnType<typeof updateNodeOrder>;
};

export default function NodesEditor({ nodes, updateNodeOrderApi }: Props) {
  const [savedNodesState, setSavedNodesState] = useState<DndNode[]>(nodes);
  const [updatedNodes, setUpdatedNodes] = useState<DndNode[]>(nodes);

  const rankedTree = useRef<NodeModel<DndNode & { dndLexoRank: string }>[]>(
    calculateLexoRanks(nodes.map(itemToNodeModel))
  );

  const hasChanges =
    JSON.stringify(savedNodesState) !== JSON.stringify(updatedNodes);

  useEffect(() => {
    setSavedNodesState(nodes);
    updateNodes(nodes);
  }, [nodes]);

  function updateNodes(newNodes: DndNode[], options?: DropOptions<DndNode>) {
    setUpdatedNodes(newNodes);
    rankedTree.current = calculateLexoRanks(
      newNodes.map(itemToNodeModel),
      options
    );
  }

  return (
    <div>
      <div className="pb-1 flex justify-end items-center">
        <div className="space-x-1">
          <Button
            color="red"
            disabled={!hasChanges}
            onClick={() => {
              updateNodes(savedNodesState);
            }}
          >
            <TrashIcon className="w-3 h-3" />
            Discard Changes
          </Button>
          <Button
            disabled={!hasChanges}
            // eslint-disable-next-line @typescript-eslint/no-misused-promises -- I don't know why this happens
            onClick={async () => {
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
          onTreeUpdated={updateNodes}
          titleSelector="name"
        />
      ) : (
        <Text my="6">You don&apos;t have any nodes yet. Create one!</Text>
      )}
    </div>
  );
}
