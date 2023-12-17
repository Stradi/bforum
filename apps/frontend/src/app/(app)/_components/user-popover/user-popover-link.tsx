"use client";

import { Link } from "@radix-ui/themes";
import { default as NextLink } from "next/link";
import type { ComponentProps } from "react";

type Props = {
  label: string;
  href: string;
  color?: ComponentProps<typeof Link>["color"];
};
export default function UserPopoverLink({ label, href, color }: Props) {
  return (
    <Link
      asChild
      className="hover:bg-[var(--accent-a3)] p-1.5"
      color={color}
      size="2"
    >
      <NextLink href={href}>{label}</NextLink>
    </Link>
  );
}
