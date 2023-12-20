"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@components/ui/alert-dialog";
import { Button } from "@components/ui/button";

type Props = {
  onDeleteNode: () => void;
};
export default function DeleteNodeAlertDialog({ onDeleteNode }: Props) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="!max-w-[500px]">
        <AlertDialogTitle>Delete Node</AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to delete this node?
        </AlertDialogDescription>
        <div className="flex justify-end mt-4 gap-1">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDeleteNode}>
            Delete this Node
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
