import type { threadsTable } from "../../database/schemas/thread";
import type { JwtPayload } from "../../types/jwt";
import BasePolicy from "../base-policy";

export default class ThreadsPolicy extends BasePolicy {
  async canList(accountData?: JwtPayload) {
    return this.can("Thread.List", accountData);
  }

  async canRead(
    thread: typeof threadsTable.$inferSelect,
    accountData?: JwtPayload
  ) {
    const allowed =
      (await this.can(`Thread.${thread.id}.Read`, accountData)) ||
      (await this.can("Thread.&.Read", accountData, thread, "created_by")) ||
      (await this.can("Thread.*.Read", accountData));

    return allowed;
  }

  canCreate(accountData?: JwtPayload) {
    return this.can("Thread.Create", accountData);
  }

  async canUpdate(
    thread: typeof threadsTable.$inferSelect,
    accountData?: JwtPayload
  ) {
    const allowed =
      (await this.can(`Thread.${thread.id}.Update`, accountData)) ||
      (await this.can("Thread.&.Update", accountData, thread, "created_by")) ||
      (await this.can("Thread.*.Update", accountData));

    return allowed;
  }

  async canDelete(
    thread: typeof threadsTable.$inferSelect,
    accountData?: JwtPayload
  ) {
    const allowed =
      (await this.can(`Thread.${thread.id}.Delete`, accountData)) ||
      (await this.can("Thread.&.Delete", accountData, thread, "created_by")) ||
      (await this.can("Thread.*.Delete", accountData));

    return allowed;
  }
}
