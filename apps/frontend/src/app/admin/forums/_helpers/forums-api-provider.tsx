"use client";

import type { PropsWithChildren } from "react";
import { createContext } from "react";
import type {
  CreateNodeApiFn,
  DeleteNodeApiFn,
  UpdateNodeApiFn,
  UpdateNodeOrderApiFn,
} from "../types";

type TForumsApiContext = {
  createNode: CreateNodeApiFn;
  updateNode: UpdateNodeApiFn;
  updateNodeOrder: UpdateNodeOrderApiFn;
  deleteNode: DeleteNodeApiFn;
};

const ForumsApiContext = createContext<TForumsApiContext>(
  {} as TForumsApiContext
);

type Props = PropsWithChildren & TForumsApiContext;
function ForumsApiProvider({ children, ...props }: Props) {
  return (
    <ForumsApiContext.Provider value={props}>
      {children}
    </ForumsApiContext.Provider>
  );
}

export { ForumsApiContext, ForumsApiProvider };
