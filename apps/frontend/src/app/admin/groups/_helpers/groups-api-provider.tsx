"use client";

import type { PropsWithChildren } from "react";
import { createContext } from "react";
import type { CreateGroupApiFn } from "../types";

type TGroupsApiContext = {
  createGroup: CreateGroupApiFn;
};

const GroupsApiContext = createContext<TGroupsApiContext>(
  {} as TGroupsApiContext
);

type Props = PropsWithChildren & TGroupsApiContext;
function GroupsApiProvider({ children, ...props }: Props) {
  return (
    <GroupsApiContext.Provider value={props}>
      {children}
    </GroupsApiContext.Provider>
  );
}

export { GroupsApiContext, GroupsApiProvider };
