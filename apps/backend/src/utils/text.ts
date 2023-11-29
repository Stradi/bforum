import _slugify from "@sindresorhus/slugify";

export function slugify(text: string) {
  return `${_slugify(text)}-${generateRandomNumber(1000, 9999)}`;
}

function generateRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
