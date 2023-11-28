import type { Config } from "drizzle-kit";

export default {
  schema: "./src/database/schemas/**/*.ts",
  out: "./drizzle",
} satisfies Config;
