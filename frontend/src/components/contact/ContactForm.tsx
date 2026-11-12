"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import {
  createContactSchema,
  type ContactCreateFormValues,
} from "@/schemas/contact";
import { useLang } from "@/components/providers/LanguageProvider";
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
  const { t, dir, isRtl } = useLang();
  const c = t.contact;
  const ArrowIcon = isRtl ? FiArrowLeft : FiArrowRight;
  const { mutate: createContact, isPending } = useCreateContact();
  const schema = useMemo(() => createContactSchema(c.validation), [c.validation]);
  // toast در بیرون از محدوده‌ی dir لندینگ رندر می‌شود؛ جهت را دستی می‌دهیم
  const toastStyle = { direction: dir } as const;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ContactCreateFormValues>({
    resolver: zodResolver(schema),
  });

  const contactType = watch("contact_type");
  const messengerType = watch("messenger_type");

  const onSubmit = (data: ContactCreateFormValues) => {
    createContact(data, {
      onSuccess: () => {
        toast.success(c.success, { style: toastStyle });
        reset();
      },
      onError: () => {
        toast.error(c.error, { style: toastStyle });
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-4 sm:grid-cols-2"
      noValidate
    >
      <div className="sm:col-span-1">
        <label className="mb-1.5 block text-xs text-cream/50">{c.firstName}</label>
        <input
          className={inputClass}
          placeholder={c.firstName}
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
          {c.lastName}
        </label>
        <input
          className={inputClass}
          placeholder={c.lastName}
          {...register("last_name")}
        />
        {errors.last_name && (
          <p className="mt-1.5 text-xs text-red-400">
            {errors.last_name.message}
          </p>
        )}
      </div>

      <div className="sm:col-span-1">
        <label className="mb-1.5 block text-xs text-cream/50">{c.phone}</label>
        <input
          className={inputClass}
          placeholder={c.phonePlaceholder}
          dir="ltr"
          {...register("phone")}
        />
        {errors.phone && (
          <p className="mt-1.5 text-xs text-red-400">{errors.phone.message}</p>
        )}
      </div>

      <div className="sm:col-span-2">
        <label className="mb-1.5 block text-xs text-cream/50">{c.contactType}</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: "phone", label: c.contactTypes.phone },
            { value: "messenger", label: c.contactTypes.messenger },
            { value: "email", label: c.contactTypes.email },
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
            {c.messenger}
          </label>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {[
              { value: "whatsapp", label: c.messengers.whatsapp },
              { value: "telegram", label: c.messengers.telegram },
              { value: "eitaa", label: c.messengers.eitaa },
              { value: "rubika", label: c.messengers.rubika },
              { value: "bale", label: c.messengers.bale },
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
          <label className="mb-1.5 block text-xs text-cream/50">{c.email}</label>
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
          {c.message}
        </label>
        <input
          className={inputClass}
          placeholder={c.messagePlaceholder}
          {...register("message")}
        />
      </div>

      <div className="sm:col-span-2 mt-2">
        <Button
          type="submit"
          variant="primary"
          disabled={isPending}
          icon={<ArrowIcon aria-hidden="true" />}
          className={cn(
            "w-full justify-center sm:w-auto",
            isPending && "opacity-70",
          )}
        >
          {isPending ? c.submitting : c.submit}
        </Button>
      </div>
    </form>
  );
}
