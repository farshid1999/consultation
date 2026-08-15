import { accountApi } from "@/lib/axios";

const BASE = "users";

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

export const users = {
  getUsers: (params?: Record<string, string>) =>
    handleRequest(accountApi.get(`${BASE}/`, { params }), "getUsers"),

  getUser: (id: number) =>
    handleRequest(accountApi.get(`${BASE}/${id}/`), "getUser"),

  createUser: (data: unknown) =>
    handleRequest(accountApi.post(`${BASE}/create/`, data), "createUser"),

  updateUser: (id: number, data: unknown) =>
    handleRequest(accountApi.patch(`${BASE}/${id}/update/`, data), "updateUser"),

  deleteUser: (id: number) =>
    handleRequest(accountApi.delete(`${BASE}/${id}/delete/`), "deleteUser"),
};