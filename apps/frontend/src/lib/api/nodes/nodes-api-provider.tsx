"use client";

import type { PropsWithChildren } from "react";
import { createContext } from "react";
import type {
  CreateNodeApiFn,
  DeleteNodeApiFn,
  UpdateNodeApiFn,
  UpdateNodeOrderApiFn,
} from "./nodes-types";
import {
  createNode,
  deleteNode,
  updateNode,
  updateNodeOrder,
} from "./nodes-actions";

type TNodesApiContext = {
  createNode: CreateNodeApiFn;
  updateNode: UpdateNodeApiFn;
  updateNodeOrder: UpdateNodeOrderApiFn;
  deleteNode: DeleteNodeApiFn;
};

const NodesApiContext = createContext<TNodesApiContext>({} as TNodesApiContext);

type Props = PropsWithChildren;
function NodesApiProvider({ children }: Props) {
  return (
    <NodesApiContext.Provider
      value={{
        createNode: createNode.bind(null, "/admin/nodes"),
        deleteNode: deleteNode.bind(null, "/admin/nodes"),
        updateNode: updateNode.bind(null, "/admin/nodes"),
        updateNodeOrder: updateNodeOrder.bind(null, "/admin/nodes"),
      }}
    >
      {children}
    </NodesApiContext.Provider>
  );
}

export { NodesApiContext, NodesApiProvider };
