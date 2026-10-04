"use client";

import { useParams, useRouter } from "next/navigation";
import {
  FiArrowRight,
  FiFileText,
  FiDownload,
  FiCalendar,
  FiMessageSquare,
  FiExternalLink,
} from "react-icons/fi";
import NeuralBackground from "@/components/background/NeuralBackground";
import CustomAudioPlayer from "@/components/ui/CustomAudioPlayer";
import ConversationChat from "@/components/chat/ConversationChat";
import { useMemberContentDetail } from "@/hooks/useContent";

const IMAGE_EXT = ["jpg", "jpeg", "png", "gif", "webp"];
const AUDIO_EXT = ["mp3", "wav", "ogg", "webm"];

function getExt(file?: string | null) {
  return file?.split("?")[0].split(".").pop()?.toLowerCase() ?? "";
}

function getKind(file?: string | null): "image" | "audio" | "file" {
  const ext = getExt(file);
  if (IMAGE_EXT.includes(ext)) return "image";
  if (AUDIO_EXT.includes(ext)) return "audio";
  return "file";
}

const card =
  "rounded-3xl border border-white/10 bg-deep-2/40 backdrop-blur-md shadow-xl shadow-black/20";

export default function MemberContentDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: content, isLoading } = useMemberContentDetail(params.id);

  if (isLoading) {
    return (
      <main className="relative min-h-screen bg-deep flex items-center justify-center">
        <NeuralBackground />
        <span className="relative h-10 w-10 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
      </main>
    );
  }

  if (!content) {
    return (
      <main className="relative min-h-screen bg-deep flex flex-col items-center justify-center gap-3 text-cream">
        <NeuralBackground />
        <p className="relative text-sm text-cream/50">
          محتوا یافت نشد یا دسترسی ندارید.
        </p>
        <button
          onClick={() => router.back()}
          className="relative text-sm text-gold hover:underline"
        >
          بازگشت
        </button>
      </main>
    );
  }

  const media = (content.media ?? []).filter((m) => m.file);
  const images = media.filter((m) => getKind(m.file) === "image");
  const audios = media.filter((m) => getKind(m.file) === "audio");
  const files = media.filter((m) => getKind(m.file) === "file");

  return (
    <main
      dir="rtl"
      className="relative min-h-screen overflow-x-hidden bg-deep pb-24 text-cream"
    >
      <NeuralBackground />

      <div className="relative z-10 mx-auto max-w-3xl space-y-8 px-5 py-10">
        {/* نوار بالا */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-2 text-sm text-cream/50 transition-colors hover:text-gold"
          >
            <FiArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
            بازگشت به آرشیو
          </button>

          <div className="flex items-center gap-2 rounded-full border border-gold/15 bg-gold/5 px-3 py-1 text-xs text-gold/70">
            <FiCalendar size={12} />
            {new Date(content.created_at).toLocaleDateString("fa-IR")}
          </div>
        </div>

        {/* عنوان */}
        <header className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-cream/60">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold/15 text-[10px] font-bold text-gold">
              {content.line.title.charAt(0)}
            </span>
            {content.line.title}
          </div>
          <h1 className="text-3xl font-extrabold leading-snug text-cream md:text-4xl">
            {content.title}
          </h1>
          <div className="h-[3px] w-14 rounded-full bg-gradient-to-l from-gold to-gold/20" />
        </header>

        {/* متن */}
        {content.text && (
          <section className={`${card} p-6 md:p-8`}>
            <p className="whitespace-pre-wrap text-[15px] leading-9 text-cream/85">
              {content.text}
            </p>
          </section>
        )}

        {/* تصاویر */}
        {images.length > 0 && (
          <section
            className={`grid gap-4 ${images.length > 1 ? "sm:grid-cols-2" : "grid-cols-1"}`}
          >
            {images.map((m) => (
              <figure
                key={m.id}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/20"
              >
                <img
                  src={m.file!}
                  alt={m.text || "تصویر"}
                  className="h-full max-h-[420px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="truncate text-sm text-cream">
                    {m.text || ""}
                  </span>
                  <a
                    href={m.file!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex shrink-0 items-center gap-1.5 text-xs text-gold transition-colors hover:text-cream"
                  >
                    <FiExternalLink size={13} />
                    تصویر اصلی
                  </a>
                </div>
              </figure>
            ))}
          </section>
        )}

        {/* صوت‌ها */}
        {audios.length > 0 && (
          <section className="space-y-4">
            {audios.map((m) => (
              <CustomAudioPlayer
                key={m.id}
                src={m.file!}
                title={m.text || "پیام صوتی مربی"}
              />
            ))}
          </section>
        )}

        {/* فایل‌ها */}
        {files.length > 0 && (
          <section className="space-y-3">
            {files.map((m) => (
              <a
                key={m.id}
                href={m.file!}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-deep-2/40 p-4 transition-all hover:border-gold/30 hover:bg-deep-2/70"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gold/20 bg-gold/10 text-gold">
                    <FiFileText size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-cream">
                      {m.text || "فایل ضمیمه"}
                    </p>
                    <p className="text-xs text-cream/40">
                      فرمت {getExt(m.file).toUpperCase() || "نامشخص"}
                    </p>
                  </div>
                </div>
                <FiDownload
                  size={18}
                  className="shrink-0 text-cream/30 transition-colors group-hover:text-gold"
                />
              </a>
            ))}
          </section>
        )}

        {/* گفتگو */}
        <section className={`${card} overflow-hidden`}>
          {content.conversation ? (
            <ConversationChat
              conversationId={content.conversation}
              role="member"
              title="گفتگو با مربی"
              isMine={(msg) => msg.is_mine}
              getSenderLabel={(msg, mine) => (mine ? "شما" : msg.sender || "مربی")}
              placeholder="سوال یا پاسخ خود را بنویسید..."
              emptyText="هنوز پیامی رد و بدل نشده است. اگر سوالی دارید بپرسید."
            />
          ) : (
            <div className="flex flex-col items-center gap-2 py-12 text-center">
              <FiMessageSquare size={26} className="text-gold/30" />
              <p className="text-sm text-cream/40">
                گفتگو برای این محتوا هنوز فعال نشده است.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}