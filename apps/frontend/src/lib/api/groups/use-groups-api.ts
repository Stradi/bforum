"use client";

import { useContext } from "react";
import { GroupsApiContext } from "./groups-api-provider";

export default function useGroupsApi() {
  const context = useContext(GroupsApiContext);
  return context;
}
