"use client";

import { Dialog } from "@radix-ui/themes";
import { useEffect, type ComponentPropsWithoutRef } from "react";
import useScalingDialog from "./use-scaling-dialog";

type ScalingDialogRootProps = Omit<
  ComponentPropsWithoutRef<typeof Dialog.Root>,
  "onOpenChange"
> & {
  onOpen?: () => void;
  onClose?: () => void;
};
export default function ScalingDialogRoot({
  open,
  onOpen,
  onClose,
  ...props
}: ScalingDialogRootProps) {
  const scalingDialog = useScalingDialog();

  const openClasses = "rounded-lg duration-500".split(" ");
  const closedClasses = "rounded-none duration-300".split(" ");

  useEffect(() => {
    if (open === undefined) return;
    handleOpenChange(open, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- this is intentional
  }, [open]);

  function handleOpenChange(value: boolean, runCallbacks = true) {
    runCallbacks && (value ? onOpen?.() : onClose?.());

    const dialogWrapperElement = document.querySelector(
      "[data-dialog-wrapper]"
    );
    const bodyElement = document.querySelector("body");

    if (!dialogWrapperElement || !bodyElement) return;

    if (value) {
      bodyElement.classList.add(scalingDialog.bodyColor);

      const desiredWidth = bodyElement.clientWidth - scalingDialog.padding;
      const desiredHeight = bodyElement.clientHeight - scalingDialog.padding;
      const scaleX = desiredWidth / bodyElement.clientWidth;
      const scaleY = desiredHeight / bodyElement.clientHeight;

      dialogWrapperElement.setAttribute(
        "style",
        `transform: scaleX(${scaleX}) scaleY(${scaleY});`
      );
      dialogWrapperElement.classList.add(...openClasses);
      dialogWrapperElement.classList.remove(...closedClasses);
    } else {
      dialogWrapperElement.setAttribute("style", "");

      dialogWrapperElement.classList.add(...closedClasses);
      dialogWrapperElement.classList.remove(...openClasses);
      setTimeout(() => {
        bodyElement.classList.remove(scalingDialog.bodyColor);
      }, 300);
    }
  }

  return <Dialog.Root onOpenChange={handleOpenChange} open={open} {...props} />;
}
