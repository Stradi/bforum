import { useContext } from "react";
import { RepliesApiContext } from "./replies-api-provider";

export default function useRepliesApi() {
  const context = useContext(RepliesApiContext);
  return context;
}
