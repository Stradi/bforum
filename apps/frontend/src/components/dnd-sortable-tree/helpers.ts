/* eslint-disable @typescript-eslint/no-non-null-assertion -- why not */
import type { DropOptions, NodeModel } from "@minoru/react-dnd-treeview";
import { LexoRank } from "lexorank";
import LexoRankBucket from "lexorank/lib/lexoRank/lexoRankBucket";
import type { DndItem } from ".";

export function itemToNodeModel<T extends DndItem>(item: T): NodeModel<T> {
  return {
    id: item.dndId,
    parent: item.dndParentId,
    text: "",
    droppable: true,
    data: item,
  };
}

export function nodeModelToItem<T extends DndItem>(node: NodeModel<T>): T {
  return {
    ...node.data,
    dndId: Number(node.id),
    dndParentId: Number(node.parent),
  } as T;
}

function flattenTree<T extends DndItem>(tree: NodeModel<T>[]) {
  const result: NodeModel<T>[] = [];

  function traverse(node: NodeModel<T>) {
    result.push(node);
    getChildren(tree, Number(node.id)).forEach(traverse);
  }

  tree.forEach(traverse);

  // Basically, removes duplicates from start of array.
  const reversed = result.toReversed();
  return reversed.filter((n, i) => reversed.indexOf(n) === i).toReversed();
}

export function calculateLexoRanks<T extends DndItem & { dndLexoRank: string }>(
  tree: NodeModel<T>[],
  options?: DropOptions<T>
) {
  const flatTree = flattenTree(tree);
  const rankedTree = [...flatTree];

  if (!options) {
    let previousRank: LexoRank | null = null;
    for (const node of rankedTree) {
      const rank = previousRank ? previousRank.genNext() : LexoRank.middle();
      node.data!.dndLexoRank = rank.toString();
      previousRank = rank;
    }

    return flatTree;
  }

  const movedNodeIdx = getIndex(flatTree, options.dragSourceId!);
  const previousNode = movedNodeIdx > 0 ? flatTree[movedNodeIdx - 1] : null;
  const nextNode =
    movedNodeIdx < flatTree.length - 1 ? flatTree[movedNodeIdx + 1] : null;

  let newRank: LexoRank | null = null;
  if (previousNode) {
    const rankObj = LexoRank.parse(previousNode.data!.dndLexoRank);
    if (nextNode) {
      newRank = rankObj.between(LexoRank.parse(nextNode.data!.dndLexoRank));
    } else {
      newRank = rankObj.genNext();
    }
  } else if (nextNode) {
    newRank = LexoRank.parse(nextNode.data!.dndLexoRank).genPrev();
  } else {
    newRank = LexoRank.initial(LexoRankBucket.BUCKET_0);
  }

  rankedTree[movedNodeIdx].data!.dndLexoRank = newRank.toString();
  return rankedTree;
}

function getChildren(tree: NodeModel<DndItem>[], parentId: number) {
  return tree.filter((n) => n.parent === parentId);
}

function getIndex(tree: NodeModel<DndItem>[], id: NodeModel["id"]) {
  return tree.findIndex((n) => n.id === id);
}
