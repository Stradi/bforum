"use client";

import { AlertDialog, Button } from "@radix-ui/themes";

type Props = {
  onDeleteNode: () => void;
};
export default function DeleteNodeAlertDialog({ onDeleteNode }: Props) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <Button color="red">Delete</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content className="!max-w-[500px]">
        <AlertDialog.Title>Delete Node</AlertDialog.Title>
        <AlertDialog.Description>
          Are you sure you want to delete this node?
        </AlertDialog.Description>
        <div className="flex justify-end mt-4 gap-1">
          <AlertDialog.Cancel>
            <Button color="gray" variant="soft">
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action onClick={onDeleteNode}>
            <Button color="red">Delete this Node</Button>
          </AlertDialog.Action>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}
