"use client";

import type { PropsWithChildren } from "react";
import { createContext, useContext } from "react";
import type {
  CreateNodeApiFn,
  DeleteNodeApiFn,
  UpdateNodeApiFn,
  UpdateNodeOrderApiFn,
} from "./types";

type TApiContext = {
  createNode: CreateNodeApiFn;
  updateNode: UpdateNodeApiFn;
  updateNodeOrder: UpdateNodeOrderApiFn;
  deleteNode: DeleteNodeApiFn;
};

const ApiContext = createContext<TApiContext>({} as TApiContext);

type Props = PropsWithChildren & TApiContext;
function ApiContextProvider({ children, ...props }: Props) {
  return <ApiContext.Provider value={props}>{children}</ApiContext.Provider>;
}

function useApiContext() {
  const context = useContext(ApiContext);
  return context;
}

export { ApiContext, ApiContextProvider, useApiContext };
