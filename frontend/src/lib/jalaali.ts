/**
 * Gregorian <-> Jalali (Persian/Shamsi) calendar conversion.
 *
 * Implemented from scratch (no external dependency) using the standard
 * astronomical-observation-based Jalaali algorithm, so the whole form kit
 * has zero extra runtime dependencies for date handling. The algorithm
 * matches the widely-used `jalaali-js` reference implementation and is
 * verified against known reference dates in this project's dev notes
 * (e.g. 1403/01/01 == 2024-03-20, the Nowruz that year).
 */

function div(a: number, b: number): number {
  return Math.trunc(a / b);
}

function mod(a: number, b: number): number {
  return a - Math.trunc(a / b) * b;
}

// Years in which the Jalaali calendar's leap-year pattern breaks/resets.
const BREAKS = [
  -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394,
  2456, 3178,
];

interface JalCalResult {
  leap: number;
  gy: number;
  march: number;
}

function jalCal(jy: number): JalCalResult {
  const bl = BREAKS.length;
  const gy = jy + 621;
  let leapJ = -14;
  let jp = BREAKS[0]!;
  let jm = 0;
  let jump = 0;

  if (jy < jp || jy >= BREAKS[bl - 1]!) {
    throw new Error(`Invalid Jalaali year ${jy}`);
  }

  for (let i = 1; i < bl; i += 1) {
    jm = BREAKS[i]!;
    jump = jm - jp;
    if (jy < jm) break;
    leapJ = leapJ + div(jump, 33) * 8 + div(mod(jump, 33), 4);
    jp = jm;
  }

  let n = jy - jp;
  leapJ = leapJ + div(n, 33) * 8 + div(mod(n, 33) + 3, 4);
  if (mod(jump, 33) === 4 && jump - n === 4) {
    leapJ += 1;
  }

  const leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150;
  const march = 20 + leapJ - leapG;

  if (jump - n < 6) {
    n = n - jump + div(jump, 33) * 33;
  }
  let leap = mod(mod(n + 1, 33) - 1, 4);
  if (leap === -1) leap = 4;

  return { leap, gy, march };
}

function g2d(gy: number, gm: number, gd: number): number {
  let d =
    div((gy + div(gm - 8, 6) + 100100) * 1461, 4) +
    div(153 * mod(gm + 9, 12) + 2, 5) +
    gd -
    34840408;
  d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752;
  return d;
}

function d2g(jdn: number): { gy: number; gm: number; gd: number } {
  let j = 4 * jdn + 139361631;
  j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
  const i = div(mod(j, 1461), 4) * 5 + 308;
  const gd = div(mod(i, 153), 5) + 1;
  const gm = mod(div(i, 153), 12) + 1;
  const gy = div(j, 1461) - 100100 + div(8 - gm, 6);
  return { gy, gm, gd };
}

function j2d(jy: number, jm: number, jd: number): number {
  const r = jalCal(jy);
  return g2d(r.gy, 3, r.march) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1;
}

function d2j(jdn: number): { jy: number; jm: number; jd: number } {
  const gy = d2g(jdn).gy;
  let jy = gy - 621;
  const r = jalCal(jy);
  const jdn1f = g2d(gy, 3, r.march);
  let k = jdn - jdn1f;

  if (k >= 0) {
    if (k <= 185) {
      return { jy, jm: 1 + div(k, 31), jd: mod(k, 31) + 1 };
    }
    k -= 186;
  } else {
    jy -= 1;
    k += 179;
    if (r.leap === 1) k += 1;
  }
  const jm = 7 + div(k, 30);
  const jd = mod(k, 30) + 1;
  return { jy, jm, jd };
}

export interface JalaliDate {
  jy: number;
  jm: number;
  jd: number;
}

/** Converts a Gregorian calendar date to its Jalali (Shamsi) equivalent. */
export function toJalali(date: Date): JalaliDate {
  const { jy, jm, jd } = d2j(g2d(date.getFullYear(), date.getMonth() + 1, date.getDate()));
  return { jy, jm, jd };
}

/** Converts a Jalali (Shamsi) date to its Gregorian equivalent as a JS Date (local midnight). */
export function toGregorian(jy: number, jm: number, jd: number): Date {
  const { gy, gm, gd } = d2g(j2d(jy, jm, jd));
  return new Date(gy, gm - 1, gd);
}

export function isLeapJalaliYear(jy: number): boolean {
  return jalCal(jy).leap === 0;
}

export function jalaliMonthLength(jy: number, jm: number): number {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  return isLeapJalaliYear(jy) ? 30 : 29;
}

export const JALALI_MONTH_NAMES = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
] as const;

/** Weekday short labels, Saturday-first (the first day of the week in Iran). */
export const JALALI_WEEKDAY_LABELS = ["ش", "ی", "د", "س", "چ", "پ", "ج"] as const;

const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export function toPersianDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => PERSIAN_DIGITS[Number(d)] ?? d);
}

/** JS Date.getDay(): 0=Sunday..6=Saturday. Converts to Saturday-first index (0=Saturday..6=Friday). */
export function toSaturdayFirstWeekday(jsWeekday: number): number {
  return (jsWeekday + 1) % 7;
}

/** Formats a Date as a Jalali string, e.g. "۱۴۰۳/۰۱/۰۱". */
export function formatJalali(date: Date, separator = "/"): string {
  const { jy, jm, jd } = toJalali(date);
  const parts = [jy, String(jm).padStart(2, "0"), String(jd).padStart(2, "0")];
  return toPersianDigits(parts.join(separator));
}

/** Formats a Date as a Jalali date + time string, e.g. "۱۴۰۳/۰۱/۰۱ - ۱۴:۳۰". */
export function formatJalaliDateTime(date: Date, separator = "/"): string {
  const datePart = formatJalali(date, separator);
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${datePart} - ${toPersianDigits(`${hh}:${mm}`)}`;
}

export function isSameJalaliDay(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
