<<<<<<< HEAD
import axios from "axios";
import { tokenService } from "@/lib/auth/tokenService";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

export const accountApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request interceptor: attach access token ──────────────────────────────────
accountApi.interceptors.request.use(
  (config) => {
    const token = tokenService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response interceptor: refresh token on 401 ───────────────────────────────
let isRefreshing = false;
let failedQueue: {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

accountApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const publicEndpoints = [
      "/auth/login/",
      "/auth/register/",
      "/auth/refresh/",
    ];
    const isPublic = publicEndpoints.some((ep) =>
      originalRequest.url?.includes(ep),
    );

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isPublic
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return accountApi(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await accountApi.post("/auth/refresh/");
        const newAccess: string = res.data.access;
        tokenService.setAccessToken(newAccess);
        processQueue(null, newAccess);
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return accountApi(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        tokenService.clearTokens();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
=======
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
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/";

/**
 * Adjust to match your actual SimpleJWT refresh endpoint if it differs.
 * Not specified in the provided URLconf, so this is a best-guess default
 * (SimpleJWT's own docs use this exact path by convention).
 */
const REFRESH_ENDPOINT = "/accounts/token/refresh/";

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
  const refresh = tokenService.getRefreshToken();
  if (!refresh) return null;

  try {
    const { data } = await axios.post<{ access: string }>(
      `${API_BASE_URL.replace(/\/$/, "")}${REFRESH_ENDPOINT}`,
      { refresh }
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

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
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
>>>>>>> 8f967440dfdf627cfb8cf11f7e4823a3aaa56718
      }
    }

    return Promise.reject(error);
<<<<<<< HEAD
  },
=======
  }
>>>>>>> 8f967440dfdf627cfb8cf11f7e4823a3aaa56718
);
