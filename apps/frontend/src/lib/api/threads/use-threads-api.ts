"use client";

import { useContext } from "react";
import { ThreadsApiContext } from "./threads-api-provider";

export default function useThreadsApi() {
  const context = useContext(ThreadsApiContext);
  return context;
}
