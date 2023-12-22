"use client";

import type { DropOptions, NodeModel } from "@minoru/react-dnd-treeview";
import { SaveIcon, TrashIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  calculateLexoRanks,
  itemToNodeModelWithLexoRank,
  nodeModelToItem,
} from "@components/dnd-sortable-tree/helpers";
import DndSortableTree from "@components/dnd-sortable-tree";
import { Button } from "@components/ui/button";
import useNodesApi from "../_helpers/use-nodes-api";
import type { DndNode, UpdateNodeOrderFormData } from "../types";
import NodeDetailsDialog from "./node-details-dialog";

type Props = {
  nodes: DndNode[];
};

export default function NodesEditor({ nodes }: Props) {
  const api = useNodesApi();

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
      <div className="flex items-center justify-end pb-1">
        <div className="space-x-1">
          <Button
            className="gap-1"
            disabled={!hasChanges}
            onClick={() => {
              setUpdatedNodes(savedNodesState);
              rankedTree.current = savedNodesState.map(
                itemToNodeModelWithLexoRank
              );
            }}
            variant="ghost"
          >
            <TrashIcon className="size-4" />
            Discard Changes
          </Button>
          <Button
            className="gap-1"
            disabled={!hasChanges}
            // eslint-disable-next-line @typescript-eslint/no-misused-promises -- I don't know why this happens
            onClick={async () => {
              const payload = generateOrderUpdatePayload(rankedTree.current);
              const response = await api.updateNodeOrder(payload);
              if (response.success) {
                toast.success(response.data.message);
              } else {
                toast.error(response.error.message);
              }
            }}
          >
            <SaveIcon className="size-4" /> Save
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
        <p className="my-6">You don&apos;t have any nodes yet. Create one!</p>
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
