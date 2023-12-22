"use client";

import type { PropsWithChildren } from "react";
import { createContext } from "react";
import type { CreateThreadApiFn } from "./threads-types";
import { createThread } from "./threads-actions";

type TThreadsApiContext = {
  createThread: CreateThreadApiFn;
};

const ThreadsApiContext = createContext<TThreadsApiContext>(
  {} as TThreadsApiContext
);

type Props = PropsWithChildren;
function ThreadsApiProvider({ children }: Props) {
  return (
    <ThreadsApiContext.Provider
      value={{
        createThread: createThread.bind(null),
      }}
    >
      {children}
    </ThreadsApiContext.Provider>
  );
}

export { ThreadsApiContext, ThreadsApiProvider };
