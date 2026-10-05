"use client";

import { motion } from "framer-motion";
import LogoCard from "@/components/layout/LogoCard";

export type PartnerItem = {
  name: string;
  logo: string;
  href?: string;
};

type Props = {
  title?: string;
  subtitle?: string;
  items?: PartnerItem[];
};

// جایگزین کن با اسم و مسیر عکس‌های خودت
const DEFAULT_ITEMS: PartnerItem[] = [
  { name: "نام اول", logo: "/partners/1.webp" },
  { name: "نام دوم", logo: "/partners/2.webp" },
  { name: "نام سوم", logo: "/partners/3.webp" },
  { name: "نام چهارم", logo: "/partners/4.webp" },
];

export default function Partners({
  title = "همراهان ما",
  subtitle,
  items = DEFAULT_ITEMS,
}: Props) {
  return (
    <section dir="rtl" className="relative py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 space-y-4 text-center md:mb-14">
          <h2 className="text-2xl font-extrabold text-cream md:text-4xl">{title}</h2>
          {subtitle && (
            <p className="mx-auto max-w-xl text-sm leading-7 text-cream/50">{subtitle}</p>
          )}
          <div className="mx-auto h-[3px] w-14 rounded-full bg-gradient-to-l from-gold to-gold/10" />
        </div>

        {/* موبایل: ۲ ستون ، تبلت و دسکتاپ: ۴ ستون */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {items.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <LogoCard {...item} logo={item.logo} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}