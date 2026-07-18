"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FiArrowLeft } from "react-icons/fi";
import { bookingSchema, type BookingFormValues } from "@/schemas/booking";
import { submitBookingRequest } from "@/services/booking";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full rounded-xl border border-cream/15 bg-deep/60 px-4 py-3 text-sm text-cream placeholder:text-cream/30 transition-colors duration-300 focus:border-gold/60 focus:outline-none focus:ring-1 focus:ring-gold/40";

export default function BookingForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormValues>({ resolver: zodResolver(bookingSchema) });

  const mutation = useMutation({
    mutationFn: submitBookingRequest,
    onSuccess: () => {
      toast.success("درخواست شما ثبت شد. به‌زودی با شما تماس می‌گیریم.");
      reset();
    },
    onError: () => {
      toast.error("ثبت درخواست با خطا مواجه شد. لطفاً دوباره تلاش کنید.");
    },
  });

  const onSubmit = (values: BookingFormValues) => {
    mutation.mutate(values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} dir="rtl" className="grid gap-4 sm:grid-cols-2" noValidate>
      <div className="sm:col-span-1">
        <label htmlFor="fullName" className="mb-1.5 block text-xs text-cream/50">
          نام و نام‌خانوادگی
        </label>
        <input id="fullName" className={inputClass} placeholder="مثلاً سارا محمدی" {...register("fullName")} />
        {errors.fullName && <p className="mt-1.5 text-xs text-red-400">{errors.fullName.message}</p>}
      </div>

      <div className="sm:col-span-1">
        <label htmlFor="phone" className="mb-1.5 block text-xs text-cream/50">
          شماره موبایل
        </label>
        <input id="phone" className={inputClass} placeholder="۰۹۱۲۳۴۵۶۷۸۹" {...register("phone")} />
        {errors.phone && <p className="mt-1.5 text-xs text-red-400">{errors.phone.message}</p>}
      </div>

      <div className="sm:col-span-1">
        <label htmlFor="sport" className="mb-1.5 block text-xs text-cream/50">
          رشته‌ی ورزشی
        </label>
        <input id="sport" className={inputClass} placeholder="مثلاً کشتی، شنا، فوتبال" {...register("sport")} />
        {errors.sport && <p className="mt-1.5 text-xs text-red-400">{errors.sport.message}</p>}
      </div>

      <div className="sm:col-span-1">
        <label htmlFor="message" className="mb-1.5 block text-xs text-cream/50">
          توضیح کوتاه (اختیاری)
        </label>
        <input id="message" className={inputClass} placeholder="هدف اصلی شما از مشاوره" {...register("message")} />
        {errors.message && <p className="mt-1.5 text-xs text-red-400">{errors.message.message}</p>}
      </div>

      <div className="sm:col-span-2 mt-2">
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting || mutation.isPending}
          icon={<FiArrowLeft aria-hidden="true" />}
          className={cn("w-full justify-center sm:w-auto", (isSubmitting || mutation.isPending) && "opacity-70")}
        >
          {isSubmitting || mutation.isPending ? "در حال ارسال..." : "ارسال درخواست"}
        </Button>
      </div>
    </form>
  );
}
