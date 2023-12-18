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
          "text-sm text-neutral-500 p-2 rounded-md",
          "hover:text-neutral-950 hover:bg-neutral-100 transition-[color] duration-200",
          isActive && "text-neutral-950 font-medium"
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

NavigationItem.displayName = "NavigationItem";
export default NavigationItem;
