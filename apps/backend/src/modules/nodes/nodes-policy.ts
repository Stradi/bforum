import type { nodesTable } from "../../database/schemas/node";
import type { JwtPayload } from "../../types/jwt";
import BasePolicy from "../base-policy";

export default class NodesPolicy extends BasePolicy {
  /**
   * Checks if user can list nodes. If accountData is null, then it checks
   * if anonymous users can list nodes.
   *
   * Checks the following permissions:
   * - Node.List - Can list all the nodes available
   */
  async canList(accountData?: JwtPayload) {
    return this.can("Node.List", accountData);
  }

  /**
   * Checks if user can read the specified node. If accountData is null, then it checks
   * if anonymous users can read the specified node.
   *
   * Checks the following permissions:
   * - Node.*.Read  - Can read all the nodes available
   * - Node.&.Read  - Can read only nodes that user has created
   * - Node.ID.Read - Can read the specified node
   */
  async canRead(
    node: typeof nodesTable.$inferSelect,
    accountData?: JwtPayload
  ) {
    const allowed =
      (await this.can(`Node.${node.id}.Read`, accountData)) ||
      (await this.can("Node.&.Read", accountData, node, "created_by")) ||
      (await this.can("Node.*.Read", accountData));

    return allowed;
  }

  /**
   * Checks if user can create a node. If accountData is null, then it checks
   * if anonymous users can create a node.
   *
   * Checks the following permissions:
   * - Node.Create - Can create a node
   */
  async canCreate(accountData?: JwtPayload) {
    return this.can("Node.Create", accountData);
  }

  /**
   * Checks if user can update the specified node. If accountData is null, then it checks
   * if anonymous users can update the specified node.
   *
   * Checks the following permissions:
   * - Node.*.Update  - Can update all the nodes available
   * - Node.&.Update  - Can update only nodes that user has created
   * - Node.ID.Update - Can update the specified node
   */
  async canUpdate(
    node: typeof nodesTable.$inferSelect,
    accountData?: JwtPayload
  ) {
    const allowed =
      (await this.can(`Node.${node.id}.Update`, accountData)) ||
      (await this.can("Node.&.Update", accountData, node, "created_by")) ||
      (await this.can("Node.*.Update", accountData));

    return allowed;
  }

  /**
   * Checks if user can delete the specified node. If accountData is null, then it checks
   * if anonymous users can delete the specified node.
   *
   * Checks the following permissions:
   * - Node.*.Delete  - Can delete all the nodes available
   * - Node.&.Delete  - Can delete only nodes that user has created
   * - Node.ID.Delete - Can delete the specified node
   */
  async canDelete(
    node: typeof nodesTable.$inferSelect,
    accountData?: JwtPayload
  ) {
    const allowed =
      (await this.can(`Node.${node.id}.Delete`, accountData)) ||
      (await this.can("Node.&.Delete", accountData, node, "created_by")) ||
      (await this.can("Node.*.Delete", accountData));

    return allowed;
  }
}
