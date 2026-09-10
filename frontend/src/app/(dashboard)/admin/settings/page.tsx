"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { FiMusic, FiPlay, FiPause } from "react-icons/fi";
import { useBackgroundMusic, useUpdateBackgroundMusic } from "@/hooks/useSettings";
import FormSection from "@/forms/FormSection";
import GlassCard from "@/components/ui/GlassCard";

export default function AdminSettingsPage() {
  const { data: currentMusic, isLoading } = useBackgroundMusic();
  const updateMusic = useUpdateBackgroundMusic();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { control, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      is_active: currentMusic?.is_active || false,
      music: null as File | null,
    },
  });

  const selectedFile = watch("music");

  // ایجاد لینک پیش‌نمایش برای فایل انتخاب شده
  useState(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(currentMusic?.music || null);
    }
  });

  const onSubmit = (data: any) => {
    const formData = new FormData();
    formData.append("is_active", String(data.is_active));
    if (data.music) {
      formData.append("music", data.music);
    }

    updateMusic.mutate(formData);
  };

  if (isLoading) {
    return <div className="p-10 text-center text-cream">در حال بارگذاری...</div>;
  }

  return (
    <main dir="rtl" className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-extrabold text-cream mb-8">تنظیمات عمومی</h1>

      <GlassCard className="p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

          <FormSection title="موزیک پس‌زمینه" description="فایل صوتی برای پخش در کل سایت">

            {/* وضعیت فعال/غیرفعال */}
            <div className="flex items-center gap-3 mb-6">
              <label className="relative inline-flex items-center cursor-pointer">
                <Controller
                  name="is_active"
                  control={control}
                  render={({ field }) => (
                    <>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
                      <span className="ml-3 text-sm font-medium text-cream">پخش موزیک فعال باشد</span>
                    </>
                  )}
                />
              </label>
            </div>

            {/* آپلود فایل */}
            <div className="border-2 border-dashed border-cream/20 rounded-xl p-6 text-center hover:border-gold/50 transition-colors">
              <Controller
                name="music"
                control={control}
                render={({ field }) => (
                  <div className="space-y-4">
                    <FiMusic size={40} className="mx-auto text-cream/40" />
                    <p className="text-sm text-cream/60">فایل MP3 جدید را اینجا بکشید یا کلیک کنید</p>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                      className="block w-full text-sm text-cream/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gold/10 file:text-gold hover:file:bg-gold/20"
                    />
                  </div>
                )}
              />
            </div>

            {/* پیش‌نمایش پخش */}
            {(previewUrl || currentMusic?.music) && (
              <div className="mt-6 p-4 bg-deep-2/50 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                    <FiMusic size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-cream">فایل فعلی</p>
                    <p className="text-xs text-cream/50 truncate max-w-[200px]">
                      {selectedFile ? selectedFile.name : "موزیک ذخیره شده"}
                    </p>
                  </div>
                </div>
                <audio controls src={previewUrl || currentMusic?.music} className="h-8 w-48" />
              </div>
            )}

          </FormSection>

          <div className="flex justify-end pt-4 border-t border-cream/10">
            <button
              type="submit"
              disabled={updateMusic.isPending}
              className="rounded-xl bg-gradient-to-b from-gold-soft to-gold px-8 py-3 text-sm font-bold text-deep shadow-gold transition-opacity disabled:opacity-60"
            >
              {updateMusic.isPending ? "در حال ذخیره..." : "ذخیره تنظیمات"}
            </button>
          </div>

        </form>
      </GlassCard>
    </main>
  );
}