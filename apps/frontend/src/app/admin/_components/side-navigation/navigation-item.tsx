"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentPropsWithoutRef, ElementRef } from "react";
import { forwardRef } from "react";
import { cn } from "@utils/tw";

type Props = ComponentPropsWithoutRef<typeof Link>;
const NavigationItem = forwardRef<ElementRef<typeof Link>, Props>(
  ({ ...props }, ref) => {
    const pathname = usePathname();
    const isActive = pathname === props.href;

    return (
      <Link
        className={cn(
          "rounded-md p-2 text-sm text-neutral-500",
          "transition-[color] duration-200 hover:bg-neutral-100 hover:text-neutral-950",
          isActive && "font-medium text-neutral-950"
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

NavigationItem.displayName = "NavigationItem";
export default NavigationItem;
