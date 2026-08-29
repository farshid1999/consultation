// types/content.ts

import {Line, LineDetail} from "@/types/line";
import {LineMember, PaginatedResponse} from "@/types/lineMember";

export interface MediaInput {
  file?: File | Blob;
  text?: string;
}

export interface ContentCreateInput {
  line: string;
  title: string;
  text?: string;
  /** UUID of the parent Content, or undefined for a root-level content. */
  // parent?: string;
  member_ids: string[];
  media: MediaInput[];
}

export interface ContentListItem {
  /** UUID (Content extends BaseModel, primary key is a UUIDField). */
  id: string;
  line: Line;
  title: string;
  text: string | null;
  parent: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContentListParams {
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
  line?: string;
}


export interface MediaItem {
  id: number;
  file: string;
  text?: string;
}

export interface ContentRecipient {
  id: number;
  member: LineMember; // شامل user کامل است
}

export interface ContentDetail {
  id: number;
  line: LineDetail;
  title: string;
  text: string | null;
  media: MediaItem[];
  parent: number | null;
  children: any[]; // یا تایپ مخصوص Children اگر دارید
  recipients: ContentRecipient[];
  created_at: string;
  updated_at: string;
}

export type ContentListResponse = PaginatedResponse<ContentListItem>;