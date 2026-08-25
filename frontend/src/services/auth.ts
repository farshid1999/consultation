import { apiClient } from "@/lib/axios";
import { tokenService } from "@/lib/auth/tokenService";

const BASE = "v1/auth";

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
}

export interface RegisterPayload {
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
}

export interface VerifyResponse {
  valid: boolean;
  user: {
    id: number;
    username: string;
  };
}

export const auth = {
  login: async (data: LoginPayload): Promise<LoginResponse> => {
    const res = await apiClient.post<LoginResponse>(`${BASE}/login/`, data);
    if (res.data.access) tokenService.setAccessToken(res.data.access);
    return res.data;
  },

  register: async (data: RegisterPayload): Promise<LoginResponse> => {
    const res = await apiClient.post<LoginResponse>(`${BASE}/register/`, data);
    if (res.data.access) tokenService.setAccessToken(res.data.access);
    return res.data;
  },

  refresh: async (): Promise<LoginResponse> => {
    const res = await apiClient.post<LoginResponse>(`${BASE}/refresh/`);
    return res.data;
  },

  verify: async (): Promise<VerifyResponse> => {
    const res = await apiClient.get<VerifyResponse>(`${BASE}/verify/`);
    return res.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post(`${BASE}/logout/`);
    tokenService.clearTokens();
  },
};