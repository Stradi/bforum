"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import type { ApiGroup } from "@lib/api/api.types";
import { Button } from "@components/ui/button";
import DeleteGroupAlertDialog from "./delete-group-alert-dialog";
import EditGroupDialog from "./edit-group-dialog";

const columns: ColumnDef<ApiGroup>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    id: "account-count",
    header: "Account Count",
    accessorFn: (row) => row.accountGroup.length,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const group = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <DotsHorizontalIcon className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <EditGroupDialog group={group}>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                }}
              >
                Edit
              </DropdownMenuItem>
            </EditGroupDialog>
            <DeleteGroupAlertDialog group={group}>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                }}
              >
                Delete
              </DropdownMenuItem>
            </DeleteGroupAlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default columns;
