"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { FiSearch, FiFileText, FiFilm, FiHeadphones, FiArrowRight } from "react-icons/fi";
import { Input } from "@/components/ui/inputs";
import { useMemberContents } from "@/hooks/useContent";
import type { ContentListItem } from "@/types";

export default function MemberContentHistoryPage() {
  const params = useParams<{ memberId: string; lineId?: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [search, setSearch] = useState("");

  // استخراج نام کاربر از URL یا کوئری (فرض بر اینکه نام را پاس داده‌ایم)
  const userName = searchParams.get("name") || "کاربر";
  const lineName = searchParams.get("line") || "لاین";

  const { data, isLoading } = useMemberContents(params.memberId, {
    search: search || undefined,
    line_id: params.lineId, // فیلتر اختیاری بر اساس لاین
    ordering: "-created_at"
  });

  const contents = data?.results || [];

  // تابع تشخیص نوع فایل
  const getFileType = (url: string) => {
    if (!url) return 'unknown';
    const ext = url.split('.').pop()?.toLowerCase();
    if (['mp3', 'wav', 'ogg', 'webm'].includes(ext || '')) return 'audio';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return 'image';
    return 'file';
  };

  return (
    <main dir="rtl" className="mx-auto max-w-6xl px-6 py-10">

      {/* هدر صفحه */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cream/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-cream/40 mb-2">
            <Link href="/dashboard/staff/contents" className="hover:text-gold">محتواها</Link>
            <FiArrowRight size={12} className="rotate-180" />
            <span>سوابق {userName}</span>
          </div>
          <h1 className="page-title text-3xl font-extrabold text-white">
            آرشیو محتوای دریافتی
          </h1>
          <p className="mt-2 text-sm text-cream/50">
            نمایش تمام فایل‌ها و پیام‌های ارسالی به این عضو در بخش <span className="text-gold">{lineName}</span>
          </p>
        </div>

        <div className="w-full md:w-72">
          <Input
            placeholder="جست‌وجوی عنوان محتوا..."
            leftIcon={<FiSearch />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* گرید محتواها */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 rounded-2xl bg-deep-2/30 animate-pulse border border-cream/5"></div>
          ))}
        </div>
      ) : contents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-deep-2/20 rounded-3xl border border-dashed border-cream/10">
          <FiFileText size={48} className="text-cream/20 mb-4" />
          <h3 className="text-xl font-bold text-white">محتوایی یافت نشد</h3>
          <p className="mt-2 text-cream/50">هنوز محتوایی برای این عضو ثبت نشده است.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contents.map((content) => (
            <ContentCard key={content.id} content={content} getFileType={getFileType} />
          ))}
        </div>
      )}

    </main>
  );
}

// کامپوننت کارت محتوا
function ContentCard({ content, getFileType }: { content: ContentListItem, getFileType: (url: string) => string }) {
  // فرض می‌کنیم media آرایه‌ای از آبجکت‌هاست. اگر فقط یکی است، اولین آیتم را برمی‌داریم
  const primaryMedia = content.media?.[0];
  const mediaType = primaryMedia ? getFileType(primaryMedia.file) : 'none';

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-deep-2/30 border border-cream/10 hover:border-gold/30 transition-all duration-300 hover:-translate-y-1 shadow-lg">

      {/* بخش مدیا (هدر کارت) */}
      <div className="h-48 w-full bg-black/20 relative flex items-center justify-center overflow-hidden">
        {mediaType === 'image' && primaryMedia ? (
          <img
            src={primaryMedia.file}
            alt={content.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : mediaType === 'audio' && primaryMedia ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#0b2622] to-[#1a3c34] p-4">
            <FiHeadphones size={40} className="text-gold/50 mb-3" />
            <audio
              controls
              className="w-full h-8 opacity-80 hover:opacity-100 transition-opacity"
              src={primaryMedia.file}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center text-cream/20">
            <FiFileText size={48} />
            <span className="text-xs mt-2">بدون فایل ضمیمه</span>
          </div>
        )}

        {/* بج تاریخ */}
        <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-black/60 backdrop-blur-md text-[10px] text-white font-medium">
          {new Date(content.created_at).toLocaleDateString('fa-IR')}
        </div>
      </div>

      {/* بدنه کارت */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{content.title}</h3>
        <p className="text-sm text-cream/60 line-clamp-2 min-h-[2.5rem] mb-4">
          {content.text || "بدون توضیحات متنی"}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-cream/5">
          <span className="text-xs text-gold/80 font-medium">
            {content.line?.title || "لاین عمومی"}
          </span>

          <Link
            href={`/staff/content/${content.id}`}
            className="text-xs text-cream/40 hover:text-white transition-colors flex items-center gap-1"
          >
            مشاهده جزئیات
            <FiArrowRight size={12} className="rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
}