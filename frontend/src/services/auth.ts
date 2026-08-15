import { accountApi } from "@/lib/axios";
import { tokenService } from "@/lib/auth/tokenService";

const BASE = "auth";

export const axiosRetry = async (fn: () => Promise<unknown>, retries = 2, delay = 1000): Promise<unknown> => {
  try {
    return await fn();
  } catch (error: any) {
    if (retries > 0 && error.code === "ECONNABORTED") {
      await new Promise((resolve) => setTimeout(resolve, delay));
      return axiosRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
};

const handleRequest = async <T>(requestPromise: Promise<{ data: T }>, errorContext = "API Error"): Promise<T> => {
  try {
    const res = await requestPromise;
    return res.data;
  } catch (err: any) {
    if (err.code === "ECONNABORTED") return null as T;
    console.error(`${errorContext}:`, err);
    throw err.response?.data || err;
  }
};

export const auth = {
  login: async (data: { username: string; password: string }) => {
    const res = await accountApi.post(`${BASE}/login/`, data);
    if (res.data.access) tokenService.setAccessToken(res.data.access);
    // refresh token comes as httpOnly cookie from backend
    return res.data;
  },

  register: async (data: {
    username: string;
    password: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    is_student?: boolean;
    degree?: string;
    job?: string;
    sport_discipline?: string;
    professional_background?: string;
    club: {
      name: string;
      address: {
        country: string;
        province: string;
        city: string;
        street: string;
        postal_code?: string;
        description?: string;
      };
    };
  }) => {
    const res = await accountApi.post(`${BASE}/register/`, data);
    if (res.data.access) tokenService.setAccessToken(res.data.access);
    return res.data;
  },

  refresh: () =>
    handleRequest(accountApi.post(`${BASE}/refresh/`), "refresh"),

  verify: () =>
    handleRequest(accountApi.get(`${BASE}/verify/`), "verify"),

  logout: async () => {
    await accountApi.post(`${BASE}/logout/`);
    tokenService.clearTokens();
  },
};