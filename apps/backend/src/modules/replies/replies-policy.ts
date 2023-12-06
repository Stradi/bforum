import type { repliesTable } from "../../database/schemas/reply";
import type { JwtPayload } from "../../types/jwt";
import BasePolicy from "../base-policy";

export default class RepliesPolicy extends BasePolicy {
  canListReplies(accountData: JwtPayload | null) {
    return this.isGroupAllowed("Reply.List", accountData);
  }

  async canReadReply(
    accountData: JwtPayload | null,
    reply: typeof repliesTable.$inferSelect
  ) {
    return (
      (await this.isGroupAllowed("Reply.*.Read", accountData)) ||
      reply.created_by === accountData?.id
    );
  }

  canCreateReply(accountData: JwtPayload | null) {
    return this.isGroupAllowed("Reply.Create", accountData);
  }

  async canUpdateReply(
    accountData: JwtPayload | null,
    reply: typeof repliesTable.$inferSelect
  ) {
    return (
      (await this.isGroupAllowed("Reply.*.Update", accountData)) ||
      reply.created_by === accountData?.id
    );
  }

  async canDeleteReply(
    accountData: JwtPayload | null,
    reply: typeof repliesTable.$inferSelect
  ) {
    return (
      (await this.isGroupAllowed("Reply.*.Delete", accountData)) ||
      reply.created_by === accountData?.id
    );
  }
}
