import { apiClient } from "@/lib/axios";
import { ASSIGNMENT_ENDPOINTS } from "@/services/api/endpoints";
import type {
  AllAssignmentListItem,
  AssignmentDetail,
  AssignmentListItem,
  AssignmentCreateInput,
  AssignmentUpdateInput,
  AssignmentSubmissionListItem,
  AssignmentSubmissionDetail,
  AssignmentSubmissionCreateInput,
  AssignmentSubmissionUpdateInput,
} from "@/types/Assignment";
import type { Paginated, ListQueryParams } from "@/types";

export const assignmentService = {
  // ── Admin ──────────────────────────────────────────────────────────────────

  adminList: async (
    params?: ListQueryParams,
  ): Promise<Paginated<AllAssignmentListItem>> => {
    const res = await apiClient.get<Paginated<AllAssignmentListItem>>(
      ASSIGNMENT_ENDPOINTS.adminList,
      { params },
    );
    return res.data;
  },

  create: async (
    data: AssignmentCreateInput | FormData,
  ): Promise<AssignmentDetail> => {
    const isFormData = data instanceof FormData;
    const res = await apiClient.post<AssignmentDetail>(
      ASSIGNMENT_ENDPOINTS.create,
      data,
      {
        headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
      },
    );
    return res.data;
  },

  update: async (
    id: number,
    data: AssignmentUpdateInput,
  ): Promise<AssignmentDetail> => {
    const res = await apiClient.patch<AssignmentDetail>(
      ASSIGNMENT_ENDPOINTS.update(id),
      data,
    );
    return res.data;
  },

  adminDetail: async (id: string | number): Promise<AssignmentDetail> => {
    const res = await apiClient.get<AssignmentDetail>(
      ASSIGNMENT_ENDPOINTS.adminDetail(id),
    );
    return res.data;
  },

  // ── Staff ──────────────────────────────────────────────────────────────────

  staffList: async (
    lineId: string | number,
    params?: ListQueryParams,
  ): Promise<Paginated<AssignmentListItem>> => {
    const res = await apiClient.get<Paginated<AssignmentListItem>>(
      ASSIGNMENT_ENDPOINTS.staffList(lineId),
      { params },
    );
    return res.data;
  },

  staffDetail: async (
    lineId: string | number,
    assignmentId: number,
  ): Promise<AssignmentDetail> => {
    const res = await apiClient.get<AssignmentDetail>(
      ASSIGNMENT_ENDPOINTS.staffDetail(lineId, assignmentId),
    );
    return res.data;
  },

  staffSubmissionList: async (
    lineId: string | number,
    assignmentId: number,
    params?: ListQueryParams,
  ): Promise<Paginated<AssignmentSubmissionListItem>> => {
    const res = await apiClient.get<Paginated<AssignmentSubmissionListItem>>(
      ASSIGNMENT_ENDPOINTS.staffSubmissionList(lineId, assignmentId),
      { params },
    );
    return res.data;
  },

  staffSubmissionDetail: async (
    lineId: string | number,
    assignmentId: number,
    submissionId: number,
  ): Promise<AssignmentSubmissionDetail> => {
    const res = await apiClient.get<AssignmentSubmissionDetail>(
      ASSIGNMENT_ENDPOINTS.staffSubmissionDetail(
        lineId,
        assignmentId,
        submissionId,
      ),
    );
    return res.data;
  },

  // ── Member ─────────────────────────────────────────────────────────────────

  memberList: async (
    lineId: string | number,
    params?: ListQueryParams,
  ): Promise<Paginated<AssignmentListItem>> => {
    const res = await apiClient.get<Paginated<AssignmentListItem>>(
      ASSIGNMENT_ENDPOINTS.memberList(lineId),
      { params },
    );
    return res.data;
  },

  // ── Member ─────────────────────────────────────────────────────────────────

  memberDetail: async (
    lineId: string | number,
    assignmentId: string | number, // ✅
  ): Promise<AssignmentDetail> => {
    const res = await apiClient.get<AssignmentDetail>(
      ASSIGNMENT_ENDPOINTS.memberDetail(lineId, assignmentId),
    );
    return res.data;
  },

  memberSubmissionCreate: async (
    assignmentId: string | number, // ✅
    data: AssignmentSubmissionCreateInput | FormData,
  ): Promise<AssignmentSubmissionDetail> => {
    const isFormData = data instanceof FormData;
    const res = await apiClient.post<AssignmentSubmissionDetail>(
      ASSIGNMENT_ENDPOINTS.memberSubmissionCreate(assignmentId),
      data,
      { headers: isFormData ? { "Content-Type": "multipart/form-data" } : {} },
    );
    return res.data;
  },

  memberSubmissionUpdate: async (
    assignmentId: string | number, // ✅
    data: AssignmentSubmissionUpdateInput | FormData,
  ): Promise<AssignmentSubmissionDetail> => {
    const isFormData = data instanceof FormData;
    const res = await apiClient.patch<AssignmentSubmissionDetail>(
      ASSIGNMENT_ENDPOINTS.memberSubmissionUpdate(assignmentId),
      data,
      { headers: isFormData ? { "Content-Type": "multipart/form-data" } : {} },
    );
    return res.data;
  },

  memberSubmissionList: async (
    lineId: string | number,
    assignmentId: string | number, // ✅
    params?: ListQueryParams,
  ): Promise<Paginated<AssignmentSubmissionListItem>> => {
    const res = await apiClient.get<Paginated<AssignmentSubmissionListItem>>(
      ASSIGNMENT_ENDPOINTS.memberSubmissionList(lineId, assignmentId),
      { params },
    );
    return res.data;
  },

  memberSubmissionDetail: async (
    lineId: string | number,
    assignmentId: string | number, // ✅
    submissionId: string | number, // ✅
  ): Promise<AssignmentSubmissionDetail> => {
    const res = await apiClient.get<AssignmentSubmissionDetail>(
      ASSIGNMENT_ENDPOINTS.memberSubmissionDetail(
        lineId,
        assignmentId,
        submissionId,
      ),
    );
    return res.data;
  },

  // ── Admin Submissions ──────────────────────────────────────────────────────

  adminSubmissionList: async (
    params?: ListQueryParams,
  ): Promise<Paginated<AssignmentSubmissionListItem>> => {
    const res = await apiClient.get<Paginated<AssignmentSubmissionListItem>>(
      ASSIGNMENT_ENDPOINTS.adminSubmissionList,
      { params },
    );
    return res.data;
  },
};
