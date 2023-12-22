import type { PropsWithChildren, ReactNode } from "react";
import React from "react";

type Props = PropsWithChildren & {
  modal: ReactNode;
};

export default function Layout({ children, modal }: Props) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
