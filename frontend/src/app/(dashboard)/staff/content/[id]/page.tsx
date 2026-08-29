"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import {
  FiArrowRight,
  FiFilm,
  FiUsers,
  FiUser,
  FiCalendar,
  FiFileText,
  FiEye,
  FiList,
  FiDownload,
  FiHeadphones
} from "react-icons/fi";
import { useContentDetail } from "@/hooks/useContent";
import UserDetailModal from "@/components/ui/modals/UserDetailModal";
import type { ContentRecipient } from "@/types";

export default function ContentDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: content, isLoading } = useContentDetail(params.id);

  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewUser = (recipient: ContentRecipient) => {
    setSelectedUser(recipient.member.user);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <main dir="rtl" className="mx-auto max-w-5xl px-6 py-10 flex justify-center">
        <span className="spinner-brand h-8 w-8 animate-spin rounded-full border-2 inline-block"></span>
      </main>
    );
  }

  if (!content) return null;

  return (
    <main dir="rtl" className="mx-auto max-w-5xl px-6 py-10">

      {/* هدر */}
      <div className="mb-8 flex items-center justify-between border-b border-cream/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-cream/40 mb-2">
            <Link href="/staff/content" className="hover:text-gold">محتواها</Link>
            <FiArrowRight size={12} className="rotate-180" />
            <span>جزئیات</span>
          </div>
          <h1 className="page-title text-3xl font-extrabold text-white">{content.title}</h1>
        </div>
        <button
          onClick={() => router.back()}
          className="rounded-xl border border-cream/20 px-4 py-2 text-sm text-cream/60 hover:text-white hover:border-gold/30 transition-all"
        >
          بازگشت
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ستون اصلی: متن و مدیا */}
        <div className="lg:col-span-2 space-y-8">

          {/* کارت توضیحات */}
          <div className="card p-6">
            <h3 className="text-lg font-bold text-gold mb-4 flex items-center gap-2">
              <FiFileText /> متن محتوا
            </h3>
            <p className="text-cream/80 leading-loose whitespace-pre-wrap">
              {content.text || "متنی ثبت نشده است."}
            </p>
          </div>

          {/* کارت رسانه‌ها */}
          {content.media.length > 0 && (
            <div className="card p-6">
              <h3 className="text-lg font-bold text-gold mb-4 flex items-center gap-2">
                <FiFilm /> فایل‌های ضمیمه ({content.media.length})
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {content.media.map((m) => {
                  // تشخیص نوع فایل بر اساس پسوند
                  const fileExt = m.file.split('.').pop()?.toLowerCase();
                  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExt || '');
                  const isAudio = ['mp3', 'wav', 'ogg', 'webm'].includes(fileExt || '');

                  return (
                    <div
                      key={m.id}
                      className="group relative overflow-hidden rounded-xl border border-cream/10 bg-deep-2/50 hover:border-gold/30 transition-all duration-300 shadow-sm"
                    >
                      {isImage ? (
                        // حالت تصویر
                        <div className="relative h-48 w-full overflow-hidden bg-black/20">
                          <img
                            src={m.file}
                            alt={m.text || "تصویر ضمیمه"}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                          <div className="absolute bottom-0 right-0 left-0 p-3">
                            <p className="text-sm font-medium text-white truncate">{m.text || "تصویر بدون عنوان"}</p>
                            <a
                              href={m.file}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 inline-flex items-center gap-1.5 text-xs text-gold hover:text-white transition-colors"
                            >
                              <FiDownload size={12} /> دانلود اصلی
                            </a>
                          </div>
                        </div>
                      ) : (
                        // حالت غیر تصویر (صوت یا فایل)
                        <div className="p-4 flex flex-col h-full justify-between">
                          {isAudio ? (
                            // حالت صوتی
                            <div className="space-y-3">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="h-10 w-10 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                                  <FiHeadphones size={20} />
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-white line-clamp-1">{m.text || "پیام صوتی"}</p>
                                  <p className="text-[10px] text-cream/40">فرمت: {fileExt?.toUpperCase()}</p>
                                </div>
                              </div>

                              <audio controls className="w-full h-9 rounded-lg opacity-80 hover:opacity-100 transition-opacity [&::-webkit-media-controls-panel]:bg-deep [&::-webkit-media-controls-current-time-display]:text-gold">
                                <source src={m.file} type={`audio/${fileExt}`} />
                                مرورگر شما از پخش صدا پشتیبانی نمی‌کند.
                              </audio>
                            </div>
                          ) : (
                            // حالت سایر فایل‌ها
                            <div className="flex items-start gap-4">
                              <div className="h-12 w-12 shrink-0 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                                <FiFileText size={24} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white mb-1 line-clamp-2">{m.text || "فایل ضمیمه"}</p>
                                <p className="text-xs text-cream/40 mb-3">فرمت: {fileExt?.toUpperCase() || "نامشخص"}</p>

                                <a
                                  href={m.file}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 rounded-lg bg-cream/5 px-3 py-1.5 text-xs font-medium text-cream/70 hover:bg-gold/10 hover:text-gold transition-all border border-cream/10 hover:border-gold/30"
                                >
                                  <FiDownload size={12} />
                                  دانلود فایل
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ستون کناری: اطلاعات متا و گیرندگان */}
        <div className="space-y-6">

          {/* اطلاعات کلی */}
          <div className="card p-5 space-y-4">
            <div>
              <p className="text-xs text-cream/40 mb-1">بخش مربوطه</p>
              <p className="text-sm font-bold text-white">{content.line.title}</p>
            </div>
            <div>
              <p className="text-xs text-cream/40 mb-1">تاریخ ایجاد</p>
              <div className="flex items-center gap-2 text-sm text-cream/70">
                <FiCalendar size={14} />
                {new Date(content.created_at).toLocaleDateString('fa-IR')}
              </div>
            </div>
          </div>

          {/* لیست گیرندگان */}
          <div className="card p-5">
            <h3 className="text-sm font-bold text-gold mb-4 flex items-center gap-2">
              <FiUsers /> گیرندگان ({content.recipients.length})
            </h3>
            <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
              {content.recipients.map((rec) => (
                <div
                  key={rec.id}
                  className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors group border border-transparent hover:border-cream/10"
                >
                  {/* اطلاعات کاربر */}
                  <div className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer" onClick={() => handleViewUser(rec)}>
                    <div className="h-8 w-8 rounded-full bg-deep border border-cream/10 flex items-center justify-center text-xs text-cream/60 group-hover:border-gold/30 group-hover:text-gold">
                      <FiUser size={14} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-cream/80 truncate hover:text-gold transition-colors">
                        {rec.member.user.first_name} {rec.member.user.last_name}
                      </p>
                      <p className="text-[10px] text-cream/40 truncate">مشاهده پروفایل کامل</p>
                    </div>
                  </div>

                  {/* دکمه‌های عملیات */}
                  <div className="flex items-center gap-1">
                    {/* 1. دکمه مشاهده سوابق محتوا (لینک) */}
                    <Link
                      href={`/staff/members/${rec.member.id}/contents?name=${rec.member.user.first_name}&line=${content.line.title}`}
                      className="flex h-8 w-8 items-center justify-center rounded-md text-cream/40 hover:bg-blue-500/10 hover:text-blue-400 transition-colors"
                      title="مشاهده سوابق دریافتی"
                    >
                      <FiList size={14} />
                    </Link>

                    {/* 2. دکمه باز کردن مودال جزئیات (آیکون چشم) */}
                    <button
                      onClick={() => handleViewUser(rec)}
                      className="flex h-8 w-8 items-center justify-center rounded-md text-cream/40 hover:bg-gold/10 hover:text-gold transition-colors"
                      title="جزئیات کاربر"
                    >
                      <FiEye size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* مودال جزئیات کاربر */}
      <UserDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
      />

    </main>
  );
}