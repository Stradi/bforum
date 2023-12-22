"use client";

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
          "box-content text-sm font-medium text-neutral-400",
          "transition-[color] duration-200 hover:text-neutral-950",
          isActive && "border-b-2 border-neutral-950 text-neutral-950"
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

NavigationItem.displayName = "NavigationItem";
export default NavigationItem;
