"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import type { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import type { ApiAccount, ApiAccountGroup, ApiGroup } from "@lib/api/api.types";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import DeleteAccountAlertDialog from "./delete-account-alert-dialog";
import EditAccountDialog from "./edit-account-dialog";

export default function getColumns(
  groups: ApiGroup[]
): ColumnDef<ApiAccount>[] {
  return [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "display_name",
      header: "Display Name",
    },
    {
      accessorKey: "username",
      header: "Username",
    },
    {
      header: "Created At",
      accessorFn: (row) => new Date(row.created_at).toLocaleString(),
    },
    {
      header: "Groups",
      accessorKey: "accountGroup",
      cell: ({ row }) => {
        // TODO: Assign colors to groups
        const accountGroups: ApiAccountGroup[] = row.getValue("accountGroup");
        return (
          <div className="flex flex-wrap gap-0.5">
            {accountGroups.map((accountGroup) => (
              <Badge key={accountGroup.group_id}>
                {accountGroup.group.name}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const account = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost">
                <DotsHorizontalIcon className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <EditAccountDialog account={account} groups={groups}>
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                  }}
                >
                  Edit
                </DropdownMenuItem>
              </EditAccountDialog>
              <DeleteAccountAlertDialog account={account}>
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                  }}
                >
                  Delete
                </DropdownMenuItem>
              </DeleteAccountAlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
