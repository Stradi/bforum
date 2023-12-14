"use client";

import { useContext } from "react";
import { ForumsApiContext } from "./forums-api-provider";

export default function useForumsApi() {
  const context = useContext(ForumsApiContext);
  return context;
}
