import { eq } from "drizzle-orm";
import { getDatabase } from "../../database";
import { accountsTable } from "../../database/schemas/account";
import { accountGroupTable } from "../../database/schemas/account-group";
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

    return accounts.map(this.redactField("password_hash"));
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

    return this.redactField("password_hash")(account[0]);
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

    if (dto.groups) {
      await db
        .delete(accountGroupTable)
        .where(eq(accountGroupTable.account_id, id));

      for await (const groupId of dto.groups) {
        await db
          .insert(accountGroupTable)
          .values({
            account_id: id,
            group_id: groupId,
          })
          .returning();
      }
    }

    return this.redactField("password_hash")(account[0]);
  };

  deleteAccount = async (id: number) => {
    const db = getDatabase();
    const account = await db
      .delete(accountsTable)
      .where(eq(accountsTable.id, id))
      .returning();

    await db
      .delete(accountGroupTable)
      .where(eq(accountGroupTable.account_id, id));

    if (account.length === 0) {
      return null;
    }

    return this.redactField("password_hash")(account[0]);
  };

  private redactField = (field: keyof typeof accountsTable.$inferSelect) => {
    return (account: typeof accountsTable.$inferSelect) => {
      const { [field]: _, ...redactedAccount } = account;

      // Return type is actually:
      // Omit<
      //   typeof accountsTable.$inferInsert,
      //   typeof field
      // >;
      // but when we do that, errors happen, me sad :(
      return redactedAccount as typeof accountsTable.$inferSelect;
    };
  };
}
