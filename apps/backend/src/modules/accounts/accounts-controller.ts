import type { Hono } from "hono";
import authMiddleware from "../../middlewares/auth-middleware";
import { tryParseInt } from "../../utils/text";
import type { Handler } from "../base-controller";
import BaseController from "../base-controller";
import AccountsPolicy from "./accounts-policy";
import AccountsService from "./accounts-service";
import type {
  TGetAllAccountsQuerySchema,
  TGetSingleAccountQuerySchema,
  TUpdateAccountBodySchema,
} from "./dto";
import {
  GetAllAccountsQuerySchema,
  GetSingleAccountQuerySchema,
  UpdateAccountBodySchema,
} from "./dto";

export class AccountsController extends BaseController {
  private accountsService = new AccountsService();
  private accountsPolicy = new AccountsPolicy();

  public router(): Hono {
    return this._app
      .get("/accounts", authMiddleware(), this.getAllAccounts)
      .get("/accounts/:id", authMiddleware(), this.getSingleAccount)
      .patch("/accounts/:id", authMiddleware(), this.updateAccount)
      .delete("/accounts/:id", authMiddleware(), this.deleteAccount);
  }

  getAllAccounts: Handler<"/accounts"> = async (ctx) => {
    await this.checkPolicy(
      this.accountsPolicy,
      "canList",
      ctx.get("jwtPayload")
    );

    const query = this.validateQuery<TGetAllAccountsQuerySchema>(
      ctx,
      GetAllAccountsQuerySchema
    );

    const accounts = await this.accountsService.getAllAccounts(query);

    return this.ok(ctx, {
      message: `Successfully retrieved ${accounts.length} accounts`,
      payload: accounts,
    });
  };

  getSingleAccount: Handler<"/accounts/:id"> = async (ctx) => {
    const accountId = tryParseInt(ctx.req.param("id"));
    if (!accountId) {
      return this.badRequest(ctx, {
        code: "INVALID_ACCOUNT_ID",
        message: "Supplied account id is invalid.",
        action: "Try again with a different account id.",
      });
    }

    const query = this.validateQuery<TGetSingleAccountQuerySchema>(
      ctx,
      GetSingleAccountQuerySchema
    );

    const account = await this.accountsService.getSingleAccount(
      accountId,
      query
    );

    if (!account) {
      return this.notFound(ctx, {
        code: "ACCOUNT_NOT_FOUND",
        message: "The requested account was not found.",
        action: "Try again with a different account id.",
      });
    }

    await this.checkPolicy(
      this.accountsPolicy,
      "canRead",
      account,
      ctx.get("jwtPayload")
    );

    return this.ok(ctx, {
      message: `Successfully retrieved account with id '${accountId}'`,
      payload: account,
    });
  };

  updateAccount: Handler<"/accounts/:id"> = async (ctx) => {
    const accountId = tryParseInt(ctx.req.param("id"));
    if (!accountId) {
      return this.badRequest(ctx, {
        code: "INVALID_ACCOUNT_ID",
        message: "Supplied account id is invalid.",
        action: "Try again with a different account id.",
      });
    }

    const body = await this.validateBody<TUpdateAccountBodySchema>(
      ctx,
      UpdateAccountBodySchema
    );

    const account = await this.accountsService.getSingleAccount(accountId, {});
    if (!account) {
      return this.notFound(ctx, {
        code: "ACCOUNT_NOT_FOUND",
        message: "The requested account was not found.",
        action: "Try again with a different account id.",
      });
    }

    await this.checkPolicy(
      this.accountsPolicy,
      "canUpdate",
      account,
      ctx.get("jwtPayload")
    );

    body.groups &&
      (await this.checkPolicy(
        this.accountsPolicy,
        "canUpdateGroups",
        account,
        ctx.get("jwtPayload")
      ));

    const updatedAccount = await this.accountsService.updateAccount(
      accountId,
      body
    );

    return this.ok(ctx, {
      message: `Successfully updated account with id '${accountId}'.`,
      payload: updatedAccount,
    });
  };

  deleteAccount: Handler<"/accounts/:id"> = async (ctx) => {
    const accountId = tryParseInt(ctx.req.param("id"));
    if (!accountId) {
      return this.badRequest(ctx, {
        code: "INVALID_ACCOUNT_ID",
        message: "Supplied account id is invalid.",
        action: "Try again with a different account id.",
      });
    }

    const account = await this.accountsService.getSingleAccount(accountId, {});

    if (!account) {
      return this.notFound(ctx, {
        code: "ACCOUNT_NOT_FOUND",
        message: "The requested account was not found.",
        action: "Try again with a different account id.",
      });
    }

    await this.checkPolicy(
      this.accountsPolicy,
      "canDelete",
      account,
      ctx.get("jwtPayload")
    );

    const deletedAccount = await this.accountsService.deleteAccount(accountId);

    return this.ok(ctx, {
      message: `Successfully deleted account with id '${accountId}'.`,
      payload: deletedAccount,
    });
  };
}
