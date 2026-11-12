"use client";

import { motion } from "framer-motion";
import { benefitIcons } from "@/data/content";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import { useLang } from "@/components/providers/LanguageProvider";

export default function Benefits() {
  const { t } = useLang();

  return (
    <section id="benefits" className="relative px-6 py-28 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] border border-cream/10 bg-gradient-to-br from-deep-2 to-deep-3 p-10 shadow-soft md:p-16">
        <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="text-start">
            <RevealOnScroll direction="right">
              <span className="text-caption font-semibold text-gold">{t.benefits.eyebrow}</span>
            </RevealOnScroll>
            <RevealOnScroll direction="right" delay={0.08}>
              <h2 className="mt-4 text-h2 font-extrabold text-cream">
                {t.benefits.title}
              </h2>
            </RevealOnScroll>
            <RevealOnScroll direction="right" delay={0.16}>
              <p className="mt-5 max-w-md text-body text-cream/60">
                {t.benefits.intro}
              </p>
            </RevealOnScroll>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {t.benefits.items.map((benefit, index) => {
              const Icon = benefitIcons[benefit.id];
              return (
                <RevealOnScroll key={benefit.id} direction="up" delay={index * 0.1}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="h-full rounded-2xl border border-cream/10 bg-cream/[0.04] p-6 transition-colors duration-300 hover:border-gold/30"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/10 text-lg text-gold">
                      {Icon && <Icon aria-hidden="true" />}
                    </span>
                    <h3 className="mt-4 text-base font-bold text-cream">{benefit.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-cream/55">
                      {benefit.description}
                    </p>
                  </motion.div>
                </RevealOnScroll>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
