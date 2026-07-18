"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useId, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { faqs } from "@/data/content";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import { cn } from "@/lib/utils";

export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);
  const baseId = useId();

  return (
    <section id="faq" dir="rtl" className="relative px-6 py-28 md:px-10 lg:px-16">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <RevealOnScroll direction="fade">
            <span className="text-caption font-semibold text-gold">پرسش‌های متداول</span>
          </RevealOnScroll>
          <RevealOnScroll direction="up" delay={0.08}>
            <h2 className="mx-auto mt-4 max-w-lg text-h2 font-extrabold text-cream">
              پاسخ به پرسش‌هایی که پیش از شروع دارید
            </h2>
          </RevealOnScroll>
        </div>

        <div className="mt-14 flex flex-col gap-4">
          {faqs.map((faq, index) => {
            const isOpen = openId === faq.id;
            const panelId = `${baseId}-panel-${index}`;
            const buttonId = `${baseId}-button-${index}`;
            return (
              <RevealOnScroll key={faq.id} direction="up" delay={index * 0.06}>
                <div
                  className={cn(
                    "overflow-hidden rounded-2xl border border-cream/10 bg-deep-2/50 transition-colors duration-300",
                    isOpen && "border-gold/30"
                  )}
                >
                  <button
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-right focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    <span className="text-base font-bold text-cream">{faq.question}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold"
                    >
                      <FiPlus aria-hidden="true" />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <p className="px-6 pb-6 text-sm leading-relaxed text-cream/60">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
