// types/consultation.ts

import {UserDetail} from "@/types/user";

export interface ConsultationFormFile {
  id: string | number;
  file: string; // URL فایل
}

export interface ConsultationFormDetail {
  id: string | number;
  title: string;
  description?: string | null;
  forms: ConsultationFormFile[];
}

export interface ConsultationFormInput {
  title: string;
  description?: string;
  files?: File[]; // فایل‌های جدید برای آپلود
}


export interface SubmitConsultationForm {
  id: string;
  consultation: string; // UUID فرم مشاوره
  title: string;
  description?: string | null;
  forms: ConsultationFormFile[];

  // فیلدهایی که در لیست ارسال می‌شدند (اگر نیاز داشتید)
  member_id?: string;
  user?: UserDetail;
  created_at?: string;
}

export interface ConsultationSubmission {
  id: string;
  member_id: string;
  user: UserDetail; // تغییر از user_id به آبجکت کامل user
  title: string;
  description?: string | null;
  forms: { id: string; file: string }[];
  created_at: string;
}

export interface ConsultationSubmissionListParams {
  consultation_id: string;
}