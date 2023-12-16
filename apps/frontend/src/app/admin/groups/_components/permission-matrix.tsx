"use client";

import type { ApiGroup, ApiPermission } from "@lib/api/api.types";
import { Button, Checkbox, Table } from "@radix-ui/themes";
import { cn } from "@utils/tw";
import { SaveIcon, TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useGroupsApi from "../_helpers/use-groups-api";
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
      <div className="pb-1 flex items-center">
        <div className="space-x-1">
          <Button
            color="red"
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
          >
            <TrashIcon className="w-3 h-3" />
            Discard Changes
          </Button>
          <Button
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
            <SaveIcon className="w-3 h-3" /> Save
          </Button>
        </div>
      </div>
      <Table.Root className="border rounded-lg w-fit" size="2">
        <Table.Header>
          <Table.Row className="divide-x font-semibold">
            <Table.RowHeaderCell className="text-right !font-semibold">
              <sup>Permission</sup>&frasl;<sub>Group</sub>
            </Table.RowHeaderCell>
            {groups.map((group) => (
              <Table.Cell align="center" key={group.id}>
                {group.name}
              </Table.Cell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {sortedPermissions.map((permission) => (
            <Table.Row className="divide-x !text-right" key={permission.id}>
              <Table.RowHeaderCell className="font-mono !font-semibold !align-middle">
                {permission.name}
              </Table.RowHeaderCell>
              {groups.map((group) => (
                <Table.Cell
                  align="center"
                  className={cn(
                    isPermissionUpdated(permission.id, group.id) &&
                      "!bg-blue-100"
                  )}
                  key={group.id}
                >
                  <Checkbox
                    // defaultChecked={group.groupPermission.some(
                    //   (groupPermission) =>
                    //     groupPermission.permission_id === permission.id
                    // )}
                    // onCheckedChange={(checked) => {
                    //   onCheckboxChange(
                    //     permission.id,
                    //     group.id,
                    //     checked as boolean
                    //   );
                    // }}
                    checked={checkboxState.get(`${permission.id}-${group.id}`)}
                    onCheckedChange={(checked) => {
                      onCheckboxChange(
                        permission.id,
                        group.id,
                        checked as boolean
                      );
                    }}
                    size="3"
                  />
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
}
