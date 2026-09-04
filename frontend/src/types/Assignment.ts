import type { UserDetail } from "./user";

// ── Media ─────────────────────────────────────────────────────────────────────

export interface Media {
  id: number;
  text: string;
  file: string | null;
}

export interface MediaInput {
  text?: string;
  file?: File | null;
}

// ── Assignment ────────────────────────────────────────────────────────────────

export interface AssignmentListItem {
  id: number;
  title: string;
  description: string;
  parent: number | null;
  created_at: string;
}

export interface AssignmentMedia {
  id: number;
  media: Media;
}

export interface AssignmentRecipientMember {
  id: number;
  user: UserDetail;
}

export interface AssignmentRecipient {
  id: number;
  member: AssignmentRecipientMember;
}

export interface AssignmentDetail {
  id: number;
  line: string;
  title: string;
  description: string;
  parent: number | null;
  media_items: AssignmentMedia[];
  recipients: AssignmentRecipient[];
  children: AssignmentListItem[];
  created_at: string;
  updated_at: string;
}

export interface AllAssignmentListItem {
  id: number;
  line: string;
  title: string;
  description: string;
  parent: number | null;
}

export interface AssignmentCreateInput {
  line: string;
  title: string;
  description?: string;
  parent?: number | null;
  member_ids: string[];
  media_items?: { media: MediaInput }[];
}

export interface AssignmentUpdateInput {
  line: string;
  title?: string;
  description?: string;
  parent?: number | null;
  member_ids?: string[];
  media_items?: { media: MediaInput }[];
}

// ── Submission ────────────────────────────────────────────────────────────────

export interface SubmissionMedia {
  id: number;
  media: Media;
}

export interface AssignmentSubmissionListItem {
  id: number;
  member: string;
  created_at: string;
  updated_at: string;
}

export interface AssignmentSubmissionDetail {
  id: number;
  assignment: number;
  member: string;
  media_items: SubmissionMedia[];
  conversation: string | number | null;
  created_at: string;
  updated_at: string;
}

export interface AssignmentSubmissionCreateInput {
  media_items?: MediaInput[];
}

export interface AssignmentSubmissionUpdateInput {
  media_items?: MediaInput[];
}