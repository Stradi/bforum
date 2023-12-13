"use client";

import type { DropOptions, NodeModel } from "@minoru/react-dnd-treeview";
import { Button, Text } from "@radix-ui/themes";
import { SaveIcon, TrashIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import DndSortableTree from "../../../../components/dnd-sortable-tree";
import {
  calculateLexoRanks,
  itemToNodeModelWithLexoRank,
  nodeModelToItem,
} from "../../../../components/dnd-sortable-tree/helpers";
import type { updateNodeOrder } from "../actions";
import type { DndNode } from "../types";

type UpdateNodeOrderApiPayload = Parameters<typeof updateNodeOrder>[1];

type Props = {
  nodes: DndNode[];
  updateNodeOrderApi: (
    params: UpdateNodeOrderApiPayload
  ) => ReturnType<typeof updateNodeOrder>;
};

export default function NodesEditor({ nodes, updateNodeOrderApi }: Props) {
  const [savedNodesState, setSavedNodesState] = useState<DndNode[]>(nodes);
  const [updatedNodes, setUpdatedNodes] = useState<DndNode[]>(nodes);

  const rankedTree = useRef<NodeModel<DndNode>[]>(
    nodes.map(itemToNodeModelWithLexoRank)
  );

  const hasChanges =
    JSON.stringify(savedNodesState) !== JSON.stringify(updatedNodes);

  useEffect(() => {
    setSavedNodesState(nodes);
    setUpdatedNodes(nodes);
    rankedTree.current = nodes.map(itemToNodeModelWithLexoRank);
  }, [nodes]);

  function onTreeUpdated(newNodes: DndNode[], options: DropOptions<DndNode>) {
    rankedTree.current = calculateLexoRanks(
      newNodes.map(itemToNodeModelWithLexoRank),
      options
    );
    setUpdatedNodes(rankedTree.current.map(nodeModelToItem));
  }

  return (
    <div>
      <div className="pb-1 flex justify-end items-center">
        <div className="space-x-1">
          <Button
            color="red"
            disabled={!hasChanges}
            onClick={() => {
              setUpdatedNodes(savedNodesState);
              rankedTree.current = savedNodesState.map(
                itemToNodeModelWithLexoRank
              );
            }}
          >
            <TrashIcon className="w-3 h-3" />
            Discard Changes
          </Button>
          <Button
            disabled={!hasChanges}
            // eslint-disable-next-line @typescript-eslint/no-misused-promises -- I don't know why this happens
            onClick={async () => {
              const payload = generateOrderUpdatePayload(rankedTree.current);
              await updateNodeOrderApi(payload);
            }}
          >
            <SaveIcon className="w-3 h-3" /> Save
          </Button>
        </div>
      </div>
      {nodes.length > 0 ? (
        <DndSortableTree<DndNode>
          items={updatedNodes}
          onTreeUpdated={onTreeUpdated}
          titleSelector="name"
        />
      ) : (
        <Text my="6">You don&apos;t have any nodes yet. Create one!</Text>
      )}
    </div>
  );
}

function generateOrderUpdatePayload(tree: NodeModel<DndNode>[]) {
  const payload: UpdateNodeOrderApiPayload = [];
  for (const _node of tree) {
    const node = {
      ..._node,
      data: {
        ..._node.data,
        dndParentId:
          _node.data?.dndParentId === -1 ? null : _node.data?.dndParentId,
      },
    };

    if (
      node.data.order !== node.data.dndLexoRank ||
      node.data.dndParentId !== node.data.parent_id
    ) {
      payload.push({
        id: node.id as number,
        lexoRank: node.data.dndLexoRank ?? "",
        parentId: node.data.dndParentId ?? null,
      });
    }
  }
  return payload;
}
