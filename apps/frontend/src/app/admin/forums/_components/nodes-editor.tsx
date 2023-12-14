"use client";

import DndSortableTree from "@components/dnd-sortable-tree";
import {
  calculateLexoRanks,
  itemToNodeModelWithLexoRank,
  nodeModelToItem,
} from "@components/dnd-sortable-tree/helpers";
import type { DropOptions, NodeModel } from "@minoru/react-dnd-treeview";
import { Button, Text } from "@radix-ui/themes";
import { SaveIcon, TrashIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import useForumsApi from "../_helpers/use-forums-api";
import type { DndNode, UpdateNodeOrderFormData } from "../types";
import NodeDetailsDialog from "./node-details-dialog";

type Props = {
  nodes: DndNode[];
};

export default function NodesEditor({ nodes }: Props) {
  const api = useForumsApi();

  const [savedNodesState, setSavedNodesState] = useState<DndNode[]>(nodes);
  const [updatedNodes, setUpdatedNodes] = useState<DndNode[]>(nodes);

  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<DndNode | null>(null);

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
              await api.updateNodeOrder(payload);
            }}
          >
            <SaveIcon className="w-3 h-3" /> Save
          </Button>
        </div>
      </div>
      {nodes.length > 0 ? (
        <>
          {selectedNode ? (
            <NodeDetailsDialog
              key={JSON.stringify(selectedNode)} // we need a better key
              node={selectedNode}
              open={isDetailsDialogOpen}
              setOpen={setIsDetailsDialogOpen}
            />
          ) : null}
          <DndSortableTree<DndNode>
            initialOpen
            items={updatedNodes}
            onNodeClick={(node) => {
              setSelectedNode(node);
              setIsDetailsDialogOpen(true);
            }}
            onTreeUpdated={onTreeUpdated}
            titleSelector="name"
          />
        </>
      ) : (
        <Text my="6">You don&apos;t have any nodes yet. Create one!</Text>
      )}
    </div>
  );
}

function generateOrderUpdatePayload(tree: NodeModel<DndNode>[]) {
  const payload: UpdateNodeOrderFormData = [];
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
