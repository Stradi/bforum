import type { threadsTable } from "../../database/schemas/thread";
import type { JwtPayload } from "../../types/jwt";
import BasePolicy from "../base-policy";

export default class ThreadsPolicy extends BasePolicy {
  canListThreads(accountData: JwtPayload | null) {
    return this.isGroupAllowed("Thread.List", accountData);
  }

  async canReadThread(
    accountData: JwtPayload | null,
    thread: typeof threadsTable.$inferSelect
  ) {
    return (
      (await this.isGroupAllowed("Thread.*.Read", accountData)) ||
      thread.created_by === accountData?.id
    );
  }

  canCreateThread(accountData: JwtPayload | null) {
    return this.isGroupAllowed("Thread.Create", accountData);
  }

  async canUpdateThread(
    accountData: JwtPayload | null,
    thread: typeof threadsTable.$inferSelect
  ) {
    return (
      (await this.isGroupAllowed("Thread.*.Update", accountData)) ||
      thread.created_by === accountData?.id
    );
  }

  async canDeleteThread(
    accountData: JwtPayload | null,
    thread: typeof threadsTable.$inferSelect
  ) {
    return (
      (await this.isGroupAllowed("Thread.*.Delete", accountData)) ||
      thread.created_by === accountData?.id
    );
  }
}
