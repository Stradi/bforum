import { eq, sql } from "drizzle-orm";
import { sign, verify } from "hono/jwt";
import { getDatabase } from "../../database";
import { accountsTable } from "../../database/schemas/account";
import type { JwtPayload } from "../../types/jwt";
import type { TLoginBodySchema, TRegisterBodySchema } from "./dto";

export default class AuthService {
  login = async (dto: TLoginBodySchema) => {
    if (!(await this._doesUsernameExists(dto.username))) {
      return null;
    }

    const db = getDatabase();
    const account = await db.query.accounts.findMany({
      where: eq(accountsTable.username, dto.username),
    });

    const passwordsMatch = await Bun.password.verify(
      dto.password,
      account[0].password_hash,
      "argon2id"
    );

    if (!passwordsMatch) {
      return null;
    }

    return account[0];
  };

  register = async (dto: TRegisterBodySchema) => {
    if (
      (await this._doesUsernameExists(dto.username)) ||
      (await this._doesEmailExists(dto.email))
    ) {
      return null;
    }

    const db = getDatabase();
    const account = await db
      .insert(accountsTable)
      .values({
        username: dto.username,
        email: dto.email,
        password_hash: await Bun.password.hash(dto.password, "argon2id"),
        display_name: dto.username,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning();

    return account[0];
  };

  generateJwtToken = async (account: typeof accountsTable.$inferSelect) => {
    return sign(
      {
        id: account.id,
        username: account.username,
        displayName: account.display_name,
        email: account.email,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 1, // 1 hour
        nbf: Math.floor(Date.now() / 1000) - 1, // 1 second
        iat: Math.floor(Date.now() / 1000) - 1, // 1 second
      },
      "secret",
      "HS256"
    );
  };

  verifyJwtToken = async (token: string) => {
    return verify(token, "secret", "HS256") as Promise<JwtPayload>;
  };

  private _doesEmailExists = async (email: string) => {
    const db = getDatabase();
    const exists = await db
      .select({
        count: sql<number>`COUNT(*)`.mapWith(Number),
      })
      .from(accountsTable)
      .where(eq(accountsTable.email, email));

    return exists[0].count > 0;
  };

  private _doesUsernameExists = async (username: string) => {
    const db = getDatabase();
    const exists = await db
      .select({
        count: sql<number>`COUNT(*)`.mapWith(Number),
      })
      .from(accountsTable)
      .where(eq(accountsTable.username, username));

    return exists[0].count > 0;
  };
}
