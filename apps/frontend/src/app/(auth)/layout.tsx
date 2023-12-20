import type { PropsWithChildren } from "react";

type Props = PropsWithChildren;
export default function Layout({ children }: Props) {
  return (
    <div className="w-full h-screen flex">
      <div className="hidden md:flex w-1/2 bg-neutral-900 items-center justify-center text-white">
        <h2 className="text-2xl">Welcome to bForum!</h2>
      </div>
      <div className="w-full md:w-1/2 flex flex-col gap-4 items-center justify-center">
        {children}
      </div>
    </div>
  );
}
