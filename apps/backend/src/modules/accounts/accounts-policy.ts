import type { accountsTable } from "../../database/schemas/account";
import type { JwtPayload } from "../../types/jwt";
import BasePolicy from "../base-policy";

export default class AccountsPolicy extends BasePolicy {
  async canList(accountData?: JwtPayload) {
    return this.can("Account.List", accountData);
  }

  async canRead(
    account: typeof accountsTable.$inferSelect,
    accountData?: JwtPayload
  ) {
    const allowed =
      (await this.can(`Account.${account.id}.Read`, accountData)) ||
      (await this.can("Account.*.Read", accountData));

    return allowed;
  }

  async canUpdate(
    account: typeof accountsTable.$inferSelect,
    accountData?: JwtPayload
  ) {
    const allowed =
      (await this.can(`Account.${account.id}.Update`, accountData)) ||
      (await this.can("Account.*.Update", accountData));

    return allowed;
  }

  async canDelete(
    account: typeof accountsTable.$inferSelect,
    accountData?: JwtPayload
  ) {
    const allowed =
      (await this.can(`Account.${account.id}.Delete`, accountData)) ||
      (await this.can("Account.*.Delete", accountData));

    return allowed;
  }
}
