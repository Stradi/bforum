import _slugify from "@sindresorhus/slugify";
import { log } from "./logger";

export function slugify(text: string) {
  return `${_slugify(text)}-${generateRandomNumber(1000, 9999)}`;
}

export function tryParseInt(value: string) {
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    return null;
  }

  return parsed;
}

export function env(name: string, defaultValue?: string): string;
export function env(name: string, defaultValue?: number): number;
export function env(
  name: keyof NodeJS.ProcessEnv, // this is not working, wth???
  defaultValue?: string | number
) {
  const value = process.env[name];
  if (!value) {
    if (defaultValue) return defaultValue;

    log.fatal(`Environment variable ${name} is not set`);
    process.exit(1);
  }

  if (typeof defaultValue !== "number") return value;

  const num = tryParseInt(value);
  if (num) return num;

  log.fatal(`Environment variable ${name} is not a number`);
  process.exit(1);
}

function generateRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
