"use client";

import { AlertDialog, Button } from "@radix-ui/themes";

type Props = {
  onDeleteGroup: () => void;
};
export default function DeleteGroupAlertDialog({ onDeleteGroup }: Props) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <Button color="red">Delete</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content className="!max-w-[500px]">
        <AlertDialog.Title size="4">Delete Group</AlertDialog.Title>
        <AlertDialog.Description mt="-2" size="2">
          Are you sure you want to delete this group?
        </AlertDialog.Description>
        <div className="flex justify-end mt-4 gap-1">
          <AlertDialog.Cancel>
            <Button color="gray" variant="soft">
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action onClick={onDeleteGroup}>
            <Button color="red">Delete this Group</Button>
          </AlertDialog.Action>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}
