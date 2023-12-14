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
import type { DefaultGroups } from "../../database/seed/groups";
import { DefaultGroupIds } from "../../database/seed/groups";
import type { CustomJwtClaims, JwtPayload } from "../../types/jwt";
import { BaseError } from "../../utils/errors";
import { env } from "../../utils/text";
import type { TLoginBodySchema, TRegisterBodySchema } from "./dto";

const RegisteredUserGroups: (typeof DefaultGroups)[number][] = [
  "User",
  "Anonymous",
];

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

    const accountGroupValues = RegisteredUserGroups.map((groupName) => ({
      account_id: account[0].id,
      group_id: DefaultGroupIds[groupName],
    }));

    await db.insert(accountGroupTable).values(accountGroupValues).returning();

    return {
      account: account[0],
      groups: RegisteredUserGroups.map((groupName) => ({
        id: DefaultGroupIds[groupName],
        name: groupName,
      })),
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

  getAccountById = async (id: number) => {
    const db = getDatabase();
    const account = await db.query.accounts.findMany({
      where: eq(accountsTable.id, id),
      with: {
        accountGroup: {
          with: {
            group: true,
          },
        },
      },
    });

    if (account.length === 0) {
      return null;
    }

    return account[0];
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
