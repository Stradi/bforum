import type { permissionsTable } from "../../database/schemas/permission";
import type { JwtPayload } from "../../types/jwt";
import BasePolicy from "../base-policy";

export default class PermissionsPolicy extends BasePolicy {
  async canList(accountData?: JwtPayload) {
    return this.can("Permission.List", accountData);
  }

  async canRead(
    permission: typeof permissionsTable.$inferSelect,
    accountData?: JwtPayload
  ) {
    const allowed =
      (await this.can(`Permission.${permission.id}.Read`, accountData)) ||
      (await this.can("Permission.*.Read", accountData));

    return allowed;
  }

  async canCreate(accountData?: JwtPayload) {
    return this.can("Permission.Create", accountData);
  }

  async canUpdate(
    permission: typeof permissionsTable.$inferInsert,
    accountData?: JwtPayload
  ) {
    const allowed =
      (await this.can(`Permission.${permission.id}.Update`, accountData)) ||
      (await this.can("Permission.*.Update", accountData));

    return allowed;
  }

  async canDelete(
    permission: typeof permissionsTable.$inferInsert,
    accountData?: JwtPayload
  ) {
    const allowed =
      (await this.can(`Permission.${permission.id}.Delete`, accountData)) ||
      (await this.can("Permission.*.Delete", accountData));

    return allowed;
  }
}
