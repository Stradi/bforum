import { eq, sql } from "drizzle-orm";
import { sign, verify } from "hono/jwt";
import {
  JwtTokenExpired,
  JwtTokenInvalid,
  JwtTokenIssuedAt,
  JwtTokenSignatureMismatched,
} from "hono/utils/jwt/types";
import { getDatabase } from "../../database";
import { accountsTable } from "../../database/schemas/account";
import { accountGroupTable } from "../../database/schemas/account-group";
import type { CustomJwtClaims, JwtPayload } from "../../types/jwt";
import { BaseError } from "../../utils/errors";
import { env } from "../../utils/text";
import type { TLoginBodySchema, TRegisterBodySchema } from "./dto";

export default class AuthService {
  login = async (dto: TLoginBodySchema) => {
    if (!(await this._doesUsernameExists(dto.username))) {
      return null;
    }

    const db = getDatabase();
    const account = await db.query.accounts.findMany({
      where: eq(accountsTable.username, dto.username),
      with: {
        accountGroup: {
          with: {
            group: true,
          },
        },
      },
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

    await db
      .insert(accountGroupTable)
      .values({
        account_id: account[0].id,
        group_id: 3, // 3 is `Anonymous`
      })
      .returning();

    return {
      account: account[0],
      groups: [
        {
          id: 3,
          name: "Anonymous",
        },
      ],
    };
  };

  generateJwtToken = async (args: CustomJwtClaims) => {
    return sign(
      {
        id: args.id,
        username: args.username,
        display_name: args.display_name,
        email: args.email,
        groups: args.groups,
        exp: Math.floor(Date.now() / 1000) + env("JWT_EXPIRES_IN", 3600), // 1 hour
        nbf: Math.floor(Date.now() / 1000) - 1, // 1 second
        iat: Math.floor(Date.now() / 1000) - 1, // 1 second
      },
      env("JWT_SECRET"),
      "HS256"
    );
  };

  verifyJwtToken = async (token: string) => {
    return verify(token, env("JWT_SECRET"), "HS256") as Promise<JwtPayload>;
  };

  extractJwtPayload = async (token: string) => {
    return this.verifyJwtToken(token).catch((e) => {
      if (
        e instanceof JwtTokenInvalid ||
        e instanceof JwtTokenIssuedAt ||
        e instanceof JwtTokenSignatureMismatched
      ) {
        throw new BaseError({
          statusCode: 401,
          code: "INVALID_AUTH_TOKEN",
          message: "Auth token is invalid",
          action: "Provide a valid auth token in the 'auth-token' cookie",
        });
      } else if (e instanceof JwtTokenExpired) {
        throw new BaseError({
          statusCode: 401,
          code: "EXPIRED_AUTH_TOKEN",
          message: "Auth token has expired",
          action: "Provide a valid auth token in the 'auth-token' cookie",
        });
      }

      throw e;
    });
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
