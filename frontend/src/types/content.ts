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

export interface ContentUpdateInput {
  title?: string;
  text?: string;
  member_ids?: string[];
  media?: MediaInput[];
  /** UUIDهای Media قدیمی که باید نگه داشته شوند؛ بقیه حذف می‌شوند. */
  existing_media_ids?: string[];
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
  line_id?: string;
}


export interface MediaItem {
  id: string;
  file: string | null;
  text?: string;
}

export interface ContentRecipient {
  id: string;
  member: LineMember;
  conversation: string | null; // جدید
}

export interface ContentDetail {
  id: string; // UUID است، نه number
  line: LineDetail;
  title: string;
  text: string | null;
  media: MediaItem[];
  parent: string | null;
  children: any[];
  recipients: ContentRecipient[];
  created_at: string;
  updated_at: string;
}


export interface MemberContentDetail
  extends Omit<ContentDetail, "recipients" | "children"> {
  conversation: string | null;
}

export type ContentListResponse = PaginatedResponse<ContentListItem>;
