"use client";

import { startTransition, type PropsWithChildren, useState } from "react";
import { toast } from "sonner";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@components/ui/alert-dialog";
import type { ApiGroup } from "@lib/api/api.types";
import ScalingAlertDialogRoot from "@components/scaling-dialog/scaling-alert-dialog";
import useGroupsApi from "../../_helpers/use-groups-api";

type Props = PropsWithChildren & {
  group: ApiGroup;
};
export default function DeleteGroupAlertDialog({ children, group }: Props) {
  const api = useGroupsApi();
  const [open, setOpen] = useState(false);

  function onDelete() {
    // @ts-expect-error -- react@beta supports async functions in startTransition
    startTransition(async () => {
      const obj = await api.deleteGroup(group.id);
      if (!obj.success) {
        toast.error(obj.error.message);
        setOpen(false);
        return;
      }

      toast.success(obj.data.message);
      setOpen(false);
    });
  }

  return (
    <ScalingAlertDialogRoot
      onClose={() => {
        setOpen(false);
      }}
      onOpen={() => {
        setOpen(true);
      }}
      open={open}
    >
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="!max-w-[500px]">
        <AlertDialogTitle>Delete Group</AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to delete this group?
        </AlertDialogDescription>
        <div className="flex justify-end mt-4 gap-1">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>
            Delete this Group
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </ScalingAlertDialogRoot>
  );
}
