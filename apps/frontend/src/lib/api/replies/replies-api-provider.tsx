"use client";

import type { PropsWithChildren } from "react";
import { createContext } from "react";
import type { CreateReplyApiFn } from "./replies-types";

type TRepliesApiContext = {
  createReply: CreateReplyApiFn;
};

const RepliesApiContext = createContext<TRepliesApiContext>(
  {} as TRepliesApiContext
);

type Props = PropsWithChildren & TRepliesApiContext;
function RepliesApiProvider({ children, ...props }: Props) {
  return (
    <RepliesApiContext.Provider value={props}>
      {children}
    </RepliesApiContext.Provider>
  );
}

export { RepliesApiContext, RepliesApiProvider };
