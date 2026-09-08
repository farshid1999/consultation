// types/dashboard.ts

export interface DashboardStats {
  generated_at: string;
  window_days: number;
  users: {
    total: number;
    students: number;
    non_students: number;
    staff_count: number;
    active: number;
    inactive: number;
    new_in_window: number;
    new_last_7_days: number;
    signup_trend: { day: string; count: number }[];
    by_club: { club__id: string; club__name: string; count: number }[];
    by_city: { address__city: string; count: number }[];
    by_role: { role__id: number; role__name: string; count: number }[];
  };
  lines: {
    total_lines: number;
    total_memberships: number;
    total_staff_assignments: number;
    top_lines_by_members: { id: string; title: string; member_count: number }[];
    top_lines_by_staff: { id: string; title: string; staff_count: number }[];
  };
  assignments: {
    total_assignments: number;
    total_recipients: number;
    total_submissions: number;
    pending_submissions: number;
    completion_rate_percent: number;
    by_line: { line__id: string; line__title: string; count: number }[];
  };
  appointments: {
    total: number;
    upcoming: number;
    past: number;
    by_status: { status: string; count: number }[];
    top_staff_by_appointments: { staff__id: string; staff__user__first_name: string; staff__user__last_name: string; count: number }[];
  };
  conversations: {
    total_conversations: number;
    total_messages: number;
    messages_trend: { day: string; count: number }[];
  };
  content: {
    total_content: number;
    total_recipients: number;
    by_line: { line__id: string; line__title: string; count: number }[];
  };
  consultations: {
    total_forms: number;
    total_submissions: number;
  };
}