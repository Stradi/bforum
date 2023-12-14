"use client";
import type { ApiGroup, ApiPermission } from "@lib/api/api.types";
import { Checkbox, Table, Tooltip } from "@radix-ui/themes";
import { getPermissionDescription, sortPermissions } from "../_helpers/utils";

type Props = {
  groups: ApiGroup[];
};
export default function PermissionMatrix({ groups }: Props) {
  const uniquePermissions = groups
    .reduce<ApiPermission[]>((acc, group) => {
      const permissions = group.groupPermission.map(
        (permission) => permission.permission
      );
      return [...acc, ...permissions];
    }, [])
    .filter(
      (permission, index, self) =>
        self.findIndex((p) => p.id === permission.id) === index
    )
    .sort(sortPermissions);

  return (
    <Table.Root className="table border rounded-lg" size="2">
      <Table.Header>
        <Table.Row className="divide-x font-semibold">
          <Table.Cell>Name</Table.Cell>
          {groups.map((group) => (
            <Table.Cell align="center" key={group.id}>
              {group.name}
            </Table.Cell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {uniquePermissions.map((permission) => (
          <Tooltip
            content={getPermissionDescription(permission)}
            delayDuration={250}
            key={permission.id}
            side="left"
          >
            <Table.Row className="divide-x hover:bg-neutral-100">
              <Table.Cell className="font-semibold !align-middle">
                {permission.name}
              </Table.Cell>
              {groups.map((group) => (
                <Table.Cell align="center" key={group.id}>
                  {group.groupPermission.some(
                    (groupPermission) =>
                      groupPermission.permission_id === permission.id
                  ) ? (
                    <Checkbox checked size="3" />
                  ) : (
                    <Checkbox color="green" size="3" />
                  )}
                </Table.Cell>
              ))}
            </Table.Row>
          </Tooltip>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
