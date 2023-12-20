"use client";

import { useEffect, type ComponentPropsWithoutRef } from "react";
import type { Dialog } from "@components/ui/dialog";
import { AlertDialog } from "@components/ui/alert-dialog";
import useScalingDialog from "./use-scaling-dialog";

type ScalingAlertDialogRootProps = Omit<
  ComponentPropsWithoutRef<typeof Dialog>,
  "onOpenChange"
> & {
  onOpen?: () => void;
  onClose?: () => void;
};
export default function ScalingAlertDialogRoot({
  open,
  onOpen,
  onClose,
  ...props
}: ScalingAlertDialogRootProps) {
  const scalingDialog = useScalingDialog();

  const openClasses = "rounded-lg duration-300".split(" ");
  const closedClasses = "rounded-none duration-200".split(" ");

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

  return <AlertDialog onOpenChange={handleOpenChange} open={open} {...props} />;
}
