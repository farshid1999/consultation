import { UserDetail } from "./user";

export type AppointmentStatus = "pending" | "confirmed" | "canceled";

export interface AppointmentListItem {
  id: string;
  line: string;
  member: string | null;
  requested_by: string | null;
  staff: string | null;
  status: AppointmentStatus;
  description: string | null;
  appointment_time: string | null;
  created_at: string;
}

export interface AppointmentMember {
  id: string;
  user: UserDetail;
}

export interface AppointmentStaff {
  id: string;
  user: UserDetail;
  employee_code: string;
  hire_date: string;
  position: string;
}

export interface AppointmentDetail
  extends Omit<AppointmentListItem, "member" | "staff" | "requested_by"> {
  member: AppointmentMember | null;
  staff: AppointmentStaff | null;
  requested_by: { id: string; name: string } | null;
  requester_name: string | null;
  staff_name: string | null;
  updated_at: string;
  line_id: string;
}

export interface AppointmentRequestInput {
  line_id: string;
  description?: string;
}

export interface AppointmentCreateInput {
  line: string;
  member: string;
  staff: string;
  status: AppointmentStatus;
  appointment_time: string;
}

export interface AppointmentUpdateInput {
  status?: "pending" | "confirmed" | "canceled";
  appointment_time?: string | null;
  staff?: string | null; // UUID کارشناس
}