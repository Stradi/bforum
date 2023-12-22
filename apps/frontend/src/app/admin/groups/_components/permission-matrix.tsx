"use client";

import { SaveIcon, TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { cn } from "@utils/tw";
import type { ApiGroup, ApiPermission } from "@lib/api/api.types";
import { Button } from "@components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import { Checkbox } from "@components/ui/checkbox";
import useGroupsApi from "@lib/api/groups/use-groups-api";
import { sortPermissions } from "../_helpers/utils";

type Props = {
  groups: ApiGroup[];
  permissions: ApiPermission[];
};

// TODO: This is a mess, clean it up
export default function PermissionMatrix({ groups, permissions }: Props) {
  const api = useGroupsApi();

  const [checkboxState, setCheckboxState] = useState(() => {
    const state = new Map<string, boolean>();
    permissions.forEach((permission) => {
      groups.forEach((group) => {
        state.set(
          `${permission.id}-${group.id}`,
          isPermissionAllowed(permission.id, group.id)
        );
      });
    });
    return state;
  });

  const [updatedPermissions, setUpdatedPermissions] = useState<
    {
      permissionId: number;
      groupId: number;
      allowed: boolean;
    }[]
  >([]);

  const hasChanges = updatedPermissions.length > 0;

  useEffect(() => {
    setUpdatedPermissions([]);
  }, [groups]);

  function isPermissionAllowed(permissionId: number, groupId: number) {
    return (
      groups
        .find((group) => group.id === groupId)
        ?.groupPermission.find(
          (groupPermission) =>
            groupPermission.permission_id === permissionId &&
            groupPermission.group_id === groupId
        ) !== undefined
    );
  }

  function isPermissionUpdated(permissionId: number, groupId: number) {
    return (
      updatedPermissions.find(
        (permission) =>
          permission.permissionId === permissionId &&
          permission.groupId === groupId
      ) !== undefined
    );
  }

  function onCheckboxChange(
    permissionId: number,
    groupId: number,
    checked: boolean
  ) {
    setCheckboxState((state) => {
      const newState = new Map(state);
      newState.set(`${permissionId}-${groupId}`, checked);
      return newState;
    });

    const existingPermission = updatedPermissions.find(
      (permission) =>
        permission.permissionId === permissionId &&
        permission.groupId === groupId
    );

    if (!existingPermission) {
      setUpdatedPermissions([
        ...updatedPermissions,
        {
          permissionId,
          groupId,
          allowed: checked,
        },
      ]);

      return;
    }

    // If the new state is the same as the existing state, remove it from the list
    const serverState = isPermissionAllowed(permissionId, groupId);
    if (checked === serverState) {
      setUpdatedPermissions(
        updatedPermissions.filter(
          (permission) =>
            !(
              permission.permissionId === permissionId &&
              permission.groupId === groupId
            )
        )
      );
    } else {
      setUpdatedPermissions([
        ...updatedPermissions,
        {
          permissionId,
          groupId,
          allowed: checked,
        },
      ]);
    }
  }

  const sortedPermissions = permissions.sort(sortPermissions);

  return (
    <div>
      <div className="flex items-center pb-1">
        <div className="space-x-1">
          <Button
            className="gap-1"
            disabled={!hasChanges}
            onClick={() => {
              setUpdatedPermissions([]);
              setCheckboxState(() => {
                const state = new Map<string, boolean>();
                permissions.forEach((permission) => {
                  groups.forEach((group) => {
                    state.set(
                      `${permission.id}-${group.id}`,
                      isPermissionAllowed(permission.id, group.id)
                    );
                  });
                });
                return state;
              });
            }}
            variant="ghost"
          >
            <TrashIcon className="size-4" />
            Discard Changes
          </Button>
          <Button
            className="gap-1"
            disabled={!hasChanges}
            // eslint-disable-next-line @typescript-eslint/no-misused-promises -- I don't know why this happens
            onClick={async () => {
              const response = await api.updateGroupPermissions(
                updatedPermissions
              );
              if (response.success) {
                toast.success(response.data.message);
              } else {
                toast.error(response.error.message);
              }
            }}
          >
            <SaveIcon className="size-4" /> Save
          </Button>
        </div>
      </div>
      <div className="w-fit rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="divide-x">
              <TableHead>
                <sup>Permission</sup>&frasl;<sub>Group</sub>
              </TableHead>
              {groups.map((group) => (
                <TableHead align="center" key={group.id}>
                  {group.name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedPermissions.map((permission) => (
              <TableRow className="divide-x" key={permission.id}>
                <TableCell>{permission.name}</TableCell>
                {groups.map((group) => (
                  <TableCell
                    align="center"
                    className={cn(
                      isPermissionUpdated(permission.id, group.id) &&
                        "bg-neutral-200"
                    )}
                    key={group.id}
                  >
                    <Checkbox
                      checked={checkboxState.get(
                        `${permission.id}-${group.id}`
                      )}
                      onCheckedChange={(checked) => {
                        onCheckboxChange(
                          permission.id,
                          group.id,
                          checked as boolean
                        );
                      }}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
