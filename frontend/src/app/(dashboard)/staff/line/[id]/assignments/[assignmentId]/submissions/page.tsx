"use client";

import { useParams, useRouter } from "next/navigation";
import { useStaffSubmissions } from "@/hooks/useAssignment";
import Link from "next/link";
import { FiArrowRight, FiUser, FiClock, FiEye } from "react-icons/fi";
import { formatJalaliDateTime } from "@/lib/jalaali";

export default function StaffSubmissionsListPage() {
  const params = useParams();
  const router = useRouter();

  const lineId = params.id as string;
  const assignmentId = params.assignmentId as string;

  const { data: submissionsData, isLoading } = useStaffSubmissions(
    lineId,
    assignmentId,
    { page: 1 }
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32 text-cream/30 text-sm">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-gold/30 border-t-gold"></span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full text-cream/40 hover:text-cream hover:bg-cream/5 transition-colors"
        >
          <FiArrowRight size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-cream">پاسخ‌های اعضا</h1>
          <p className="text-cream/50 text-sm mt-1">
            {submissionsData?.pagination?.count ?? 0} پاسخ دریافت شده
          </p>
        </div>
      </div>

      {/* لیست سابمیشن‌ها */}
      <div className="rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-sm overflow-hidden">
        {submissionsData?.results?.length === 0 ? (
          <div className="text-center py-16 text-cream/40 text-sm">
            هنوز هیچ عضوی پاسخ ارسال نکرده است.
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {submissionsData?.results?.map((submission) => (
              <div
                key={submission.id}
                className="flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold text-lg font-bold border border-gold/20">
                    {submission.member?.charAt(0) || "U"}
                  </div>
                  <div>
                    <h3 className="text-cream font-semibold">{submission.member}</h3>
                    <div className="flex items-center gap-2 text-cream/40 text-xs mt-1">
                      <FiClock size={12} />
                      <span>{formatJalaliDateTime(new Date(submission.created_at))}</span>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/staff/line/${lineId}/assignments/${assignmentId}/submissions/${submission.id}`}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold/10 text-gold text-sm hover:bg-gold/20 transition-colors border border-gold/20"
                >
                  <FiEye size={14} />
                  مشاهده و پاسخ
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}