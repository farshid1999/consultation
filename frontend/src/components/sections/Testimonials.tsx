"use client";

import { motion } from "framer-motion";
import { FiUser } from "react-icons/fi";
import { testimonials } from "@/data/content";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

export default function Testimonials() {
  return (
    <section id="testimonials" dir="rtl" className="relative px-6 py-28 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-end text-right">
          <RevealOnScroll direction="right">
            <span className="text-caption font-semibold text-gold">صدای ورزشکاران</span>
          </RevealOnScroll>
          <RevealOnScroll direction="right" delay={0.08}>
            <h2 className="mt-4 max-w-xl text-h2 font-extrabold text-cream">
              روایت‌هایی از تغییری که در زمین دیده شد
            </h2>
          </RevealOnScroll>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <RevealOnScroll key={testimonial.id} direction="up" delay={index * 0.12}>
              <motion.div
                whileHover={{ y: -6, rotate: index % 2 === 0 ? -0.6 : 0.6 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="flex h-full flex-col justify-between rounded-3xl border border-cream/10 bg-deep-2/60 p-8 shadow-soft"
              >
                <p className="text-body leading-loose text-cream/75">«{testimonial.quote}»</p>
                <div className="mt-8 flex items-center gap-3 border-t border-cream/10 pt-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold/10 text-lg text-gold">
                    <FiUser aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-cream">{testimonial.name}</p>
                    <p className="text-xs text-cream/50">
                      {testimonial.role} · {testimonial.sport}
                    </p>
                  </div>
                </div>
              </motion.div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
