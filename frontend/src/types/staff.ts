import type { UserCreateInput, UserDetail, UserListItem, UserUpdateInput } from "./user";
import type { UserRole } from "./role";

/** Mirrors StaffListSerializer. */
export interface StaffListItem {
  id: number;
  employee_code: string;
  position: string;
  /** ISO date string "YYYY-MM-DD". */
  hire_date: string;
  roles: UserRole[];
  user: UserListItem;
}

/** Mirrors StaffDetailSerializer. */
export interface StaffDetail {
  id: number;
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
  id: number;
  user: UserDetail | UserCreateInput;
  employee_code: string;
  hire_date: string;
  position: string;
}
