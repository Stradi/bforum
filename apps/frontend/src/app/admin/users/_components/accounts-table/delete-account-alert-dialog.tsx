"use client";

import { useState, type PropsWithChildren, startTransition } from "react";
import { toast } from "sonner";
import ScalingAlertDialogRoot from "@components/scaling-dialog/scaling-alert-dialog";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@components/ui/alert-dialog";
import type { ApiAccount } from "@lib/api/api.types";
import useAccountsApi from "@lib/api/accounts/use-accounts-api";

type Props = PropsWithChildren & {
  account: ApiAccount;
};
export default function DeleteAccountAlertDialog({ children, account }: Props) {
  const api = useAccountsApi();
  const [open, setOpen] = useState(false);

  function onDelete() {
    // @ts-expect-error -- react@beta supports async functions in startTransition
    startTransition(async () => {
      const obj = await api.deleteAccount(account.id);
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
        <AlertDialogTitle>Delete Account</AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to delete this account?
        </AlertDialogDescription>
        <div className="mt-4 flex justify-end gap-1">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>
            Delete this Account
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </ScalingAlertDialogRoot>
  );
}
