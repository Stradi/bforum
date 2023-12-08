"use client";

import { Dialog } from "@radix-ui/themes";
import { useRouter } from "next/navigation";

// This duration is the same as the CSS transition duration
// See https://github.com/radix-ui/themes/blob/main/packages/radix-ui-themes/src/components/dialog.css
const ExitAnimationDuration = 150;

export default function Page() {
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
      <Dialog.Content>
        <div>This is the Register Page in a Dialog</div>
      </Dialog.Content>
    </Dialog.Root>
  );
}
