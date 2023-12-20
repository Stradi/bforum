import type { ApiPermission } from "@lib/api/api.types";

export function sortPermissions(a: ApiPermission, b: ApiPermission) {
  const SortOrder = [
    "General",
    "Node",
    "Thread",
    "Reply",
    "Account",
    "Group",
    "Permission",
  ];
  const compareValues = (valueA: string, valueB: string) =>
    SortOrder.indexOf(valueA) - SortOrder.indexOf(valueB);

  const {
    resource: resourceA,
    scope: scopeA,
    action: actionA,
  } = parsePermissionName(a.name);
  const {
    resource: resourceB,
    scope: scopeB,
    action: actionB,
  } = parsePermissionName(b.name);

  return (
    compareValues(resourceA, resourceB) ||
    (scopeA && scopeB && compareValues(scopeA, scopeB)) ||
    compareValues(actionA, actionB)
  );
}

export function getPermissionDescription(permission: ApiPermission) {
  const { resource, scope, action } = parsePermissionName(permission.name);

  let description = `Can ${action.toLowerCase()}`;
  if (scope) {
    if (scope === "*") {
      description += ` all`;
    } else if (scope === "&") {
      description += ` own`;
    } else {
      description += ` with id of ${scope}`;
    }
  }

  description += ` ${resource.toLowerCase()}s`;
  return description;
}

function parsePermissionName(permissionName: string) {
  const arr = permissionName.split(".");
  if (arr.length !== 2 && arr.length !== 3) {
    throw new Error("Invalid permission name");
  }

  if (arr.length === 2) {
    return {
      resource: arr[0],
      action: arr[1],
    };
  }

  return {
    resource: arr[0],
    scope: arr[1],
    action: arr[2],
  };
}
