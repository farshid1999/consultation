"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FiArrowLeft } from "react-icons/fi";
import {
  contactCreateSchema,
  type ContactCreateFormValues,
} from "@/schemas/contact";
import { useCreateContact } from "@/hooks/useContact";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full rounded-xl border border-cream/15 bg-deep/60 px-4 py-3 text-sm text-cream placeholder:text-cream/30 transition-colors duration-300 focus:border-gold/60 focus:outline-none focus:ring-1 focus:ring-gold/40";

const radioClass = (selected: boolean) =>
  cn(
    "flex items-center justify-center px-3 py-2.5 rounded-xl border text-sm cursor-pointer transition-colors duration-300",
    selected
      ? "border-gold/60 bg-gold/10 text-gold"
      : "border-cream/15 bg-deep/60 text-cream/50 hover:border-cream/30",
  );

export default function ContactForm() {
  const { mutate: createContact, isPending } = useCreateContact();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ContactCreateFormValues>({
    resolver: zodResolver(contactCreateSchema),
  });

  const contactType = watch("contact_type");
  const messengerType = watch("messenger_type");

  const onSubmit = (data: ContactCreateFormValues) => {
    console.log("submitted:", data);
    createContact(data, {
      onSuccess: () => {
        toast.success("درخواست شما ثبت شد. به‌زودی با شما تماس می‌گیریم.");
        reset();
      },
      onError: () => {
        toast.error("ثبت درخواست با خطا مواجه شد. لطفاً دوباره تلاش کنید.");
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, (errors) =>
        console.log("validation errors:", errors),
      )}
      dir="rtl"
      className="grid gap-4 sm:grid-cols-2"
      noValidate
    >
      <div className="sm:col-span-1">
        <label className="mb-1.5 block text-xs text-cream/50">نام</label>
        <input
          className={inputClass}
          placeholder="نام"
          {...register("first_name")}
        />
        {errors.first_name && (
          <p className="mt-1.5 text-xs text-red-400">
            {errors.first_name.message}
          </p>
        )}
      </div>

      <div className="sm:col-span-1">
        <label className="mb-1.5 block text-xs text-cream/50">
          نام خانوادگی
        </label>
        <input
          className={inputClass}
          placeholder="نام خانوادگی"
          {...register("last_name")}
        />
        {errors.last_name && (
          <p className="mt-1.5 text-xs text-red-400">
            {errors.last_name.message}
          </p>
        )}
      </div>

      <div className="sm:col-span-1">
        <label className="mb-1.5 block text-xs text-cream/50">شماره تماس</label>
        <input
          className={inputClass}
          placeholder="09xxxxxxxxx"
          dir="ltr"
          {...register("phone")}
        />
        {errors.phone && (
          <p className="mt-1.5 text-xs text-red-400">{errors.phone.message}</p>
        )}
      </div>

      <div className="sm:col-span-2">
        <label className="mb-1.5 block text-xs text-cream/50">نوع ارتباط</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: "phone", label: "تماس تلفنی" },
            { value: "messenger", label: "پیام‌رسان" },
            { value: "email", label: "ایمیل" },
          ].map((option) => (
            <label
              key={option.value}
              className={radioClass(contactType === option.value)}
            >
              <input
                type="radio"
                value={option.value}
                {...register("contact_type")}
                className="hidden"
              />
              {option.label}
            </label>
          ))}
        </div>
        {errors.contact_type && (
          <p className="mt-1.5 text-xs text-red-400">
            {errors.contact_type.message}
          </p>
        )}
      </div>

      {contactType === "messenger" && (
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs text-cream/50">
            پیام‌رسان
          </label>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {[
              { value: "whatsapp", label: "واتساپ" },
              { value: "telegram", label: "تلگرام" },
              { value: "eitaa", label: "ایتا" },
              { value: "rubika", label: "روبیکا" },
              { value: "bale", label: "بله" },
            ].map((option) => (
              <label
                key={option.value}
                className={radioClass(messengerType === option.value)}
              >
                <input
                  type="radio"
                  value={option.value}
                  {...register("messenger_type")}
                  className="hidden"
                />
                {option.label}
              </label>
            ))}
          </div>
          {errors.messenger_type && (
            <p className="mt-1.5 text-xs text-red-400">
              {errors.messenger_type.message}
            </p>
          )}
        </div>
      )}

      {contactType === "email" && (
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs text-cream/50">ایمیل</label>
          <input
            className={inputClass}
            placeholder="example@email.com"
            dir="ltr"
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1.5 text-xs text-red-400">
              {errors.email.message}
            </p>
          )}
        </div>
      )}

      <div className="sm:col-span-2">
        <label className="mb-1.5 block text-xs text-cream/50">
          پیام (اختیاری)
        </label>
        <input
          className={inputClass}
          placeholder="توضیحات یا سوالات خود را بنویسید..."
          {...register("message")}
        />
      </div>

      <div className="sm:col-span-2 mt-2">
        <Button
          type="submit"
          variant="primary"
          disabled={isPending}
          icon={<FiArrowLeft aria-hidden="true" />}
          className={cn(
            "w-full justify-center sm:w-auto",
            isPending && "opacity-70",
          )}
        >
          {isPending ? "در حال ارسال..." : "ارسال درخواست"}
        </Button>
      </div>
    </form>
  );
}
