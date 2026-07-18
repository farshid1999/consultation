"use client";

import { motion } from "framer-motion";
import { services } from "@/data/content";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import { cn } from "@/lib/utils";
import type { ServiceItem } from "@/types";

function ServiceCard({ service, index }: { service: ServiceItem; index: number }) {
  const Icon = service.icon;

  return (
    <RevealOnScroll
      direction={index % 3 === 0 ? "up" : index % 3 === 1 ? "left" : "right"}
      delay={(index % 4) * 0.08}
      className="h-full"
    >
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className={cn(
          "group relative h-full overflow-hidden rounded-3xl border border-cream/10 bg-deep-2/60 p-7 shadow-soft transition-colors duration-300 hover:border-gold/40",
          service.layout === "overlap" && "bg-gradient-to-br from-deep-3 to-deep-2"
        )}
      >
        {/* soft gold glow on hover */}
        <div className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-gold/0 blur-3xl transition-colors duration-500 group-hover:bg-gold/10" />

        {service.layout === "stacked" && (
          <div className="relative flex flex-col items-start gap-5">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10 text-2xl text-gold transition-transform duration-500 group-hover:-rotate-6">
              <Icon aria-hidden="true" />
            </span>
            <h3 className="text-h3 font-bold text-cream">{service.title}</h3>
            <p className="text-sm leading-relaxed text-cream/60">{service.description}</p>
          </div>
        )}

        {service.layout === "inline" && (
          <div className="relative flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/30 text-lg text-gold transition-transform duration-500 group-hover:scale-110">
                <Icon aria-hidden="true" />
              </span>
              <h3 className="text-h3 font-bold text-cream">{service.title}</h3>
            </div>
            <p className="text-sm leading-relaxed text-cream/60">{service.description}</p>
          </div>
        )}

        {service.layout === "framed" && (
          <div className="relative flex flex-col gap-5 rounded-2xl border border-dashed border-cream/15 p-5">
            <span className="text-3xl text-gold transition-transform duration-500 group-hover:rotate-12">
              <Icon aria-hidden="true" />
            </span>
            <h3 className="text-h3 font-bold text-cream">{service.title}</h3>
            <p className="text-sm leading-relaxed text-cream/60">{service.description}</p>
          </div>
        )}

        {service.layout === "overlap" && (
          <div className="relative flex flex-col gap-4 pt-6">
            <span className="absolute -top-2 left-0 text-6xl text-gold/10 transition-colors duration-500 group-hover:text-gold/20">
              <Icon aria-hidden="true" />
            </span>
            <h3 className="relative text-h3 font-bold text-cream">{service.title}</h3>
            <p className="relative text-sm leading-relaxed text-cream/60">{service.description}</p>
          </div>
        )}
      </motion.div>
    </RevealOnScroll>
  );
}

export default function Services() {
  return (
    <section id="services" dir="rtl" className="relative px-6 py-28 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-end text-right">
          <RevealOnScroll direction="right">
            <span className="text-caption font-semibold text-gold">خدمات تخصصی</span>
          </RevealOnScroll>
          <RevealOnScroll direction="right" delay={0.08}>
            <h2 className="mt-4 max-w-2xl text-h2 font-extrabold text-cream">
              مسیری متناسب با رشته، هدف و شخصیت ورزشی شما
            </h2>
          </RevealOnScroll>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
