"use client";

import { useParams, useRouter } from "next/navigation";
import {
  useMemberAssignmentDetail,
  useMemberSubmissions,
  useMemberSubmissionDetail,
} from "@/hooks/useAssignment";
import AssignmentSubmissionForm from "@/forms/AssignmentSubmissionForm";
import {
  FiArrowRight,
  FiFileText,
  FiClock,
  FiCheckCircle,
  FiDownload,
  FiPaperclip,
} from "react-icons/fi";
import { formatJalaliDateTime } from "@/lib/jalaali";
import { MEDIA_BASE_URL } from "@/lib/axios";

export default function MemberAssignmentDetailPage() {
  const params = useParams();
  const router = useRouter();

  const lineId = params.id as string;
  const assignmentId = params.assignmentId as string;

  const { data: assignment, isLoading: loadingAssignment } =
    useMemberAssignmentDetail(lineId, assignmentId);

  const { data: submissionsData, isLoading: loadingSubmissionsList } =
    useMemberSubmissions(lineId, assignmentId, { page: 1 });

  const firstSubmission = submissionsData?.results?.[0];
  const hasSubmitted = !!firstSubmission;
  const submissionId = firstSubmission?.id;

  const { data: submissionDetail, isLoading: loadingSubmissionDetail } =
    useMemberSubmissionDetail(lineId, assignmentId, submissionId || "");

  const isLoading =
    loadingAssignment || loadingSubmissionsList || loadingSubmissionDetail;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32 text-cream/30 text-sm">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-gold/30 border-t-gold"></span>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <p className="text-cream/30 text-sm">
          تکلیف یافت نشد یا دسترسی ندارید.
        </p>
        <button
          onClick={() => router.back()}
          className="text-gold text-sm hover:underline"
        >
          بازگشت
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header ساده و تمیز */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full text-cream/40 hover:text-cream hover:bg-cream/5 transition-colors"
        >
          <FiArrowRight size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-cream">{assignment.title}</h1>
          <p className="text-cream/50 text-sm mt-1 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
            {assignment.line}
          </p>
        </div>
      </div>

      {/* کانتینر اصلی یکپارچه */}
      <div className="rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-sm overflow-hidden">
        {/* بخش ۱: اطلاعات تکلیف */}
        <div className="p-6 md:p-8 space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-gold/10 text-gold shrink-0">
              <FiFileText size={20} />
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-cream/80">
                توضیحات تکلیف
              </h3>
              <p className="text-cream/70 text-sm leading-7 whitespace-pre-wrap">
                {assignment.description || "توضیحات خاصی ثبت نشده است."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-cream/40 text-xs pt-4 border-t border-white/5">
            <FiClock size={14} />
            <span>
              تاریخ ایجاد:{" "}
              {formatJalaliDateTime(new Date(assignment.created_at))}
            </span>
          </div>
        </div>

        {/* بخش ۲: پاسخ‌های ثبت‌شده (فقط در صورت وجود) */}
        {hasSubmitted &&
          submissionDetail &&
          submissionDetail.media_items.length > 0 && (
            <div className="border-t border-white/5 bg-green-500/[0.03] p-6 md:p-8 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <FiCheckCircle className="text-green-400" size={16} />
                <h3 className="text-sm font-semibold text-green-400/90">
                  پاسخ‌های ثبت‌شده‌ی شما
                </h3>
              </div>

              <div className="space-y-4">
                {submissionDetail.media_items.map((item, index) => (
                  <div
                    key={item.id}
                    className="group relative pr-4 border-r-2 border-gold/30"
                  >
                    {item.media.text && (
                      <p className="text-cream/80 text-sm leading-6 mb-3 whitespace-pre-wrap">
                        {item.media.text}
                      </p>
                    )}
                    {item.media.file && (
                      <a
                        href={
                          item.media.file.startsWith("http")
                            ? item.media.file
                            : `${MEDIA_BASE_URL}${item.media.file}`
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-xs text-gold/80 hover:text-gold bg-gold/5 hover:bg-gold/10 px-3 py-2 rounded-lg transition-colors"
                      >
                        <FiDownload size={14} />
                        {item.media.file.split("/").pop() || "دانلود فایل"}
                      </a>
                    )}
                    <span className="absolute top-0 left-0 text-[10px] text-cream/30">
                      {formatJalaliDateTime(
                        new Date(submissionDetail.created_at),
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* بخش ۳: فرم ارسال/ویرایش (بدون باکس اضافه، فقط فاصله) */}
        <div className="border-t border-white/5 p-6 md:p-8 bg-white/[0.01]">
          <div className="flex items-center gap-2 mb-6">
            <FiPaperclip className="text-gold" size={16} />
            <h3 className="text-sm font-semibold text-cream/80">
              {hasSubmitted ? "ویرایش یا تکمیل پاسخ" : "ارسال پاسخ جدید"}
            </h3>
          </div>

          <AssignmentSubmissionForm
            assignmentId={assignmentId}
            mode={hasSubmitted ? "update" : "create"}
            initialData={submissionDetail || undefined}
            onSuccess={() => window.location.reload()}
          />
        </div>
      </div>
    </div>
  );
}
