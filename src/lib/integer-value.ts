/** Decimal digits only: no fractional, exponential or unsafe numeric coercion. */
export function parseIntegerValue(text: string, min = 1): number | null {
  const value = text.trim();
  if (!/^\d+$/.test(value)) return null;
  const number = Number(value);
  return Number.isSafeInteger(number) && number >= min ? number : null;
}
