import type { UserDetail } from "./user";

// ── Appointment ───────────────────────────────────────────────────────────────

export interface AppointmentListItem {
  id: number;
  line: string;
  member: string;
  staff: string;
  status: string;
  appointment_time: string;
  created_at: string;
}

export interface AppointmentDetail {
  id: number;
  line: string;
  member: AppointmentMember;
  staff: AppointmentStaff;
  status: string;
  appointment_time: string;
  created_at: string;
  updated_at: string;
}

export interface AppointmentMember {
  id: number;
  user: UserDetail;
}

export interface AppointmentStaff {
  id: number;
  user: UserDetail;
  employee_code: string;
  hire_date: string;
  position: string;
}

export interface AppointmentCreateInput {
  line: string;
  member: string;
  staff: string;
  status: string;
  appointment_time: string;
}

export interface AppointmentUpdateInput {
  status?: string;
  appointment_time?: string;
}