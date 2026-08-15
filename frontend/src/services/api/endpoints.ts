/**
 * Relative to `apiClient`'s baseURL (see lib/axios.ts), matching:
 *   path("api/accounts/", include("accounts.Api.v1.urls"))
 *   -> staff/  ->  staff-list / staff-create / staff-detail / staff-update / staff-delete
 */
export const STAFF_ENDPOINTS = {
  list: "accounts/staff/",
  create: "accounts/staff/create/",
  detail: (id: number | string) => `accounts/staff/${id}/`,
  update: (id: number | string) => `accounts/staff/${id}/update/`,
  delete: (id: number | string) => `accounts/staff/${id}/delete/`,
};
