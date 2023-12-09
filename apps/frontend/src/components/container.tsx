import type { ComponentPropsWithoutRef } from "react";
import { cn } from "../utils/tw";

type Props = ComponentPropsWithoutRef<"div">;
export default function Container({ className, ...props }: Props) {
  return (
    <div
      className={cn("container mx-auto max-w-7xl p-0", className)}
      {...props}
    />
  );
}
