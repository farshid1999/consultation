import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { tokenService } from "@/lib/auth/tokenService";

/**
 * Base URL for the Django backend, e.g. "https://api.example.com/api/".
 * Set NEXT_PUBLIC_API_BASE_URL in your `.env.local`. Falls back to a local
 * dev server so the app still boots without env config.
 *
 * Endpoint paths built in services/api/endpoints.ts are relative to this
 * (e.g. "accounts/staff/"), matching the Django include structure:
 *   path("api/accounts/", include("accounts.Api.v1.urls"))
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/";

/**
 * Adjust to match your actual SimpleJWT refresh endpoint if it differs.
 * Not specified in the provided URLconf, so this is a best-guess default
 * (SimpleJWT's own docs use this exact path by convention).
 */
const REFRESH_ENDPOINT = "/accounts/auth/refresh/";

export const MEDIA_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/"
).replace(/\/api\/?$/, "");

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = tokenService.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- 401 handling: try exactly one silent refresh, then give up. ---

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  try {
    const { data } = await axios.post<{ access: string }>(
      `${API_BASE_URL}${REFRESH_ENDPOINT}`,
      {},
      { withCredentials: true },
    );
    tokenService.setAccessToken(data.access);
    return data.access;
  } catch {
    tokenService.clearTokens();
    return null;
  }
}

interface RetriableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableConfig | undefined;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      // Coalesce concurrent 401s into a single refresh call.
      refreshPromise = refreshPromise ?? refreshAccessToken();
      const newAccessToken = await refreshPromise;
      refreshPromise = null;

      if (newAccessToken) {
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      }

      // Refresh failed — the user is no longer authenticated.
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);
