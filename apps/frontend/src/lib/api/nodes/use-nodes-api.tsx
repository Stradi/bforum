"use client";

import { useContext } from "react";
import { NodesApiContext } from "./nodes-api-provider";

export default function useNodesApi() {
  const context = useContext(NodesApiContext);
  return context;
}
