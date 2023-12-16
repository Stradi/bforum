"use client";

import type { PropsWithChildren } from "react";
import { createContext } from "react";
import type {
  CreateNodeApiFn,
  DeleteNodeApiFn,
  UpdateNodeApiFn,
  UpdateNodeOrderApiFn,
} from "../types";

type TNodesApiContext = {
  createNode: CreateNodeApiFn;
  updateNode: UpdateNodeApiFn;
  updateNodeOrder: UpdateNodeOrderApiFn;
  deleteNode: DeleteNodeApiFn;
};

const NodesApiContext = createContext<TNodesApiContext>({} as TNodesApiContext);

type Props = PropsWithChildren & TNodesApiContext;
function NodesApiProvider({ children, ...props }: Props) {
  return (
    <NodesApiContext.Provider value={props}>
      {children}
    </NodesApiContext.Provider>
  );
}

export { NodesApiContext, NodesApiProvider };
