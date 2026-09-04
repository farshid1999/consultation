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
  remove: (lineId: string | number) =>
    `operations/lines/${lineId}/members/remove/`,
};

export const LINE_STAFF_ENDPOINTS = {
  list: (lineId: string | number) => `operations/lines/${lineId}/staff/`,
  add: (lineId: string | number) => `operations/lines/${lineId}/staff/add/`,
  remove: (lineId: string | number) =>
    `operations/lines/${lineId}/staff/remove/`,
};

export const CONTENT_ENDPOINTS = {
  create: "operations/contents/create/",
  edit: (id: number | string) => `operations/contents/${id}/update/`,
  list: "operations/staff/contents/",
  detail: (id: number | string) => `operations/staff/contents/${id}/`,
  memberList: `operations/member/contents/`,
  memberDetailContent: (id: number | string) =>
    `operations/member/contents/${id}/`,
};

export const ASSIGNMENT_ENDPOINTS = {
  // Admin
  adminList: "operations/assignments/admin/",
  create: "operations/assignments/create/",
  update: (id: number) => `operations/assignments/${id}/update/`,
  adminDetail: (id: string | number) => `operations/assignments/admin/${id}/`,

  // Staff
  staffList: (lineId: string | number) =>
    `operations/staff/assignments/lines/${lineId}/`, // ✅ اصلاح شد: staff قبل از assignments

  staffDetail: (lineId: string | number, assignmentId: string | number) =>
    `operations/staff/assignments/lines/${lineId}/${assignmentId}/`, // ✅ اصلاح شد

  staffSubmissionList: (lineId: string | number, assignmentId: string | number) =>
    `operations/staff/assignments/lines/${lineId}/${assignmentId}/submissions/`, // ✅ اصلاح شد

  staffSubmissionDetail: (
    lineId: string | number,
    assignmentId: string | number,
    submissionId: string | number,
  ) =>
    `operations/staff/assignments/lines/${lineId}/${assignmentId}/submissions/${submissionId}/`, // ✅ اصلاح شد
  // Member
  memberList: (lineId: string | number) =>
    `operations/member/assignments/lines/${lineId}/`,

  memberDetail: (
    lineId: string | number,
    assignmentId: string | number, // ✅ تغییر اینجا
  ) => `operations/member/assignments/lines/${lineId}/${assignmentId}/`,

  memberSubmissionCreate: (
    assignmentId: string | number, // ✅ تغییر اینجا
  ) => `operations/member/assignments/${assignmentId}/submit/`,

  memberSubmissionUpdate: (
    assignmentId: string | number, // ✅ تغییر اینجا
  ) => `operations/member/assignments/${assignmentId}/submission/`,

  memberSubmissionList: (
    lineId: string | number,
    assignmentId: string | number, // ✅ تغییر اینجا
  ) =>
    `operations/member/assignments/lines/${lineId}/${assignmentId}/submissions/`, // ✅ member قبل از assignments

  memberSubmissionDetail: (
    lineId: string | number,
    assignmentId: string | number,
    submissionId: string | number, // ✅ تغییر اینجا
  ) =>
    `operations/member/assignments/lines/${lineId}/${assignmentId}/submissions/${submissionId}/`,

  // Admin submissions
  adminSubmissionList: "operations/assignments/submissions/",
};

export const CONVERSATION_ENDPOINTS = {
  // ── Member ──
  memberCreate: "operations/conversations/",
  memberDetail: (id: string | number) =>
    `operations/member/conversations/${id}/`,

  // ── Staff ──
  staffList: "operations/staff/conversations/",
  staffCreate: "operations/staff/conversations/create/",
  staffDetail: (id: string | number) => `operations/staff/conversations/${id}/`,
  staffJoin: (id: string | number) =>
    `operations/staff/conversations/${id}/join/`,

  // ── Messages ──
  // نکته: هم برای GET (لیست) و هم برای POST (ایجاد) از همین مسیر استفاده می‌شود
  messageList: (conversationId: string | number) =>
    `operations/conversations/${conversationId}/messages/`,
  messageCreate: (conversationId: string | number) =>
    `operations/conversations/${conversationId}/messages/`,
};
