import _slugify from "@sindresorhus/slugify";

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

function generateRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
