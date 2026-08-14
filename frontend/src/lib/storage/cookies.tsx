/**
 * Minimal cookie utility (no `js-cookie` dependency — this is small enough
 * to own outright). Used alongside `localStorage` for the access token so
 * server-side code (e.g. Next.js middleware protecting routes) can read
 * auth state from the request's cookie header, which `localStorage` can
 * never provide since it's a browser-only API.
 */

export interface CookieOptions {
  days?: number;
  path?: string;
  sameSite?: "Strict" | "Lax" | "None";
  secure?: boolean;
}

const DEFAULT_OPTIONS: Required<Omit<CookieOptions, "days">> = {
  path: "/",
  sameSite: "Lax",
  secure: typeof window !== "undefined" && window.location.protocol === "https:",
};

export const cookieService = {
  get(name: string): string | null {
    if (typeof document === "undefined") return null;
    const match = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${encodeURIComponent(name)}=`));
    if (!match) return null;
    return decodeURIComponent(match.split("=").slice(1).join("="));
  },

  set(name: string, value: string, options: CookieOptions = {}): void {
    if (typeof document === "undefined") return;
    const opts = { ...DEFAULT_OPTIONS, ...options };
    let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
    cookie += `; path=${opts.path}`;
    cookie += `; samesite=${opts.sameSite}`;
    if (opts.secure) cookie += "; secure";
    if (options.days) {
      const expires = new Date();
      expires.setTime(expires.getTime() + options.days * 24 * 60 * 60 * 1000);
      cookie += `; expires=${expires.toUTCString()}`;
    }
    document.cookie = cookie;
  },

  remove(name: string, path = "/"): void {
    if (typeof document === "undefined") return;
    document.cookie = `${encodeURIComponent(name)}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  },
};