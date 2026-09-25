"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { PiBrainDuotone } from "react-icons/pi";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

const points = [
  {
    title: "بدن آماده، ذهن ناآماده",
    text: "بسیاری از ورزشکاران سال‌ها روی بدن خود کار می‌کنند اما هرگز ذهن خود را تمرین نداده‌اند؛ همان جایی که نتیجه‌ی نهایی رقم می‌خورد.",
  },
  {
    title: "لحظه‌ی تصمیم، لحظه‌ی حقیقت",
    text: "در ثانیه‌های حساس مسابقه، این آمادگی ذهنی است که تعیین می‌کند مهارت‌های تمرین‌شده به میدان بیایند یا زیر فشار گم شوند.",
  },
  {
    title: "علمی، نه شعاری",
    text: "یوگبال متد تخصصی جدیدی است که برای اولین بار در دنیا برای هر ورزشکار بصورت اختصاصی طراحی می شود و توانایی و تعادل ذهنی , جسمی و تکنیکی شما را در عمل به حداکثر می‌رساند",
  },
];

export default function WhySportsPsychology() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section id="why" ref={ref} dir="rtl" className="relative px-6 py-28 md:px-10 lg:px-16">
      <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
        <div>
          <RevealOnScroll direction="right">
            <span className="text-caption font-semibold text-gold">چرا یوگبال</span>
          </RevealOnScroll>
          <RevealOnScroll direction="right" delay={0.08}>
            <h2 className="mt-4 max-w-lg text-h2 font-extrabold text-cream">
              مهارت فنی شما را به میدان می‌رساند، اما ذهن شما تعیین می‌کند چه اتفاقی در میدان بیفتد.
            </h2>
          </RevealOnScroll>

          <div className="mt-10 flex flex-col gap-8">
            {points.map((point, index) => (
              <RevealOnScroll key={point.title} direction="up" delay={0.15 + index * 0.1}>
                <div className="border-r-2 border-gold/30 pr-6">
                  <h3 className="text-h3 font-bold text-cream">{point.title}</h3>
                  <p className="mt-2 max-w-md text-body text-cream/60">{point.text}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>

        <motion.div style={{ y: imageY }} className="relative mx-auto w-full max-w-md">
          <RevealOnScroll direction="scale" duration={1.1}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border border-cream/10 bg-gradient-to-br from-deep-2 via-deep-3 to-deep shadow-soft">
              <div className="absolute inset-0 flex items-center justify-center">
                <PiBrainDuotone className="text-[9rem] text-gold/25" aria-hidden="true" />
              </div>
              <div className="absolute inset-x-8 bottom-8 rounded-2xl border border-cream/10 bg-deep/70 p-5 backdrop-blur-xl">
                <p className="text-caption text-gold">آمار بالینی</p>
                <p className="mt-1 text-body text-cream/70">
                  ۸۷٪ از ورزشکاران پس از سه ماه همراهی، بهبود محسوس در تمرکز رقابتی گزارش کرده‌اند.
                </p>
              </div>
            </div>
          </RevealOnScroll>
        </motion.div>
      </div>
    </section>
  );
}
