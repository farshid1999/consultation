import {UserDetail} from "@/types/user";

export interface LineMember {
  id: number;
  user: UserDetail;
}

export interface LineMemberListParams {
  search?: string;
  ordering?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export type LineMemberListResponse = PaginatedResponse<LineMember>;