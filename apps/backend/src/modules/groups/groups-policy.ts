import type { groupsTable } from "../../database/schemas/group";
import type { JwtPayload } from "../../types/jwt";
import BasePolicy from "../base-policy";

export default class GroupsPolicy extends BasePolicy {
  async canList(accountData?: JwtPayload) {
    return this.can("Group.List", accountData);
  }

  async canRead(
    group: typeof groupsTable.$inferInsert,
    accountData?: JwtPayload
  ) {
    const allowed =
      (await this.can(`Group.${group.id}.Read`, accountData)) ||
      (await this.can("Group.*.Read", accountData));

    return allowed;
  }

  async canCreate(accountData?: JwtPayload) {
    return this.can("Group.Create", accountData);
  }

  async canUpdate(
    group: typeof groupsTable.$inferInsert,
    accountData?: JwtPayload
  ) {
    const allowed =
      (await this.can(`Group.${group.id}.Update`, accountData)) ||
      (await this.can("Group.*.Update", accountData));

    return allowed;
  }

  async canDelete(
    group: typeof groupsTable.$inferInsert,
    accountData?: JwtPayload
  ) {
    const allowed =
      (await this.can(`Group.${group.id}.Delete`, accountData)) ||
      (await this.can("Group.*.Delete", accountData));

    return allowed;
  }
}
