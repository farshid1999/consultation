"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "fade" | "scale" | "blur";

interface RevealOnScrollProps {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

const offsets: Record<Direction, Record<string, number | string>> = {
  up: { y: 48 },
  down: { y: -48 },
  left: { x: -48 },
  right: { x: 48 },
  fade: {},
  scale: { scale: 0.92 },
  blur: {},
};

/**
 * Wraps a section/element so it animates into place once it enters the
 * viewport — direction, delay and duration are tunable per instance so
 * sibling elements can stagger with distinct personalities.
 */
export default function RevealOnScroll({
  children,
  direction = "up",
  delay = 0,
  duration = 0.9,
  className,
  once = true,
}: RevealOnScrollProps) {
  const initial = {
    opacity: 0,
    filter: direction === "blur" ? "blur(10px)" : "blur(0px)",
    ...offsets[direction],
  };

  return (
    <motion.div
      initial={initial}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once, amount: 0.25 }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
