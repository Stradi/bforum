"use client";

import { Button, Dialog } from "@radix-ui/themes";
import { XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, type PropsWithChildren } from "react";

// This duration is the same as the CSS transition duration
// See https://github.com/radix-ui/themes/blob/main/packages/radix-ui-themes/src/components/dialog.css
const ExitAnimationDuration = 150;

type Props = PropsWithChildren & {
  title?: string;
  depth?: number;
};

export default function InterceptorModal({ children, title, depth }: Props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // This is a hack I'm proud of, lol. It basically allows us to go back
  // to the first page that opened the modal, instead of going back to the
  // page that opened the modal that opened the modal, etc.
  const backSteps = new Array(depth ? depth - 1 : 1).fill(null);

  // This is another hack I'm proud of, lol. It basically allows us to
  // delay the opening of the modal until the next tick, so when depth is
  // too high, we don't see the modal open and close immediately (flicker).
  useEffect(() => {
    setTimeout(() => {
      setOpen(true);
    }, 0);
  }, []);

  return (
    <Dialog.Root
      onOpenChange={(value) => {
        setOpen(value);
        if (value) return;

        setTimeout(() => {
          // eslint-disable-next-line @typescript-eslint/unbound-method -- this is way more elegant looking code, cmon.
          backSteps.forEach(router.back);
        }, ExitAnimationDuration);
      }}
      open={open}
    >
      <Dialog.Content className="!max-w-[450px]">
        <div className="flex justify-between items-center w-full mb-4">
          {title ? <Dialog.Title mb="0">{title}</Dialog.Title> : null}
          <Dialog.Close>
            <Button className="!py-1.5 !px-1.5" variant="ghost">
              <XIcon height={22} strokeWidth={1.5} width={22} />
            </Button>
          </Dialog.Close>
        </div>
        {children}
      </Dialog.Content>
    </Dialog.Root>
  );
}
