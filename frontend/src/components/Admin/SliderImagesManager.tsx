"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { FiArrowDown, FiArrowUp, FiRefreshCw, FiTrash2 } from "react-icons/fi";
import FormSection from "@/forms/FormSection";
import GlassCard from "@/components/ui/GlassCard";
import { FileUploader, Input, Switch, Textarea } from "@/components/ui/inputs";
import {
  useCreateSliderImage,
  useDeleteSliderImage,
  useUpdateSliderImage,
} from "@/hooks/useSliders";
import { cn } from "@/lib/utils";
import { SLIDER_MAX_IMAGES } from "@/lib/sliderLimits";
import type { Slider, SliderImage, SliderImageUpdateInput } from "@/types";

// ── یک ردیف تصویر ─────────────────────────────────────────────────────
interface ImageRowProps {
  image: SliderImage;
  index: number;
  total: number;
  busy: boolean;
  onMove: (direction: -1 | 1) => void;
  onSave: (data: SliderImageUpdateInput, message?: string) => Promise<void>;
  onDelete: () => void;
}

function ImageRow({
  image,
  index,
  total,
  busy,
  onMove,
  onSave,
  onDelete,
}: ImageRowProps) {
  const [title, setTitle] = useState(image.caption_title);
  const [text, setText] = useState(image.caption_text);
  const replaceRef = useRef<HTMLInputElement>(null);

  const dirty = title !== image.caption_title || text !== image.caption_text;

  return (
    <li
      className={cn(
        "flex flex-col gap-5 rounded-2xl border border-cream/10 bg-deep/40 p-4 sm:flex-row",
        !image.is_active && "opacity-70",
      )}
    >
      {/* تصویر */}
      <div className="relative h-44 w-full shrink-0 overflow-hidden rounded-xl bg-deep-2 sm:h-40 sm:w-32">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.image}
          alt={image.caption_title}
          className="h-full w-full object-cover"
        />
        <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-deep/80 text-xs font-bold text-gold">
          {index + 1}
        </span>
      </div>

      {/* فیلدها */}
      <div className="min-w-0 flex-1 space-y-4">
        <Input
          label="عنوان کپشن"
          maxLength={100}
          placeholder="آمار بالینی"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Textarea
          label="متن کپشن"
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <Switch
            label="نمایش در سایت"
            checked={image.is_active}
            disabled={busy}
            onChange={(e) => onSave({ is_active: e.target.checked })}
            wrapperClassName="gap-3"
          />

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={busy || index === 0}
              onClick={() => onMove(-1)}
              aria-label="انتقال به بالا"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-cream/60 transition-colors hover:bg-gold/10 hover:text-gold disabled:opacity-30"
            >
              <FiArrowUp size={15} />
            </button>
            <button
              type="button"
              disabled={busy || index === total - 1}
              onClick={() => onMove(1)}
              aria-label="انتقال به پایین"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-cream/60 transition-colors hover:bg-gold/10 hover:text-gold disabled:opacity-30"
            >
              <FiArrowDown size={15} />
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => replaceRef.current?.click()}
              aria-label="جایگزینی تصویر"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-cream/60 transition-colors hover:bg-gold/10 hover:text-gold disabled:opacity-30"
            >
              <FiRefreshCw size={15} />
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={onDelete}
              aria-label="حذف تصویر"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-cream/60 transition-colors hover:bg-red-400/10 hover:text-red-300 disabled:opacity-30"
            >
              <FiTrash2 size={15} />
            </button>

            <input
              ref={replaceRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onSave({ image: file }, "تصویر جایگزین شد.");
                e.target.value = "";
              }}
            />
          </div>
        </div>

        {dirty && (
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setTitle(image.caption_title);
                setText(image.caption_text);
              }}
              className="rounded-lg px-4 py-2 text-xs text-cream/60 transition-colors hover:text-cream"
            >
              بازگردانی
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() =>
                onSave(
                  { caption_title: title, caption_text: text },
                  "کپشن ذخیره شد.",
                )
              }
              className="rounded-lg bg-gold px-5 py-2 text-xs font-bold text-deep disabled:opacity-60"
            >
              ذخیره کپشن
            </button>
          </div>
        )}
      </div>
    </li>
  );
}

// ── مدیریت کل تصاویر ──────────────────────────────────────────────────
export default function SliderImagesManager({ slider }: { slider: Slider }) {
  const createImage = useCreateSliderImage(slider.id);
  const updateImage = useUpdateSliderImage();
  const deleteImage = useDeleteSliderImage();

  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const sorted = [...slider.images].sort(
    (a, b) => a.order - b.order || a.id - b.id,
  );
  const busy = updateImage.isPending || deleteImage.isPending || uploading;

  const maxImages = SLIDER_MAX_IMAGES[slider.key];
  const remaining =
    maxImages === undefined ? Infinity : Math.max(maxImages - sorted.length, 0);
  const limitReached = remaining === 0;

  const handleFilesChange = (next: File[]) => {
    if (next.length > remaining) {
      toast.error(
        `این اسلایدر حداکثر ${maxImages} تصویر دارد؛ فقط ${remaining} تصویر دیگر می‌توانید اضافه کنید.`,
      );
      setFiles(next.slice(0, remaining));
      return;
    }
    setFiles(next);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);
    const startOrder = sorted.length
      ? Math.max(...sorted.map((i) => i.order)) + 1
      : 0;

    let uploaded = 0;
    try {
      for (const file of files) {
        await createImage.mutateAsync({
          image: file,
          order: startOrder + uploaded,
        });
        uploaded += 1;
      }
    } catch {
      // پیام خطا را هوک نشان داده است
    } finally {
      // فایل‌هایی که آپلود نشدند در لیست می‌مانند تا دوباره تلاش شود
      setFiles(files.slice(uploaded));
      setUploading(false);
    }
  };

  const handleSave = async (
    id: string,
    data: SliderImageUpdateInput,
    message?: string,
  ) => {
    try {
      await updateImage.mutateAsync({ id, data });
      if (message) toast.success(message);
    } catch {
      // پیام خطا را هوک نشان داده است
    }
  };

  const handleMove = async (from: number, direction: -1 | 1) => {
    const to = from + direction;
    if (to < 0 || to >= sorted.length) return;

    const next = [...sorted];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);

    // ترتیب را از نو ۰..n-1 می‌کنیم تا حتی با orderهای تکراری هم درست کار کند
    const changes = next
      .map((img, i) => ({ img, order: i }))
      .filter(({ img, order }) => img.order !== order);

    try {
      await Promise.all(
        changes.map(({ img, order }) =>
          updateImage.mutateAsync({ id: img.id, data: { order } }),
        ),
      );
    } catch {
      // پیام خطا را هوک نشان داده است
    }
  };

  const handleDelete = (image: SliderImage) => {
    if (window.confirm("این تصویر حذف شود؟")) {
      deleteImage.mutate(image.id);
    }
  };

  return (
    <GlassCard className="space-y-6 p-8">
      <FormSection
        title="افزودن تصویر"
        description={
          maxImages !== undefined
            ? `این اسلایدر حداکثر ${maxImages} تصویر می‌پذیرد (${sorted.length} از ${maxImages} استفاده شده). برای افزودن عکس جدید، یکی از عکس‌های فعلی را حذف کنید. نسبت پیشنهادی ۱ به ۱ (مربع).`
            : "تصاویر با ترتیب انتخاب‌شده به انتهای اسلایدر اضافه می‌شوند. نسبت پیشنهادی ۴ به ۵ (عمودی)."
        }
      >
        <FileUploader
          label="تصاویر جدید"
          accept="image/*"
          multiple
          maxSizeMB={5}
          value={files}
          onChange={handleFilesChange}
          disabled={uploading || limitReached}
        />
        {files.length > 0 && (
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={handleUpload}
              disabled={uploading}
              className="rounded-xl bg-gradient-to-b from-gold-soft to-gold px-6 py-2.5 text-sm font-bold text-deep shadow-gold disabled:opacity-60"
            >
              {uploading ? "در حال آپلود..." : `آپلود ${files.length} تصویر`}
            </button>
          </div>
        )}
      </FormSection>

      <FormSection
        title={`تصاویر اسلایدر (${sorted.length})`}
        description="ترتیب نمایش همین ترتیب لیست است. تصاویر غیرفعال در سایت نشان داده نمی‌شوند."
      >
        {sorted.length === 0 ? (
          <p className="py-6 text-center text-sm text-cream/50">
            هنوز تصویری اضافه نشده است. تا وقتی تصویر فعالی نباشد، در سایت کارت
            پیش‌فرض نمایش داده می‌شود.
          </p>
        ) : (
          <ul className="space-y-4">
            {sorted.map((image, index) => (
              <ImageRow
                key={image.id}
                image={image}
                index={index}
                total={sorted.length}
                busy={busy}
                onMove={(direction) => handleMove(index, direction)}
                onSave={(data, message) => handleSave(image.id, data, message)}
                onDelete={() => handleDelete(image)}
              />
            ))}
          </ul>
        )}
      </FormSection>
    </GlassCard>
  );
}
