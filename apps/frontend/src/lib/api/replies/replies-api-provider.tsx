"use client";

import type { PropsWithChildren } from "react";
import { createContext } from "react";
import type { CreateReplyApiFn } from "./replies-types";
import { createReply } from "./replies-action";

type TRepliesApiContext = {
  createReply: CreateReplyApiFn;
};

const RepliesApiContext = createContext<TRepliesApiContext>(
  {} as TRepliesApiContext
);

type Props = PropsWithChildren;
function RepliesApiProvider({ children }: Props) {
  return (
    <RepliesApiContext.Provider
      value={{
        createReply: createReply.bind(null),
      }}
    >
      {children}
    </RepliesApiContext.Provider>
  );
}

export { RepliesApiContext, RepliesApiProvider };
