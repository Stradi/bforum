"use client";

import { Dialog } from "@radix-ui/themes";
import { useEffect, useState, type ComponentPropsWithoutRef } from "react";

type ScalingDialogRootProps = ComponentPropsWithoutRef<typeof Dialog.Root>;
export default function ScalingDialogRoot({
  open,
  onOpenChange,
  ...props
}: ScalingDialogRootProps) {
  const [isOpen, setIsOpen] = useState(open ?? false);

  const openClasses = "rounded-lg w-screen h-screen scale-[.995]".split(" ");
  const closedClasses = "scale-100 rounded-none".split(" ");

  useEffect(() => {
    setIsOpen(open ?? false);
  }, [open]);

  useEffect(() => {
    const dialogWrapperElement = document.querySelector(
      "[data-dialog-wrapper]"
    );

    if (!dialogWrapperElement) return;

    if (isOpen) {
      dialogWrapperElement.classList.add(...openClasses);
      dialogWrapperElement.classList.remove(...closedClasses);
    } else {
      dialogWrapperElement.classList.add(...closedClasses);
      dialogWrapperElement.classList.remove(...openClasses);
    }
  }, [isOpen, openClasses, closedClasses]);

  function handleOpenChange(value: boolean) {
    setIsOpen(value);
    onOpenChange?.(value);
  }

  return (
    <Dialog.Root onOpenChange={handleOpenChange} open={isOpen} {...props} />
  );
}
