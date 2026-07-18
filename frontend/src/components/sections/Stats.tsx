"use client";

import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { stats } from "@/data/content";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import { toPersianDigits } from "@/lib/utils";
import type { StatItem } from "@/types";

function StatCounter({ stat }: { stat: StatItem }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: 1800, bounce: 0 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (isInView) motionValue.set(stat.value);
  }, [isInView, motionValue, stat.value]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => setDisplay(Math.round(latest)));
    return () => unsubscribe();
  }, [spring]);

  return (
    <p ref={ref} className="text-[3.25rem] font-extrabold leading-none text-cream">
      {toPersianDigits(display)}
      <span className="text-gold">{stat.suffix}</span>
    </p>
  );
}

export default function Stats() {
  return (
    <section id="stats" dir="rtl" className="relative px-6 py-28 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <RevealOnScroll direction="fade">
            <span className="text-caption font-semibold text-gold">آمار و دستاورد ورزشکاران</span>
          </RevealOnScroll>
          <RevealOnScroll direction="up" delay={0.08}>
            <h2 className="mx-auto mt-4 max-w-xl text-h2 font-extrabold text-cream">
              اعدادی که پشت‌شان تمرین واقعی است
            </h2>
          </RevealOnScroll>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <RevealOnScroll key={stat.id} direction="scale" delay={index * 0.1}>
              <motion.div
                whileHover={{ y: -4 }}
                className="rounded-3xl border border-cream/10 bg-deep-2/50 p-8 text-center shadow-soft"
              >
                <StatCounter stat={stat} />
                <p className="mt-3 text-sm text-cream/55">{stat.label}</p>
              </motion.div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
