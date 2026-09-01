"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import {
  FiChevronLeft,
  FiFilm,
  FiUsers,
  FiCalendar,
  FiFileText,
  FiEye,
  FiList,
  FiDownload,
  FiHeadphones,
} from "react-icons/fi";
import { useContentDetail } from "@/hooks/useContent";
import UserDetailModal from "@/components/ui/modals/UserDetailModal";
import type { ContentRecipient } from "@/types";

function initials(firstName?: string, lastName?: string) {
  const a = (firstName?.trim()?.[0] ?? "").toUpperCase();
  const b = (lastName?.trim()?.[0] ?? "").toUpperCase();
  return a + b || "؟";
}

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

  const imageCount = content.media.filter((m) => {
    const ext = m.file?.split(".").pop()?.toLowerCase();
    return ["jpg", "jpeg", "png", "gif", "webp"].includes(ext || "");
  }).length;
  const audioCount = content.media.filter((m) => {
    const ext = m.file?.split(".").pop()?.toLowerCase();
    return ["mp3", "wav", "ogg", "webm"].includes(ext || "");
  }).length;
  const fileCount = content.media.length - imageCount - audioCount;

  // استایل مشترک برای کانتینرها: سبز دیپ‌تر + بوردر طلایی
  const containerStyle = "bg-[#0b2622] border border-gold/20 shadow-lg rounded-2xl overflow-hidden";

  return (
    <main dir="rtl" className="mx-auto max-w-5xl px-6 py-10 animate-in fade-in duration-500">

      {/* --- هدر: عنوان با هاله‌ی طلایی ملایم پشتش، مسیر ناوبری ساده --- */}
      <div className="relative mb-10 pb-7 border-b border-cream/10">
        <div
          className="pointer-events-none absolute -top-8 right-0 h-40 w-40 rounded-full opacity-[0.15] blur-3xl"
          style={{ background: "radial-gradient(circle, #C9A24D, transparent 70%)" }}
        />
        <div className="relative flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-cream/40 mb-3">
              <Link href="/staff/content" className="hover:text-gold transition-colors">محتواها</Link>
              <FiChevronLeft size={12} />
              <span className="text-cream/60">{content.title}</span>
            </div>
            <h1 className="text-3xl font-extrabold text-cream">{content.title}</h1>
            <div className="mt-3 h-[3px] w-12 rounded-full" style={{ background: "linear-gradient(90deg, #C9A24D, #E7CC8A)" }} />
          </div>
          <button
            onClick={() => router.push("/staff/content")}
            className="rounded-xl border border-cream/15 px-4 py-2 text-sm text-cream/60 hover:text-cream hover:border-gold/30 transition-all bg-[#0b2622]/50"
          >
            بازگشت به لیست
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* --- ستون اصلی --- */}
        <div className="lg:col-span-2 space-y-8">

          {/* متن محتوا */}
          <div className={`${containerStyle} relative p-7`}>
            <svg
              width="52" height="40" viewBox="0 0 52 40" fill="none"
              className="absolute top-5 left-6 opacity-[0.08]"
              aria-hidden="true"
            >
              <path
                d="M14.5 0C6.5 4.5 0 12.8 0 22.5 0 32.2 6.8 39 15.5 39c6.3 0 11-4.7 11-10.8 0-5.7-4-9.7-9-9.7-1 0-2 .1-2.8.4C15.8 12 20 6.5 26 2.5L14.5 0zM40 0c-8 4.5-14.5 12.8-14.5 22.5C25.5 32.2 32.3 39 41 39c6.3 0 11-4.7 11-10.8 0-5.7-4-9.7-9-9.7-1 0-2 .1-2.8.4C41.3 12 45.5 6.5 51.5 2.5L40 0z"
                fill="#C9A24D"
              />
            </svg>
            <h3 className="relative text-sm font-bold text-gold mb-4">متن محتوا</h3>
            <p className="relative text-cream/80 leading-loose whitespace-pre-wrap max-w-[62ch]">
              {content.text || <span className="text-cream/35 italic">متنی برای این محتوا ثبت نشده است.</span>}
            </p>
          </div>

          {/* رسانه‌ها */}
          {content.media.length > 0 && (
            <div className={`${containerStyle} p-7`}>
              <div className="mb-5 flex items-center justify-between flex-wrap gap-3">
                <h3 className="text-sm font-bold text-gold flex items-center gap-2">
                  <FiFilm /> فایل‌های ضمیمه
                </h3>
                <div className="flex items-center gap-3 text-xs text-cream/40">
                  {imageCount > 0 && <span>{imageCount} تصویر</span>}
                  {audioCount > 0 && <span>{audioCount} صدا</span>}
                  {fileCount > 0 && <span>{fileCount} فایل</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {content.media.map((m) => {
                  const fileExt = m.file?.split(".").pop()?.toLowerCase();
                  const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(fileExt || "");
                  const isAudio = ["mp3", "wav", "ogg", "webm"].includes(fileExt || "");

                  if (!m.file) {
                    return (
                      <div key={m.id} className={`rounded-xl border border-cream/10 ${containerStyle.replace('overflow-hidden', '')} p-4 text-sm text-cream/60`}>
                        {m.text || "بدون فایل"}
                      </div>
                    );
                  }

                  return (
                    <div
                      key={m.id}
                      className="group overflow-hidden rounded-xl border border-cream/10 bg-deep-2/40 transition-all duration-300 hover:border-gold/30 hover:-translate-y-0.5"
                    >
                      {isImage ? (
                        <div className="relative h-48 w-full overflow-hidden bg-black/20">
                          <img
                            src={m.file}
                            alt={m.text || "تصویر ضمیمه"}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                          <div className="absolute bottom-0 right-0 left-0 p-3">
                            <p className="text-sm font-medium text-cream truncate">{m.text || "تصویر بدون عنوان"}</p>
                            <a
                              href={m.file}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-gold-soft hover:text-cream transition-colors"
                            >
                              <FiDownload size={12} /> مشاهده‌ی اصل تصویر
                            </a>
                          </div>
                        </div>
                      ) : isAudio ? (
                        <div className="p-4 space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 shrink-0 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                              <FiHeadphones size={18} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-cream truncate">{m.text || "پیام صوتی"}</p>
                              <p className="text-[10px] text-cream/35">فرمت {fileExt?.toUpperCase()}</p>
                            </div>
                          </div>
                          <audio controls className="w-full h-9 rounded-lg opacity-85 hover:opacity-100 transition-opacity">
                            <source src={m.file} type={`audio/${fileExt}`} />
                            مرورگر شما از پخش صدا پشتیبانی نمی‌کند.
                          </audio>
                        </div>
                      ) : (
                        <div className="p-4 flex items-start gap-4">
                          <div className="h-11 w-11 shrink-0 rounded-lg bg-cream/5 border border-cream/10 flex items-center justify-center text-cream/50">
                            <FiFileText size={20} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-cream/85 mb-1 truncate">{m.text || "فایل ضمیمه"}</p>
                            <p className="text-xs text-cream/35 mb-3">فرمت {fileExt?.toUpperCase() || "نامشخص"}</p>
                            <a
                              href={m.file}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-lg border border-cream/10 px-3 py-1.5 text-xs font-medium text-cream/60 hover:border-gold/30 hover:text-gold transition-all"
                            >
                              <FiDownload size={12} /> دانلود فایل
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* --- ستون کناری: چسبان هنگام اسکرول --- */}
        <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">

          <div className={`${containerStyle} p-5 space-y-4`}>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-gold/10 flex items-center justify-center text-gold shrink-0">
                <FiList size={16} />
              </div>
              <div>
                <p className="text-[11px] text-cream/40">بخش مربوطه</p>
                <p className="text-sm font-bold text-cream">{content.line.title}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-gold/10 flex items-center justify-center text-gold shrink-0">
                <FiCalendar size={16} />
              </div>
              <div>
                <p className="text-[11px] text-cream/40">تاریخ ایجاد</p>
                <p className="text-sm text-cream/80">{new Date(content.created_at).toLocaleDateString("fa-IR")}</p>
              </div>
            </div>
          </div>

          <div className={`${containerStyle} p-5`}>
            <h3 className="text-sm font-bold text-gold mb-4 flex items-center gap-2">
              <FiUsers /> گیرندگان ({content.recipients.length})
            </h3>

            {content.recipients.length === 0 ? (
              <p className="text-sm text-cream/35 italic py-4 text-center">هنوز گیرنده‌ای ثبت نشده است.</p>
            ) : (
              <div className="space-y-1.5 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
                {content.recipients.map((rec) => (
                  <div
                    key={rec.id}
                    className="group flex items-center justify-between gap-2 p-2 rounded-lg border border-transparent hover:border-gold/20 hover:bg-gold/[0.05] transition-colors"
                  >
                    <div
                      className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                      onClick={() => handleViewUser(rec)}
                    >
                      <div className="h-8 w-8 shrink-0 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-[11px] font-bold text-gold group-hover:bg-gold/20 transition-colors">
                        {initials(rec.member.user.first_name, rec.member.user.last_name)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-cream/85 truncate group-hover:text-gold transition-colors">
                          {rec.member.user.first_name} {rec.member.user.last_name}
                        </p>
                        <p className="text-[10px] text-cream/35 truncate">مشاهده‌ی پروفایل</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <Link
                        href={`/staff/members/${rec.member.id}/contents?name=${rec.member.user.first_name}&line=${content.line.title}`}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-cream/35 hover:bg-gold/10 hover:text-gold transition-colors"
                        title="مشاهده‌ی سوابق دریافتی"
                      >
                        <FiList size={14} />
                      </Link>
                      <button
                        onClick={() => handleViewUser(rec)}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-cream/35 hover:bg-gold/10 hover:text-gold transition-colors"
                        title="جزئیات کاربر"
                      >
                        <FiEye size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      <UserDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
      />

    </main>
  );
}