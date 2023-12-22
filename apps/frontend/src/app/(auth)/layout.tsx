import type { PropsWithChildren } from "react";

type Props = PropsWithChildren;
export default function Layout({ children }: Props) {
  return (
    <div className="flex h-screen w-full">
      <div className="hidden w-1/2 items-center justify-center bg-neutral-900 text-white md:flex">
        <h2 className="text-2xl">Welcome to bForum!</h2>
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-4 md:w-1/2">
        {children}
      </div>
    </div>
  );
}
