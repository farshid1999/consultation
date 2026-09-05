"use client";

import { PiHeartbeatDuotone } from "react-icons/pi";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import ContactForm from "@/components/contact/ContactForm";
import BookingForm from "@/forms/BookingForm";

export default function CTA() {
  return (
    <section
      id="cta"
      dir="rtl"
      className="relative px-6 py-28 md:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-4xl overflow-hidden rounded-[2.5rem] border border-gold/20 bg-gradient-to-br from-deep-2 via-deep to-deep-3 p-10 shadow-soft md:p-14">
        <div className="text-center">
          <RevealOnScroll direction="scale">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10 text-2xl text-gold">
              <PiHeartbeatDuotone aria-hidden="true" />
            </span>
          </RevealOnScroll>
          <RevealOnScroll direction="up" delay={0.1}>
            <h2 className="mx-auto mt-6 max-w-xl text-h2 font-extrabold text-cream">
              اولین قدم برای ذهنی آماده‌ی قهرمانی را همین امروز بردارید
            </h2>
          </RevealOnScroll>
          <RevealOnScroll direction="up" delay={0.16}>
            <p className="mx-auto mt-4 max-w-md text-body text-cream/60">
              فرم زیر را پر کنید تا در اولین فرصت با شما برای هماهنگی جلسه‌ی
              آشنایی تماس بگیریم.
            </p>
          </RevealOnScroll>
        </div>

        <RevealOnScroll direction="up" delay={0.24} className="mt-10">
          <ContactForm />
        </RevealOnScroll>
      </div>
    </section>
  );
}
