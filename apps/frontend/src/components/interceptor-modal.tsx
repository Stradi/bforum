"use client";

import { Dialog } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import type { PropsWithChildren } from "react";

// This duration is the same as the CSS transition duration
// See https://github.com/radix-ui/themes/blob/main/packages/radix-ui-themes/src/components/dialog.css
const ExitAnimationDuration = 150;

type Props = PropsWithChildren & {
  title?: string;
  depth?: number;
};

export default function InterceptorModal({ children, title, depth }: Props) {
  const router = useRouter();

  // This is a hack I'm proud of, lol. It basically allows us to go back
  // to the first page that opened the modal, instead of going back to the
  // page that opened the modal that opened the modal, etc.
  const backSteps = new Array(depth ? depth - 1 : 1).fill(null);

  return (
    <Dialog.Root
      defaultOpen
      onOpenChange={(open) => {
        if (open) return;

        setTimeout(() => {
          // eslint-disable-next-line @typescript-eslint/unbound-method -- this is way more elegant looking code, cmon.
          backSteps.forEach(router.back);
        }, ExitAnimationDuration);
      }}
    >
      <Dialog.Content className="!max-w-[450px]">
        {title ? <Dialog.Title>{title}</Dialog.Title> : null}
        {children}
      </Dialog.Content>
    </Dialog.Root>
  );
}
