"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type PropsWithChildren } from "react";
import ScalingDialogRoot from "./scaling-dialog";
import { DialogContent, DialogTitle } from "./ui/dialog";

const ExitAnimationDuration = 150;

type Props = PropsWithChildren & {
  title?: string;
  depth?: number;
};

export default function InterceptorModal({ children, title, depth }: Props) {
  const [open, setOpen] = useState<boolean | undefined>(undefined);
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
    <ScalingDialogRoot
      onClose={() => {
        setTimeout(() => {
          // eslint-disable-next-line @typescript-eslint/unbound-method -- this is way more elegant looking code, cmon.
          backSteps.forEach(router.back);
        }, ExitAnimationDuration);
      }}
      open={open}
    >
      <DialogContent className="w-[450px]">
        {title ? <DialogTitle>{title}</DialogTitle> : null}
        {children}
      </DialogContent>
    </ScalingDialogRoot>
  );
}
