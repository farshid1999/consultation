"use client";

import { useRef } from "react";
import type { MouseEvent } from "react";

/**
 * Gives an element a subtle magnetic pull toward the cursor on hover.
 * Strength is kept low to stay premium rather than gimmicky.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.25) {
  const ref = useRef<T | null>(null);

  const onMouseMove = (event: MouseEvent<T>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };

  const onMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate(0px, 0px)";
  };

  return { ref, onMouseMove, onMouseLeave };
}
