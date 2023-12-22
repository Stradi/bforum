"use client";

import type { PropsWithChildren } from "react";
import { createContext } from "react";
import type {
  CreateGroupApiFn,
  DeleteGroupApiFn,
  UpdateGroupApiFn,
  UpdateGroupPermissionsApiFn,
} from "./groups-types";
import {
  createGroup,
  deleteGroup,
  updateGroup,
  updateGroupPermissions,
} from "./groups-actions";

type TGroupsApiContext = {
  createGroup: CreateGroupApiFn;
  updateGroupPermissions: UpdateGroupPermissionsApiFn;
  updateGroup: UpdateGroupApiFn;
  deleteGroup: DeleteGroupApiFn;
};

const GroupsApiContext = createContext<TGroupsApiContext>(
  {} as TGroupsApiContext
);

type Props = PropsWithChildren;
function GroupsApiProvider({ children }: Props) {
  return (
    <GroupsApiContext.Provider
      value={{
        createGroup: createGroup.bind(null, "/admin/groups"),
        deleteGroup: deleteGroup.bind(null, "/admin/groups"),
        updateGroup: updateGroup.bind(null, "/admin/groups"),
        updateGroupPermissions: updateGroupPermissions.bind(
          null,
          "/admin/groups"
        ),
      }}
    >
      {children}
    </GroupsApiContext.Provider>
  );
}

export { GroupsApiContext, GroupsApiProvider };
