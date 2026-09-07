import {apiClient} from "@/lib/axios";
import type {UserListItem, UserDetail, UserCreateInput, UserUpdateInput, UserGuard, UserRoleResponse} from "@/types";
import type {Paginated, ListQueryParams} from "@/types";

const BASE = "v1/users";

export const users = {
    getUsers: async (params?: ListQueryParams): Promise<Paginated<UserListItem>> => {
        const res = await apiClient.get<Paginated<UserListItem>>(`${BASE}/`, {params});
        return res.data;
    },

    getUser: async (id: number): Promise<UserDetail> => {
        const res = await apiClient.get<UserDetail>(`${BASE}/${id}/`);
        return res.data;
    },

    createUser: async (data: UserCreateInput): Promise<UserDetail> => {
        const res = await apiClient.post<UserDetail>(`${BASE}/create/`, data);
        return res.data;
    },

    updateUser: async (id: number, data: UserUpdateInput): Promise<UserDetail> => {
        const res = await apiClient.patch<UserDetail>(`${BASE}/${id}/update/`, data);
        return res.data;
    },

    deleteUser: async (id: number): Promise<void> => {
        await apiClient.delete(`${BASE}/${id}/delete/`);
    },

    async getMe(): Promise<UserDetail> {
        const {data} = await apiClient.get<UserDetail>("accounts/users/me/");
        return data;
    },

    async getUserRole(): Promise<UserRoleResponse> {
        const {data} = await apiClient.get<UserRoleResponse>("accounts/roles/get-user-role/");
        return data;
    },
};