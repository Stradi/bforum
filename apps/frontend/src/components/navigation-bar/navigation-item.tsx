import Link from "next/link";
import type { ComponentPropsWithoutRef, ElementRef } from "react";
import { forwardRef } from "react";
import { cn } from "@utils/tw";

type Props = ComponentPropsWithoutRef<typeof Link> & {
  isActive?: boolean;
};

const NavigationItem = forwardRef<ElementRef<typeof Link>, Props>(
  ({ isActive, ...props }, ref) => {
    return (
      <Link
        className={cn(
          "text-sm font-medium text-neutral-400 box-content",
          "hover:text-neutral-950 transition-[color] duration-200",
          isActive && "text-neutral-950 border-b-2 border-neutral-950"
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

NavigationItem.displayName = "NavigationItem";
export default NavigationItem;
