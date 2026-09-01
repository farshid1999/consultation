"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { FiSearch, FiHeadphones, FiFileText, FiFilm, FiArrowRight } from "react-icons/fi";
import NeuralBackground from "@/components/background/NeuralBackground";
import { useMemberLineContents } from "@/hooks/useContent";
import type { ContentListItem } from "@/types";

export default function MemberLineContentsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const lineId = params.id;

  const [search, setSearch] = useState("");

  // استفاده از هوک جدید با ارسال lineId
  const { data, isLoading } = useMemberLineContents(lineId, { search: search || undefined });
  const contents = data?.results || [];

  // تشخیص آیکون بر اساس نوع فایل
  const getFileIcon = (content: ContentListItem) => {
    if (!content.media || content.media.length === 0) return <FiFileText size={20} />;
    const fileExt = content.media[0].file.split('.').pop()?.toLowerCase();
    if (['mp3', 'wav', 'ogg'].includes(fileExt || '')) return <FiHeadphones size={20} />;
    if (['jpg', 'png', 'jpeg'].includes(fileExt || '')) return <FiFilm size={20} />;
    return <FiFileText size={20} />;
  };

  return (
    <main className="relative min-h-screen bg-deep text-cream overflow-x-hidden">
      <NeuralBackground />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">

        {/* هدر صفحه */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-gold/20 pb-8">
          <div>
            <div className="flex items-center gap-2 text-xs text-gold/60 mb-2">
              <Link href="/dashboard" className="hover:text-white transition-colors">داشبورد</Link>
              <FiArrowRight size={12} className="rotate-180" />
              <span>محتوای بخش</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              آرشیو محتوای اختصاصی
            </h1>
            <p className="mt-2 text-cream/50 text-sm">
              فایل‌ها و آموزش‌های ارسال شده توسط مربیان این بخش
            </p>
          </div>

          {/* جستجو */}
          <div className="w-full md:w-72 relative group">
            <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50 transition-colors group-focus-within:text-gold" />
            <input
              type="text"
              placeholder="جست‌وجوی عنوان..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-deep-2/40 backdrop-blur-md border border-gold/20 rounded-2xl py-3 pr-12 pl-4 text-sm text-white placeholder:text-cream/30 focus:border-gold focus:ring-1 focus:ring-gold/50 outline-none transition-all"
            />
          </div>
        </div>

        {/* گرید محتواها */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-56 rounded-2xl bg-deep-2/30 animate-pulse border border-white/5"></div>
            ))}
          </div>
        ) : contents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-deep-2/20 rounded-[2rem] border border-dashed border-gold/10 backdrop-blur-sm">
            <FiFileText size={40} className="text-gold/20 mb-4" />
            <h3 className="text-lg font-bold text-white">محتوایی یافت نشد</h3>
            <p className="mt-2 text-cream/50 text-sm">هنوز محتوایی برای این بخش به شما ارسال نشده است.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contents.map((content) => (
              <Link
                key={content.id}
                href={`/dashboard/member/contents/${content.id}`}
                className="group block"
              >
                <div className="h-full p-5 rounded-2xl bg-gradient-to-br from-deep-2/60 to-deep-2/30 border border-white/5 hover:border-gold/40 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg overflow-hidden relative">

                  {/* افکت هاور */}
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2.5 rounded-xl bg-gold/10 text-gold border border-gold/20 group-hover:scale-110 transition-transform">
                      {getFileIcon(content)}
                    </div>
                    <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-white/5 text-cream/40 border border-white/5">
                      {new Date(content.created_at).toLocaleDateString('fa-IR')}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-gold transition-colors">
                    {content.title}
                  </h3>
                  <p className="text-xs text-cream/60 line-clamp-2">
                    {content.text || "بدون توضیحات"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}