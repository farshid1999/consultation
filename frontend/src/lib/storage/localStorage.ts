/**
 * A thin, SSR-safe wrapper around `window.localStorage`. Next.js renders
 * on the server first, where `window` doesn't exist — every method here
 * checks for that before touching the browser API, so importing this file
 * in a server component or during SSR never throws.
 */
export const localStorageService = {
  get(key: string): string | null {
    if (typeof window === "undefined") return null;
    try {
      return window.localStorage.getItem(key);
    } catch {
      // Storage can throw in private-browsing modes on some browsers.
      return null;
    }
  },

  set(key: string, value: string): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // Swallow quota/private-mode errors — non-fatal for auth flows.
    }
  },

  remove(key: string): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(key);
    } catch {
      // no-op
    }
  },

  getJSON<T>(key: string): T | null {
    const raw = this.get(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  setJSON(key: string, value: unknown): void {
    this.set(key, JSON.stringify(value));
  },
};
