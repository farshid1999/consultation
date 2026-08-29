// services/api/endpoints.ts

/**
 * Relative to `apiClient`'s baseURL (see lib/axios.ts), matching:
 *   path("api/accounts/", include("accounts.Api.v1.urls"))
 *   path("api/operations/", include("operations.Api.urls"))
 */

export const STAFF_ENDPOINTS = {
    list: "accounts/staff/",
    create: "accounts/staff/create/",
    detail: (id: number | string) => `accounts/staff/${id}/`,
    update: (id: number | string) => `accounts/staff/${id}/update/`,
    delete: (id: number | string) => `accounts/staff/${id}/delete/`,
};

// اضافه کردن اندپوینت‌های لاین
export const LINE_ENDPOINTS = {
    myList: "operations/lines/my/",
    list: "operations/lines/",
    // اگر در آینده نیاز به جزئیات یا حذف بود، اینجا تعریف می‌شود
    detail: (id: number | string) => `operations/lines/${id}/`,
};

export const LINE_MEMBER_ENDPOINTS = {
    list: (lineId: string | number) => `operations/lines/${lineId}/members/`,
    add: (lineId: string | number) => `operations/lines/${lineId}/members/add/`,
    remove: (lineId: string | number) => `operations/lines/${lineId}/members/remove/`,
};


export const LINE_STAFF_ENDPOINTS = {
    list: (lineId: string | number) => `operations/lines/${lineId}/staff/`,
    add: (lineId: string | number) => `operations/lines/${lineId}/staff/add/`,
    remove: (lineId: string | number) => `operations/lines/${lineId}/staff/remove/`
};


export const CONTENT_ENDPOINTS = {
    create: "operations/contents/create/",
    list: "operations/staff/contents/",
    detail: (id: number | string) => `operations/staff/contents/${id}/`,
};