import type { repliesTable } from "../../database/schemas/reply";
import type { JwtPayload } from "../../types/jwt";
import BasePolicy from "../base-policy";

export default class RepliesPolicy extends BasePolicy {
  canList(accountData?: JwtPayload) {
    return this.can("Reply.List", accountData);
  }

  async canRead(
    reply: typeof repliesTable.$inferSelect,
    accountData?: JwtPayload
  ) {
    const allowed =
      (await this.can(`Reply.${reply.id}.Read`, accountData)) ||
      (await this.can("Reply.&.Read", accountData, reply, "created_by")) ||
      (await this.can("Reply.*.Read", accountData));

    return allowed;
  }

  canCreate(accountData?: JwtPayload) {
    return this.can("Reply.Create", accountData);
  }

  async canUpdate(
    reply: typeof repliesTable.$inferSelect,
    accountData?: JwtPayload
  ) {
    const allowed =
      (await this.can(`Reply.${reply.id}.Update`, accountData)) ||
      (await this.can("Reply.&.Update", accountData, reply, "created_by")) ||
      (await this.can("Reply.*.Update", accountData));

    return allowed;
  }

  async canDelete(
    reply: typeof repliesTable.$inferSelect,
    accountData?: JwtPayload
  ) {
    const allowed =
      (await this.can(`Reply.${reply.id}.Delete`, accountData)) ||
      (await this.can("Reply.&.Delete", accountData, reply, "created_by")) ||
      (await this.can("Reply.*.Delete", accountData));

    return allowed;
  }
}
