"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiArrowLeft, FiCheck } from "react-icons/fi";
import { PiBrainDuotone, PiHeartbeatDuotone, PiTargetDuotone } from "react-icons/pi";
import Button from "@/components/ui/Button";
import GlassCard from "@/components/ui/GlassCard";
import { toPersianDigits } from "@/lib/utils";

const featureList = [
  "جلسات حضوری و آنلاین",
  "برنامه‌ی اختصاصی برای هر ورزشکار",
  "همراهی مستمر تا روز مسابقه",
];

const cubeImages = [
  "/test2.webp",
  "/logo.webp",
  "/test3.webp",
  "/logo.webp",
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.14, delayChildren: 0.15 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
};

const CUBE_SIZE = 300;
const CUBE_HALF = 150;

// ─── Mobile Flat Slider ───────────────────────────────────────────────────────
function MobileSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((p) => (p + 1) % cubeImages.length), 3500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl" style={{ aspectRatio: "4/3" }}>
      {cubeImages.map((src, i) => (
        <img
          key={src + i}
          src={src}
          alt="روان‌شناسی ورزشی"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: i === index ? 1 : 0,
            transition: "opacity 0.8s ease",
          }}
        />
      ))}
      {/* dot indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {cubeImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`تصویر ${i + 1}`}
            style={{
              width: i === index ? 20 : 6,
              height: 6,
              borderRadius: 99,
              background: i === index ? "rgba(200,160,60,1)" : "rgba(200,160,60,0.35)",
              transition: "all 0.4s ease",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Desktop 3D Cube Slider ───────────────────────────────────────────────────
function HeroImageSlider() {
  const cubeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cubeRef.current;
    if (!el) return;
    const pause = () => (el.style.animationPlayState = "paused");
    const play  = () => (el.style.animationPlayState = "running");
    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", play);
    return () => {
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", play);
    };
  }, []);

  return (
    <div
      style={{
        width: CUBE_SIZE,
        height: CUBE_SIZE,
        perspective: "700px",
        perspectiveOrigin: "50% 50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        ref={cubeRef}
        style={{
          width: CUBE_SIZE,
          height: CUBE_SIZE,
          position: "relative",
          transformStyle: "preserve-3d",
          animation: "heroRotateCube 28s infinite linear",
        }}
      >
        <CubeFace transform={`translateZ(${CUBE_HALF}px)`}                 src={cubeImages[0]} />
        <CubeFace transform={`rotateY(90deg) translateZ(${CUBE_HALF}px)`}  src={cubeImages[1]} />
        <CubeFace transform={`rotateY(180deg) translateZ(${CUBE_HALF}px)`} src={cubeImages[2]} />
        <CubeFace transform={`rotateY(-90deg) translateZ(${CUBE_HALF}px)`} src={cubeImages[3]} />
        <CubeFace transform={`rotateX(90deg) translateZ(${CUBE_HALF}px)`}  decorative />
        <CubeFace transform={`rotateX(-90deg) translateZ(${CUBE_HALF}px)`} decorative />
      </div>
    </div>
  );
}

interface CubeFaceProps {
  transform: string;
  src?: string;
  decorative?: boolean;
}

function CubeFace({ transform, src, decorative }: CubeFaceProps) {
  return (
    <div
      style={{
        position: "absolute",
        width: CUBE_SIZE,
        height: CUBE_SIZE,
        borderRadius: 22,
        overflow: "hidden",
        border: decorative
          ? "1.5px solid rgba(200,160,60,0.12)"
          : "1.5px solid rgba(200,160,60,0.38)",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        transform,
        background: "#0f1f12",
      }}
    >
      {src && (
        <img
          src={src}
          alt="روان‌شناسی ورزشی"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      )}
    </div>
  );
}

export default function Hero() {
  return (
    <>
      <style>{`
        @keyframes heroRotateCube {
          0%   { transform: rotateX(-12deg) rotateY(0deg); }
          100% { transform: rotateX(-12deg) rotateY(-360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="heroRotateCube"] {
            animation: none !important;
            transform: rotateX(-12deg) rotateY(-25deg);
          }
        }
      `}</style>

      <section
        id="hero"
        dir="rtl"
        className="relative isolate flex min-h-screen items-center overflow-hidden px-6 pt-32 pb-20 md:px-10 lg:px-16"
      >
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-[1.05fr_0.9fr_0.75fr] lg:gap-8">

          {/* ── RIGHT ZONE ───────────────────────────────────────────────── */}
          <motion.div variants={container} initial="hidden" animate="show" className="order-1 text-right">
            <motion.div
              variants={fadeUp}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/[0.08] px-4 py-1.5 text-caption font-medium text-gold"
            >
              <PiHeartbeatDuotone className="text-base" aria-hidden="true" />
              روان‌شناسی ورزشی حرفه‌ای
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-4xl font-extrabold text-cream">
              ذهنی که برای{" "}
              <span className="relative inline-block text-gold">
                قهرمانی
                <svg
                  className="absolute -bottom-2 right-0 w-full"
                  height="10"
                  viewBox="0 0 200 10"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 8C40 2 160 2 198 8"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="text-gold/50"
                  />
                </svg>
              </span>{" "}
              آماده می‌شود
            </motion.h1>

            <motion.p variants={fadeUp} className="mt-4 text-h3 font-medium text-cream/60">
              پیش از بدن، ذهن باید برنده شود.
            </motion.p>

            <motion.p variants={fadeUp} className="mt-6 max-w-md text-body text-cream/65">
              مشاوره‌ی تخصصی روان‌شناسی ورزشی برای ورزشکارانی که می‌خواهند در لحظه‌ی تصمیم،
              آرام، متمرکز و مطمئن بمانند؛ از جلسات فردی تا همراهی تا روز مسابقه.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-9 flex flex-wrap items-center gap-4">
              <Button variant="primary" icon={<FiArrowLeft aria-hidden="true" />}>
                رزرو جلسه‌ی مشاوره
              </Button>
              <Button variant="secondary">آشنایی با فرآیند</Button>
            </motion.div>

            <motion.ul variants={fadeUp} className="mt-10 flex flex-col gap-3">
              {featureList.map((feature) => (
                <li key={feature} className="flex items-center gap-2.5 text-sm text-cream/55">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
                    <FiCheck className="text-xs" aria-hidden="true" />
                  </span>
                  {feature}
                </li>
              ))}
            </motion.ul>
          </motion.div>

          {/* ── CENTER ZONE ──────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="order-2 relative mx-auto hidden h-[440px] w-full max-w-sm items-center justify-center md:flex"
          >
            <div className="absolute h-56 w-56 rounded-full border border-gold/30" />
            <div className="absolute h-56 w-56 animate-pulse-ring rounded-full border border-gold/40" />
            <div className="absolute h-56 w-56 animate-pulse-ring rounded-full border border-gold/40" style={{ animationDelay: "1.1s" }} />
            <div className="absolute h-56 w-56 animate-pulse-ring rounded-full border border-gold/40" style={{ animationDelay: "2.2s" }} />

            <div className="relative flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br from-deep-2 to-deep-3 shadow-soft">
              <PiBrainDuotone className="text-6xl text-gold" aria-hidden="true" />
            </div>

            <GlassCard className="absolute -right-4 top-4 animate-float-slow px-5 py-4 md:-right-10">
              <p className="text-xs text-cream/50">اضطراب پیش‌مسابقه</p>
              <p className="mt-1 text-h3 font-bold text-cream">−{toPersianDigits(64)}٪</p>
            </GlassCard>

            <GlassCard className="absolute -left-6 bottom-8 animate-float-slower px-5 py-4 md:-left-14">
              <div className="flex items-center gap-2">
                <PiTargetDuotone className="text-lg text-gold" aria-hidden="true" />
                <p className="text-xs text-cream/50">تمرکز پایدار</p>
              </div>
              <p className="mt-1 text-h3 font-bold text-cream">{toPersianDigits(420)}+ ورزشکار</p>
            </GlassCard>
          </motion.div>

          {/* ── LEFT ZONE — mobile: flat slider / desktop: 3D cube ───────── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="order-3 w-full px-2 lg:hidden"
          >
            <MobileSlider />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="order-3 hidden lg:flex lg:items-center lg:justify-center -mt-80"
          >
            <HeroImageSlider />
          </motion.div>

        </div>
      </section>
    </>
  );
}