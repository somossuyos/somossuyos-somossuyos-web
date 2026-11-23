const MIN_AGE = 18;
const MAX_AGE = 45;

export function computeAgeFromBirthDate(birthDateIso: string, asOf: Date = new Date()): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birthDateIso.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const birth = new Date(Date.UTC(year, month - 1, day));
  if (birth.getUTCFullYear() !== year || birth.getUTCMonth() !== month - 1 || birth.getUTCDate() !== day) {
    return null;
  }
  let age = asOf.getFullYear() - year;
  const beforeBirthday =
    asOf.getMonth() < month - 1 || (asOf.getMonth() === month - 1 && asOf.getDate() < day);
  if (beforeBirthday) age -= 1;
  return age;
}

export function isAgeInAllowedRange(age: number): boolean {
  return age >= MIN_AGE && age <= MAX_AGE;
}

export const CAMINO_AGE_MIN = MIN_AGE;
export const CAMINO_AGE_MAX = MAX_AGE;