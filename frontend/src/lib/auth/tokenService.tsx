import { localStorageService } from "@/lib/storage/localStorage";
import { cookieService } from "@/lib/storage/cookies";

/**
 * Central place that owns how JWT tokens are persisted across the app.
 *
 * - The **access token** is written to both `localStorage` (for client-side
 *   reads, e.g. the axios interceptor) and a cookie (so server-side code —
 *   Next.js middleware, server components — can see auth state from the
 *   request itself, which `localStorage` can never provide).
 * - The **refresh token** is kept in `localStorage` only; it's never sent
 *   to the server on every request the way a cookie is, so there's no
 *   reason to widen its exposure.
 *
 * This module doesn't call any login endpoint itself — wire your login
 * mutation to call `tokenService.setTokens(...)` on success, and your
 * logout action to call `tokenService.clearTokens()`.
 */

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const ACCESS_TOKEN_COOKIE_DAYS = 1;

export const tokenService = {
  getAccessToken(): string | null {
    return localStorageService.get(ACCESS_TOKEN_KEY) ?? cookieService.get(ACCESS_TOKEN_KEY);
  },

  getRefreshToken(): string | null {
    return localStorageService.get(REFRESH_TOKEN_KEY);
  },

  setTokens(access: string, refresh?: string): void {
    localStorageService.set(ACCESS_TOKEN_KEY, access);
    cookieService.set(ACCESS_TOKEN_KEY, access, { days: ACCESS_TOKEN_COOKIE_DAYS });
    if (refresh) {
      localStorageService.set(REFRESH_TOKEN_KEY, refresh);
    }
  },

  setAccessToken(access: string): void {
    localStorageService.set(ACCESS_TOKEN_KEY, access);
    cookieService.set(ACCESS_TOKEN_KEY, access, { days: ACCESS_TOKEN_COOKIE_DAYS });
  },

  clearTokens(): void {
    localStorageService.remove(ACCESS_TOKEN_KEY);
    localStorageService.remove(REFRESH_TOKEN_KEY);
    cookieService.remove(ACCESS_TOKEN_KEY);
  },

  isAuthenticated(): boolean {
    return Boolean(this.getAccessToken());
  },
};