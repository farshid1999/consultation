"use client";

import { useState } from "react";
import Link from "next/link";
import { FiSearch, FiHeadphones, FiFileText, FiFilm, FiCalendar } from "react-icons/fi";
import NeuralBackground from "@/components/background/NeuralBackground";
import { useMemberListContents } from "@/hooks/useContent";
import type { ContentListItem } from "@/types";

export default function MemberContentPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useMemberListContents({ search: search || undefined });
  const contents = data?.results || [];

  // تابع تشخیص نوع فایل برای آیکون
  const getFileIcon = (content: ContentListItem) => {
    if (!content.media || content.media.length === 0) return <FiFileText size={24} />;
    const fileExt = content.media[0].file.split('.').pop()?.toLowerCase();
    if (['mp3', 'wav', 'ogg'].includes(fileExt || '')) return <FiHeadphones size={24} />;
    if (['jpg', 'png', 'jpeg'].includes(fileExt || '')) return <FiFilm size={24} />;
    return <FiFileText size={24} />;
  };

  return (
    <main className="relative min-h-screen bg-deep text-cream overflow-x-hidden">
      {/* پس‌زمینه متحرک */}
      <NeuralBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">

        {/* هدر صفحه */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-gold/20 pb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gold to-cream tracking-tight">
              محتوای اختصاصی من
            </h1>
            <p className="mt-2 text-cream/60 text-lg">
              دسترسی به فایل‌ها، پیام‌های صوتی و آموزش‌های ارسال شده توسط مربیان
            </p>
          </div>

          {/* جستجو */}
          <div className="w-full md:w-80 relative group">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 rounded-3xl bg-deep-2/30 animate-pulse border border-white/5"></div>
            ))}
          </div>
        ) : contents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-deep-2/20 rounded-[2rem] border border-dashed border-gold/10 backdrop-blur-sm">
            <FiFileText size={48} className="text-gold/20 mb-4" />
            <h3 className="text-xl font-bold text-white">هنوز محتوایی ندارید</h3>
            <p className="mt-2 text-cream/50">به محض ارسال محتوا توسط مربیان، اینجا نمایش داده می‌شود.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {contents.map((content) => (
              <ContentCard key={content.id} content={content} icon={getFileIcon(content)} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

// کامپوننت کارت محتوا با استایل لندینگ پیج
function ContentCard({ content, icon }: { content: ContentListItem; icon: React.ReactNode }) {
  return (
    <Link href={`/dashboard/member/contents/${content.id}`}>
      <div className="group relative h-full p-6 rounded-[2rem] bg-gradient-to-br from-deep-2/60 to-deep-2/30 border border-white/5 hover:border-gold/40 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-10px_rgba(201,162,77,0.15)] overflow-hidden">

        {/* افکت نوری پس‌زمینه */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-gold/5 rounded-full blur-3xl group-hover:bg-gold/10 transition-colors" />

        <div className="flex flex-col h-full">
          {/* هدر کارت */}
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-2xl bg-gold/10 text-gold border border-gold/20 group-hover:scale-110 transition-transform duration-300">
              {icon}
            </div>
            <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-white/5 text-cream/40 border border-white/5">
              {new Date(content.created_at).toLocaleDateString('fa-IR')}
            </span>
          </div>

          {/* متن */}
          <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-gold transition-colors">
            {content.title}
          </h3>
          <p className="text-sm text-cream/60 line-clamp-3 mb-6 flex-1">
            {content.text || "بدون توضیحات متنی"}
          </p>

          {/* فوتر کارت */}
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <span className="text-xs text-gold/80 font-medium truncate">
              {content.line.title}
            </span>
            <span className="text-xs text-cream/40 group-hover:translate-x-[-4px] transition-transform flex items-center gap-1">
              مشاهده
              <FiCalendar size={12} className="rotate-180" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}