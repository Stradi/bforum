"use client";

import { Dialog } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import type { PropsWithChildren } from "react";

// This duration is the same as the CSS transition duration
// See https://github.com/radix-ui/themes/blob/main/packages/radix-ui-themes/src/components/dialog.css
const ExitAnimationDuration = 150;

type Props = PropsWithChildren & {
  title?: string;
};
export default function InterceptorModal({ children, title }: Props) {
  const router = useRouter();

  return (
    <Dialog.Root
      defaultOpen
      onOpenChange={(open) => {
        setTimeout(() => {
          !open && router.back();
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
