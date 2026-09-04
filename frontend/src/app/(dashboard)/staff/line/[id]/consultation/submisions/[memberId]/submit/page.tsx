"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FiArrowRight, FiFileText, FiDownload, FiChevronLeft } from "react-icons/fi";
import { useSubmissionDetail } from "@/hooks/useConsultation";
import type { SubmitConsultationForm } from "@/types";

export default function SubmissionDetailPage() {
  const params = useParams<{ memberId: string }>(); // فقط memberId تو مسیره
  const router = useRouter();
  const searchParams = useSearchParams();
  const consultationId = searchParams.get("consultationId"); // از query param

  const { data: submission, isLoading, isError } = useSubmissionDetail(
    consultationId,     // <-- اصلاح شد
    params.memberId
  );

  if (isLoading) {
    return (
      <main dir="rtl" className="mx-auto max-w-4xl px-6 py-10 flex justify-center">
        <span className="spinner-brand h-8 w-8 animate-spin rounded-full border-2 inline-block"></span>
      </main>
    );
  }

  if (isError || !submission) {
    return (
      <main dir="rtl" className="mx-auto max-w-4xl px-6 py-10 text-center">
        <p className="text-red-400">خطا در دریافت اطلاعات یا عدم دسترسی.</p>
        <button onClick={() => router.back()} className="mt-4 text-gold hover:underline">بازگشت</button>
      </main>
    );
  }

  return (
    <main dir="rtl" className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between border-b border-cream/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-cream/40 mb-2">
            <Link href="/line" className="hover:text-gold transition-colors">بخش‌ها</Link>
            <FiChevronLeft size={12} />
            <Link href={`/staff/consultation/submisions`} className="hover:text-gold transition-colors">پاسخ‌ها</Link>
            <FiChevronLeft size={12} />
            <span>جزئیات پاسخ</span>
          </div>
          <h1 className="page-title text-3xl font-extrabold text-cream">{submission.title}</h1>
        </div>

        <button
          onClick={() => router.back()}
          className="rounded-xl border border-cream/20 px-4 py-2 text-sm text-cream/60 hover:text-white hover:border-gold/30 transition-all"
        >
          بازگشت
        </button>
      </div>

      <div className="card p-8 space-y-6">
        <div>
          <h3 className="text-sm font-bold text-gold mb-2">متن پاسخ</h3>
          <p className="text-cream/80 leading-loose whitespace-pre-wrap bg-deep-2/30 p-4 rounded-xl border border-cream/5">
            {submission.description || "پاسخی ثبت نشده است."}
          </p>
        </div>

        {submission.forms && submission.forms.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-gold mb-4 flex items-center gap-2">
              <FiFileText /> فایل‌های ضمیمه
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {submission.forms.map((form) => (
                <a
                  key={form.id}
                  href={form.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 p-4 rounded-xl border border-cream/10 bg-deep-2/30 hover:border-gold/30 transition-all"
                >
                  <div className="h-10 w-10 rounded-lg bg-gold/10 flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
                    <FiDownload size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">دانلود فایل</p>
                    <p className="text-xs text-cream/40">مشاهده یا ذخیره</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}