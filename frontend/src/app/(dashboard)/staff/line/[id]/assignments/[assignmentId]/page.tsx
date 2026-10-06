"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  FiArrowRight,
  FiUsers,
  FiPaperclip,
  FiFileText,
  FiGitBranch,
  FiClock,
  FiMessageSquare,
} from "react-icons/fi";
import { useStaffAssignmentDetail } from "@/hooks/useAssignment";
import { formatJalaliDateTime } from "@/lib/jalaali";
import { MEDIA_BASE_URL } from "@/lib/axios";

export default function StaffAssignmentDetailPage() {
  const params = useParams();
  const router = useRouter();

  const lineId = params.id as string;
  const assignmentId = params.assignmentId as string; // اسم پوشه‌ی [assignmentId]

  const { data: assignment, isLoading } = useStaffAssignmentDetail(
    lineId,
    assignmentId,
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-cream/30 text-sm">
        در حال بارگذاری...
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <p className="text-cream/30 text-sm">تکلیف یافت نشد</p>
        <button
          onClick={() => router.back()}
          className="text-gold text-sm hover:underline"
        >
          بازگشت
        </button>
      </div>
    );
  }

  const recipients = assignment.recipients ?? [];
  const mediaItems = assignment.media_items ?? [];
  const children = assignment.children ?? [];

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href={`/staff/line/${lineId}/assignments`}
            className="p-2 rounded-xl text-cream/40 hover:text-cream hover:bg-cream/5 transition-colors"
          >
            <FiArrowRight size={18} />
          </Link>
          <h1 className="text-2xl font-semibold text-cream">
            {assignment.title}
          </h1>
        </div>

        <Link
          href={`/staff/line/${lineId}/assignments/${assignmentId}/submissions`}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-cream/15 text-cream/70 text-sm hover:text-blue-400 hover:border-blue-400/40 transition-colors"
        >
          <FiMessageSquare size={14} />
          پاسخ‌ها
        </Link>
      </div>

      {/* Info */}
      <div className="rounded-2xl border border-cream/10 divide-y divide-cream/5">
        {assignment.description && (
          <div className="flex items-start gap-3 px-5 py-4">
            <FiFileText className="text-gold mt-0.5 shrink-0" size={15} />
            <div className="space-y-1">
              <p className="text-cream/40 text-xs">توضیحات</p>
              <p className="text-cream text-sm leading-relaxed">
                {assignment.description}
              </p>
            </div>
          </div>
        )}

        {assignment.parent && (
          <div className="flex items-start gap-3 px-5 py-4">
            <FiGitBranch className="text-gold mt-0.5 shrink-0" size={15} />
            <div className="space-y-1">
              <p className="text-cream/40 text-xs">تکلیف والد</p>
              <p className="text-cream text-sm">#{assignment.parent}</p>
            </div>
          </div>
        )}

        <div className="flex items-start gap-3 px-5 py-4">
          <FiClock className="text-gold mt-0.5 shrink-0" size={15} />
          <div className="space-y-1">
            <p className="text-cream/40 text-xs">تاریخ ایجاد</p>
            <p className="text-cream text-sm">
              {formatJalaliDateTime(new Date(assignment.created_at))}
            </p>
          </div>
        </div>
      </div>

      {/* Recipients */}
      {recipients.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <FiUsers className="text-gold" size={15} />
            <h2 className="text-cream text-sm font-medium">
              دریافت‌کنندگان ({recipients.length})
            </h2>
          </div>
          <div className="rounded-2xl border border-cream/10 divide-y divide-cream/5">
            {recipients.map((r) => (
              <div key={r.id} className="flex items-center gap-3 px-5 py-3">
                <div className="w-7 h-7 rounded-full bg-gold/10 flex items-center justify-center text-gold text-xs font-medium shrink-0">
                  {r.member.user.first_name?.[0] ??
                    r.member.user.username?.[0] ??
                    "؟"}
                </div>
                <div>
                  <p className="text-cream text-sm">
                    {r.member.user.first_name && r.member.user.last_name
                      ? `${r.member.user.first_name} ${r.member.user.last_name}`
                      : r.member.user.username}
                  </p>
                  {r.member.user.phone_number && (
                    <p className="text-cream/40 text-xs">
                      {r.member.user.phone_number}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Media */}
      {mediaItems.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <FiPaperclip className="text-gold" size={15} />
            <h2 className="text-cream text-sm font-medium">
              فایل‌ها ({mediaItems.length})
            </h2>
          </div>
          <div className="rounded-2xl border border-cream/10 divide-y divide-cream/5">
            {mediaItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between px-5 py-3"
              >
                <p className="text-cream text-sm">
                  {item.media.text ||
                    item.media.file?.split("/").pop() ||
                    "فایل بدون عنوان"}
                </p>
                {item.media.file && (
                  <a
                    href={
                      item.media.file.startsWith("http")
                        ? item.media.file
                        : `${MEDIA_BASE_URL}${item.media.file}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="text-gold text-xs hover:underline"
                  >
                    دانلود
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Children */}
      {children.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <FiGitBranch className="text-gold" size={15} />
            <h2 className="text-cream text-sm font-medium">
              زیرتکالیف ({children.length})
            </h2>
          </div>
          <div className="rounded-2xl border border-cream/10 divide-y divide-cream/5">
            {children.map((child) => (
              <div
                key={child.id}
                className="flex items-center justify-between px-5 py-3"
              >
                <p className="text-cream text-sm">{child.title}</p>
                <p className="text-cream/30 text-xs">#{child.id}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}