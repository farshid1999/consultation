import type { UserCreateInput, UserDetail, UserListItem, UserUpdateInput } from "./user";
import type { UserRole } from "./role";
import {PaginatedResponse} from "@/types/lineMember";

/** Mirrors StaffListSerializer. */
export interface StaffListItem {
  id: string;
  employee_code: string;
  position: string;
  /** ISO date string "YYYY-MM-DD". */
  hire_date: string;
  roles: UserRole[];
  user: UserListItem;
}

/** Mirrors StaffDetailSerializer. */
export interface StaffDetail {
  id: string;
  employee_code: string;
  position: string;
  hire_date: string;
  user: UserDetail;
  roles: UserRole[];
}

/** Mirrors StaffCreateSerializer. */
export interface StaffCreateInput {
  user: UserCreateInput;
  employee_code: string;
  hire_date: string;
  position: string;
}

/** Mirrors StaffUpdateSerializer — everything optional (partial update). */
export interface StaffUpdateInput {
  user?: UserUpdateInput;
  employee_code?: string;
  hire_date?: string;
  position?: string;
}

/** What StaffCreateAPIView / StaffUpdateAPIView actually return (StaffUpdateSerializer shape in both cases). */
export interface StaffMutationResult {
  id: string;
  user: UserDetail | UserCreateInput;
  employee_code: string;
  hire_date: string;
  position: string;
}


export interface StaffLine {
  id: string;
  staff: string; // همان StringRelatedField که نام کاربر را برمی‌گرداند
  user: UserDetail;
  staff_id: string;
  // فیلدهای جدید از مدل Staff
  employee_code: string;
  hire_date: string; // تاریخ به صورت رشته ISO از بک‌اند می‌آید
  position: string;
}


export interface StaffLineListParams {
  search?: string;
  ordering?: string;
}

export type StaffLineListResponse = PaginatedResponse<StaffLine>;
