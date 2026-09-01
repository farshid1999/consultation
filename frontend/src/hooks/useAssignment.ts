import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { assignmentService } from "@/services/assignmentService";
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

const KEYS = {
  adminList: (params?: ListQueryParams) =>
    ["assignments", "admin", "list", params] as const,
  staffList: (lineId: string | number, params?: ListQueryParams) =>
    ["assignments", "staff", "list", lineId, params] as const,
  staffDetail: (lineId: string | number, assignmentId: number) =>
    ["assignments", "staff", "detail", lineId, assignmentId] as const,
  staffSubmissionList: (lineId: string | number, assignmentId: number) =>
    ["assignments", "staff", "submissions", lineId, assignmentId] as const,
  staffSubmissionDetail: (
    lineId: string | number,
    assignmentId: number,
    submissionId: number,
  ) =>
    [
      "assignments",
      "staff",
      "submission",
      lineId,
      assignmentId,
      submissionId,
    ] as const,
  memberList: (lineId: string | number, params?: ListQueryParams) =>
    ["assignments", "member", "list", lineId, params] as const,

  memberDetail: (
    lineId: string | number,
    assignmentId: string | number, // ✅ تغییر اینجا
  ) => ["assignments", "member", "detail", lineId, assignmentId] as const,

  memberSubmissionList: (
    lineId: string | number,
    assignmentId: string | number, // ✅ تغییر اینجا
  ) => ["assignments", "member", "submissions", lineId, assignmentId] as const,
  memberSubmissionDetail: (
    lineId: string | number,
    assignmentId: string | number,
    submissionId: string | number,
  ) =>
    [
      "assignments",
      "member",
      "submission",
      lineId,
      assignmentId,
      submissionId,
    ] as const,
  adminSubmissionList: (params?: ListQueryParams) =>
    ["assignments", "admin", "submissions", params] as const,
};

// ── Admin ─────────────────────────────────────────────────────────────────────

export const useAdminAssignments = (params?: ListQueryParams) =>
  useQuery<Paginated<AllAssignmentListItem>>({
    queryKey: KEYS.adminList(params),
    queryFn: () => assignmentService.adminList(params),
    staleTime: 0,
  });

export const useCreateAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation<AssignmentDetail, Error, AssignmentCreateInput>({
    mutationFn: (data) => assignmentService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
    },
  });
};

export const useUpdateAssignment = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation<AssignmentDetail, Error, AssignmentUpdateInput>({
    mutationFn: (data) => assignmentService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
    },
  });
};

export const useAdminAssignmentDetail = (id: string | number) =>
  useQuery<AssignmentDetail>({
    queryKey: ["assignments", "admin", "detail", id],
    queryFn: () => assignmentService.adminDetail(id),
    enabled: !!id,
  });

// ── Staff ─────────────────────────────────────────────────────────────────────

export const useStaffAssignments = (
  lineId: string | number,
  params?: ListQueryParams,
) =>
  useQuery<Paginated<AssignmentListItem>>({
    queryKey: KEYS.staffList(lineId, params),
    queryFn: () => assignmentService.staffList(lineId, params),
    enabled: !!lineId,
    staleTime: 0,
  });

export const useStaffAssignmentDetail = (
  lineId: string | number,
  assignmentId: number,
) =>
  useQuery<AssignmentDetail>({
    queryKey: KEYS.staffDetail(lineId, assignmentId),
    queryFn: () => assignmentService.staffDetail(lineId, assignmentId),
    enabled: !!lineId && !!assignmentId,
  });

export const useStaffSubmissions = (
  lineId: string | number,
  assignmentId: number,
  params?: ListQueryParams,
) =>
  useQuery<Paginated<AssignmentSubmissionListItem>>({
    queryKey: KEYS.staffSubmissionList(lineId, assignmentId),
    queryFn: () =>
      assignmentService.staffSubmissionList(lineId, assignmentId, params),
    enabled: !!lineId && !!assignmentId,
    staleTime: 0,
  });

export const useStaffSubmissionDetail = (
  lineId: string | number,
  assignmentId: number,
  submissionId: number,
) =>
  useQuery<AssignmentSubmissionDetail>({
    queryKey: KEYS.staffSubmissionDetail(lineId, assignmentId, submissionId),
    queryFn: () =>
      assignmentService.staffSubmissionDetail(
        lineId,
        assignmentId,
        submissionId,
      ),
    enabled: !!lineId && !!assignmentId && !!submissionId,
  });

// ── Member ────────────────────────────────────────────────────────────────────

export const useMemberAssignments = (
  lineId: string | number,
  params?: ListQueryParams,
) =>
  useQuery<Paginated<AssignmentListItem>>({
    queryKey: KEYS.memberList(lineId, params),
    queryFn: () => assignmentService.memberList(lineId, params),
    enabled: !!lineId,
    staleTime: 0,
  });

export const useMemberAssignmentDetail = (
  lineId: string | number,
  assignmentId: string | number, // ✅ تغییر به string | number
) =>
  useQuery<AssignmentDetail>({
    queryKey: KEYS.memberDetail(lineId, assignmentId),
    queryFn: () => assignmentService.memberDetail(lineId, assignmentId),
    enabled: !!lineId && !!assignmentId,
  });

export const useCreateSubmission = (assignmentId: string | number) => {
  // ✅ تغییر به string | number
  const queryClient = useQueryClient();
  return useMutation<
    AssignmentSubmissionDetail,
    Error,
    AssignmentSubmissionCreateInput | FormData
  >({
    mutationFn: (data) =>
      assignmentService.memberSubmissionCreate(assignmentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["assignments", "member", "submissions"],
      });
    },
  });
};

export const useUpdateSubmission = (assignmentId: string | number) => {
  // ✅ تغییر به string | number
  const queryClient = useQueryClient();
  return useMutation<
    AssignmentSubmissionDetail,
    Error,
    AssignmentSubmissionUpdateInput | FormData
  >({
    mutationFn: (data) =>
      assignmentService.memberSubmissionUpdate(assignmentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["assignments", "member", "submissions"],
      });
    },
  });
};

export const useMemberSubmissions = (
  lineId: string | number,
  assignmentId: string | number, // ✅ تغییر به string | number
  params?: ListQueryParams,
) =>
  useQuery<Paginated<AssignmentSubmissionListItem>>({
    queryKey: KEYS.memberSubmissionList(lineId, assignmentId),
    queryFn: () =>
      assignmentService.memberSubmissionList(lineId, assignmentId, params),
    enabled: !!lineId && !!assignmentId,
    staleTime: 0,
  });

export const useMemberSubmissionDetail = (
  lineId: string | number,
  assignmentId: number,
  submissionId: number,
) =>
  useQuery<AssignmentSubmissionDetail>({
    queryKey: KEYS.memberSubmissionDetail(lineId, assignmentId, submissionId),
    queryFn: () =>
      assignmentService.memberSubmissionDetail(
        lineId,
        assignmentId,
        submissionId,
      ),
    enabled: !!lineId && !!assignmentId && !!submissionId,
  });

// ── Admin Submissions ─────────────────────────────────────────────────────────

export const useAdminSubmissions = (params?: ListQueryParams) =>
  useQuery<Paginated<AssignmentSubmissionListItem>>({
    queryKey: KEYS.adminSubmissionList(params),
    queryFn: () => assignmentService.adminSubmissionList(params),
    staleTime: 0,
  });
