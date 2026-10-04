"use client";

import { useEffect, useMemo, useState } from "react";
import { useController, type Control } from "react-hook-form";
import { FiCamera, FiTrash2, FiUser } from "react-icons/fi";

const MAX_SIZE = 2 * 1024 * 1024; // ۲ مگابایت

type Props = {
  control: Control<any>;
  name?: string;
  /** آدرس عکس فعلی (فقط در حالت ویرایش) */
  currentUrl?: string | null;
};

export default function AvatarUpload({
  control,
  name = "user.avatar",
  currentUrl,
}: Props) {
  const { field, fieldState } = useController({ control, name });
  const [localError, setLocalError] = useState<string | null>(null);

  const file: File | null = field.value instanceof File ? field.value : null;

  const preview = useMemo(
    () => (file ? URL.createObjectURL(file) : currentUrl || null),
    [file, currentUrl],
  );

  useEffect(() => {
    return () => {
      if (file && preview) URL.revokeObjectURL(preview);
    };
  }, [file, preview]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0];
    e.target.value = "";
    if (!picked) return;

    if (!picked.type.startsWith("image/")) {
      setLocalError("فقط فایل تصویر مجاز است.");
      return;
    }
    if (picked.size > MAX_SIZE) {
      setLocalError("حجم تصویر باید کمتر از ۲ مگابایت باشد.");
      return;
    }
    setLocalError(null);
    field.onChange(picked);
  };

  const error = localError || fieldState.error?.message;

  return (
    <div className="flex items-center gap-5">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border border-gold/20 bg-gold/10">
        {preview ? (
          <img src={preview} alt="عکس پروفایل" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gold/40">
            <FiUser size={36} />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-cream/80">عکس پروفایل</p>
        <div className="flex items-center gap-2">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-cream/10 bg-cream/5 px-4 py-2 text-xs text-cream/70 transition-colors hover:border-gold/30 hover:text-gold">
            <FiCamera size={14} />
            {preview ? "تغییر عکس" : "انتخاب عکس"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleChange}
            />
          </label>
          {file && (
            <button
              type="button"
              onClick={() => field.onChange(null)}
              className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs text-cream/40 transition-colors hover:text-red-400"
            >
              <FiTrash2 size={14} />
              حذف
            </button>
          )}
        </div>
        <p className="text-[11px] text-cream/30">JPG یا PNG، حداکثر ۲ مگابایت</p>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    </div>
  );
}