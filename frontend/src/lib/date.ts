/**
 * Django's DateField expects plain ISO "YYYY-MM-DD" strings. This formats
 * using local calendar fields (not `toISOString()`, which shifts to UTC
 * and can roll the date backward/forward a day depending on timezone).
 */
export function toApiDateString(date: Date | null | undefined): string | undefined {
  if (!date) return undefined;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function fromApiDateString(value: string | null | undefined): Date | null {
  if (!value) return null;
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}
