"use client";

import {useParams, useRouter, useSearchParams} from "next/navigation";
import Link from "next/link";
import {
    FiChevronLeft,
    FiUser,
    FiCalendar,
    FiDownload,
    FiEye,
} from "react-icons/fi";
import {useConsultationSubmissions} from "@/hooks/useConsultation";
import type {ConsultationSubmission} from "@/types";

export default function ConsultationSubmissionsPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const params = useParams<{ id: string }>();

    const consultationId = searchParams.get("consultationId");
    const lineId = params.id;

    const {data: submissions, isLoading} =
        useConsultationSubmissions(consultationId);

    const submissionList = Array.isArray(submissions) ? submissions : [];

    if (isLoading) {
        return (
            <main
                dir="rtl"
                className="mx-auto max-w-6xl px-6 py-10 flex justify-center"
            >
                <span className="spinner-brand h-8 w-8 animate-spin rounded-full border-2 inline-block"></span>
            </main>
        );
    }

    return (
        <main dir="rtl" className="mx-auto max-w-6xl px-6 py-10">
            <div className="mb-8 flex items-center justify-between border-b border-cream/10 pb-6">
                <div>
                    <div className="flex items-center gap-2 text-xs text-cream/40 mb-2">
                        <Link
                            href="/lines"
                            className="hover:text-gold transition-colors"
                        >
                            بخش‌ها
                        </Link>

                        <FiChevronLeft size={12}/>

                        <span>پاسخ‌های دریافتی</span>
                    </div>

                    <h1 className="page-title text-3xl font-extrabold text-cream">
                        لیست پاسخ‌های ارسالی
                    </h1>
                </div>

                <button
                    onClick={() => router.back()}
                    className="rounded-xl border border-cream/20 px-4 py-2 text-sm text-cream/60 hover:text-white hover:border-gold/30 transition-all"
                >
                    بازگشت
                </button>
            </div>

            <div className="card overflow-hidden">
                <table className="w-full text-right text-sm">
                    <thead className="bg-deep-2/50 text-xs font-medium text-cream/40 border-b border-cream/10">
                    <tr>
                        <th className="px-5 py-4">عضو ارسال کننده</th>
                        <th className="px-5 py-4 w-1/3">عنوان پاسخ</th>
                        <th className="px-5 py-4">تاریخ ارسال</th>
                        <th className="px-5 py-4 text-center">فایل‌های ضمیمه</th>
                        <th className="px-5 py-4 text-center w-24">عملیات</th>
                    </tr>
                    </thead>

                    <tbody className="divide-y divide-cream/5">
                    {submissionList.length > 0 ? (
                        submissionList.map((submission) => (
                            <SubmissionRow
                                key={submission.id}
                                submission={submission}
                                consultationId={consultationId || ""}
                                lineId={lineId || ""}
                            />
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={5}
                                className="py-12 text-center text-cream/40"
                            >
                                هنوز پاسخی برای این فرم ثبت نشده است.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </main>
    );
}

function SubmissionRow({
                           submission,
                           consultationId,
                           lineId,
                       }: {
    submission: ConsultationSubmission;
    consultationId: string;
    lineId: string;
}) {
    const user = submission.user;

    const firstName = user?.first_name || "";
    const lastName = user?.last_name || "";
    const username = user?.username || "کاربر ناشناس";

    const fullName = `${firstName} ${lastName}`.trim();
    const displayName = fullName || username;

    return (
        <tr className="table-row-brand group transition-colors">
            <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                    <div
                        className="h-8 w-8 rounded-full bg-gold/10 flex items-center justify-center text-gold shrink-0">
                        {user?.avatar ? (
                            <img
                                src={user.avatar}
                                alt={displayName}
                                className="h-full w-full rounded-full object-cover"
                            />
                        ) : (
                            <FiUser size={14}/>
                        )}
                    </div>

                    <div className="min-w-0">
                        <p className="font-bold text-cream truncate">
                            {displayName}
                        </p>

                        <p className="text-[10px] text-cream/40 truncate">
                            @{username}
                        </p>
                    </div>
                </div>
            </td>

            <td className="px-5 py-4">
                <p className="text-cream/80 font-medium line-clamp-1">
                    {submission.title}
                </p>

                {submission.description && (
                    <p className="text-xs text-cream/50 line-clamp-1 mt-0.5">
                        {submission.description}
                    </p>
                )}
            </td>

            <td className="px-5 py-4 text-cream/60 whitespace-nowrap">
                <div className="flex items-center gap-2">
                    <FiCalendar size={14}/>

                    {new Date(submission.created_at).toLocaleDateString("fa-IR")}
                </div>
            </td>

            <td className="px-5 py-4 text-center">
                <div className="flex items-center justify-center gap-2">
                    {submission.forms && submission.forms.length > 0 ? (
                        submission.forms.map((form) => (
                            <a
                                key={form.id}
                                href={form.file}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                                title="دانلود فایل"
                            >
                                <FiDownload size={14}/>
                            </a>
                        ))
                    ) : (
                        <span className="text-xs text-cream/30">—</span>
                    )}
                </div>
            </td>

            <td className="px-5 py-4 text-center">
                <Link
                    href={`/staff/line/${lineId}/consultation/submisions/${submission.member_id}/submit?consultationId=${consultationId}`}
                    className="icon-btn-brand flex h-9 w-9 items-center justify-center rounded-full mx-auto hover:bg-gold/10 hover:text-gold transition-colors"
                    title="مشاهده جزئیات پاسخ"
                >
                    <FiEye size={18}/>
                </Link>
            </td>
        </tr>
    );
}

