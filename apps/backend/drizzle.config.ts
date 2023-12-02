import type { Config } from "drizzle-kit";

export default {
  schema: "./src/database/schemas/**/*.ts",
  out: "./drizzle",
  driver: "better-sqlite",
  dbCredentials: {
    url: "./main.db",
  },
} satisfies Config;
