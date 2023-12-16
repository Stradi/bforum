import { eq } from "drizzle-orm";
import { getDatabase } from "../../database";
import { accountsTable } from "../../database/schemas/account";
import type {
  TGetAllAccountsQuerySchema,
  TGetSingleAccountQuerySchema,
  TUpdateAccountBodySchema,
} from "./dto";

export default class AccountsService {
  getAllAccounts = async (dto: TGetAllAccountsQuerySchema) => {
    const db = getDatabase();
    const accounts = await db.query.accounts.findMany({
      with: {
        accountGroup: {
          with: {
            group: dto.with_groups || undefined,
          },
        },
      },
      limit: dto.limit || 25,
      offset: dto.offset || 0,
    });

    return accounts;
  };

  getSingleAccount = async (id: number, dto: TGetSingleAccountQuerySchema) => {
    const db = getDatabase();
    const account = await db.query.accounts.findMany({
      where: eq(accountsTable.id, id),
      with: {
        accountGroup: {
          with: {
            group: dto.with_groups || undefined,
          },
        },
      },
    });

    if (account.length === 0) {
      return null;
    }

    return account[0];
  };

  updateAccount = async (id: number, dto: TUpdateAccountBodySchema) => {
    const db = getDatabase();
    const account = await db
      .update(accountsTable)
      .set({
        username: dto.username,
        display_name: dto.display_name,
      })
      .where(eq(accountsTable.id, id))
      .returning();

    if (account.length === 0) {
      return null;
    }

    return account[0];
  };

  deleteAccount = async (id: number) => {
    const db = getDatabase();
    const account = await db
      .delete(accountsTable)
      .where(eq(accountsTable.id, id))
      .returning();

    if (account.length === 0) {
      return null;
    }

    return account[0];
  };
}
