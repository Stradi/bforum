"use client";

import Link from "next/link";
import { Button } from "@components/ui/button";

type Props = {
  label: string;
  href: string;
};
export default function UserPopoverLink({ label, href }: Props) {
  return (
    <Button
      asChild
      className="justify-start hover:bg-neutral-100 hover:no-underline font-normal"
      variant="link"
    >
      <Link href={href}>{label}</Link>
    </Button>
  );
}
