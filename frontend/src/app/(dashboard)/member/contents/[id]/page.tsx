"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FiArrowRight, FiFilm, FiFileText, FiDownload, FiCalendar } from "react-icons/fi";
import NeuralBackground from "@/components/background/NeuralBackground";
import { useMemberContentDetail } from "@/hooks/useContent";
import CustomAudioPlayer from "@/components/ui/CustomAudioPlayer";
import type { ContentDetail } from "@/types";

export default function MemberContentDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: content, isLoading } = useMemberContentDetail(params.id);

  if (isLoading) {
    return (
      <main className="relative min-h-screen bg-deep flex items-center justify-center">
        <NeuralBackground />
        <span className="spinner-brand h-10 w-10 animate-spin rounded-full border-2 border-gold/30 border-t-gold"></span>
      </main>
    );
  }

  if (!content) return null;

  return (
    <main className="relative min-h-screen bg-deep text-cream overflow-x-hidden pb-20">
      <NeuralBackground />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">

        {/* هدر بازگشت و تاریخ */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-cream/50 hover:text-gold transition-colors group"
          >
            <FiArrowRight size={16} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
            بازگشت به آرشیو
          </button>
          <div className="flex items-center gap-2 text-xs text-gold/60 bg-gold/5 px-3 py-1 rounded-full border border-gold/10">
            <FiCalendar size={12} />
            {new Date(content.created_at).toLocaleDateString('fa-IR')}
          </div>
        </div>

        {/* عنوان اصلی */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-cream to-gold mb-6 leading-tight">
          {content.title}
        </h1>

        {/* بخش مدیا (صوت یا تصویر) */}
        {content.media && content.media.length > 0 && (
          <div className="mb-10 space-y-6">
            {content.media.map((m) => {
              const fileExt = m.file.split('.').pop()?.toLowerCase();
              const isAudio = ['mp3', 'wav', 'ogg', 'webm'].includes(fileExt || '');
              const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(fileExt || '');

              return (
                <div key={m.id} className="animate-fade-in-up">
                  {isAudio ? (
                    <CustomAudioPlayer src={m.file} title={m.text || "پیام صوتی مربی"} />
                  ) : isImage ? (
                    <div className="relative rounded-2xl overflow-hidden border border-gold/20 shadow-2xl group">
                      <img src={m.file} alt={m.text || ""} className="w-full h-auto object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                        <a
                          href={m.file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-white text-sm font-medium hover:text-gold transition-colors"
                        >
                          <FiDownload size={16} /> دانلود تصویر اصلی
                        </a>
                      </div>
                    </div>
                  ) : (
                    <a
                      href={m.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 rounded-xl bg-deep-2/40 border border-cream/10 hover:border-gold/30 hover:bg-deep-2/60 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                          <FiFileText size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{m.text || "فایل ضمیمه"}</p>
                          <p className="text-xs text-cream/40">فرمت: {fileExt?.toUpperCase()}</p>
                        </div>
                      </div>
                      <FiDownload className="text-cream/30 group-hover:text-gold transition-colors" />
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* متن محتوا */}
        <div className="prose prose-invert prose-lg max-w-none">
          <div className="relative pl-6 border-l-2 border-gold/30">
            <p className="text-cream/80 leading-loose whitespace-pre-wrap text-justify">
              {content.text}
            </p>
          </div>
        </div>

        {/* فوتر بخش */}
        <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gold/10 flex items-center justify-center text-gold text-xs">
              {content.line.title.charAt(0)}
            </div>
            <span className="text-sm text-cream/60">ارسال شده از بخش <span className="text-gold">{content.line.title}</span></span>
          </div>
        </div>

      </div>
    </main>
  );
}