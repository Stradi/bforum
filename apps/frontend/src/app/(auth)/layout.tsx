import { Heading } from "@radix-ui/themes";
import type { PropsWithChildren } from "react";

type Props = PropsWithChildren;
export default function Layout({ children }: Props) {
  return (
    <div className="w-full h-screen flex">
      <div className="hidden md:flex w-1/2 bg-neutral-900 items-center justify-center text-white">
        <Heading as="h2">Welcome to bForum!</Heading>
      </div>
      <div className="w-full md:w-1/2 flex flex-col gap-4 items-center justify-center">
        {children}
      </div>
    </div>
  );
}
