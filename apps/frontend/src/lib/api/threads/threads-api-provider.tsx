"use client";

import type { PropsWithChildren } from "react";
import { createContext } from "react";
import type { CreateThreadApiFn } from "./threads-types";

type TThreadsApiContext = {
  createThread: CreateThreadApiFn;
};

const ThreadsApiContext = createContext<TThreadsApiContext>(
  {} as TThreadsApiContext
);

type Props = PropsWithChildren & TThreadsApiContext;
function ThreadsApiProvider({ children, ...props }: Props) {
  return (
    <ThreadsApiContext.Provider value={props}>
      {children}
    </ThreadsApiContext.Provider>
  );
}

export { ThreadsApiContext, ThreadsApiProvider };
