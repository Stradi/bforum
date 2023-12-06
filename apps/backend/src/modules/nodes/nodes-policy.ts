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
  async canListNodes(accountData: JwtPayload | null) {
    return this.isGroupAllowed("Node.List", accountData);
  }

  /**
   * Checks if user can read the specified node. If accountData is null, then it checks
   * if anonymous users can read the specified node.
   *
   * Checks the following permissions:
   * - Node.*.Read - Can read all the nodes available
   * - Node.&.Read - Can read only nodes that user has created
   *
   * \@todo: Implement `Node.${nodeSlug}.Read` permission after implementing
   * account level permissions.
   */
  async canReadNode(
    accountData: JwtPayload | null,
    node: typeof nodesTable.$inferSelect
  ) {
    return (
      (await this.isGroupAllowed("Node.*.Read", accountData)) ||
      node.created_by === accountData?.id
    );
  }

  /**
   * Checks if user can create a node. If accountData is null, then it checks
   * if anonymous users can create a node.
   *
   * Checks the following permissions:
   * - Node.Create - Can create a node
   */
  async canCreateNode(accountData: JwtPayload | null) {
    return this.isGroupAllowed("Node.Create", accountData);
  }

  /**
   * Checks if user can update the specified node. If accountData is null, then it checks
   * if anonymous users can update the specified node.
   *
   * Checks the following permissions:
   * - Node.*.Update - Can update all the nodes available
   * - Node.&.Update - Can update only nodes that user has created
   *
   * \@todo: Implement `Node.${nodeSlug}.Update` permission after implementing
   * account level permissions.
   */
  async canUpdateNode(
    accountData: JwtPayload | null,
    node: typeof nodesTable.$inferSelect
  ) {
    return (
      (await this.isGroupAllowed("Node.*.Update", accountData)) ||
      node.created_by === accountData?.id
    );
  }

  /**
   * Checks if user can delete the specified node. If accountData is null, then it checks
   * if anonymous users can delete the specified node.
   *
   * Checks the following permissions:
   * - Node.*.Delete - Can delete all the nodes available
   * - Node.&.Delete - Can delete only nodes that user has created
   *
   * \@todo: Implement `Node.${nodeSlug}.Delete` permission after implementing
   * account level permissions.
   */
  async canDeleteNode(
    accountData: JwtPayload | null,
    node: typeof nodesTable.$inferSelect
  ) {
    return (
      (await this.isGroupAllowed("Node.*.Delete", accountData)) ||
      node.created_by === accountData?.id
    );
  }
}
