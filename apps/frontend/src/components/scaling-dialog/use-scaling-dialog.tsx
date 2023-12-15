"use client";

import { useContext } from "react";
import { ScalingDialogContext } from "./scaling-dialog-provider";

export default function useScalingDialog() {
  const scalingDialog = useContext(ScalingDialogContext);
  return scalingDialog;
}
