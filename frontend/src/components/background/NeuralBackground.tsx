"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  trail: { x: number; y: number }[];
}

const PARTICLE_COUNT = 6;
const TRAIL_LENGTH = 26;
const GOLD = "201, 162, 77";
const CREAM = "245, 241, 231";

/**
 * Renders six faint, slow-moving points that drift like neural signals
 * across the deep-teal canvas, each leaving an almost-invisible fading trail.
 * Purely decorative and disabled under prefers-reduced-motion.
 */
export default function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();

    if (particlesRef.current.length === 0) {
      particlesRef.current = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        radius: 1.4 + Math.random() * 1.2,
        trail: [],
      }));
    }

    if (reducedMotion) {
      // Draw a single static, extremely subtle frame and stop.
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      particlesRef.current.forEach((p, i) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${i % 2 === 0 ? GOLD : CREAM}, 0.25)`;
        ctx.fill();
      });
      return;
    }

    let width = window.innerWidth;
    let height = window.innerHeight;

    const onResize = () => {
      resize();
      width = window.innerWidth;
      height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    const step = () => {
      ctx.clearRect(0, 0, width, height);

      particlesRef.current.forEach((p, i) => {
        // organic drift: slight random wander each frame, like a neuron firing path
        p.vx += (Math.random() - 0.5) * 0.01;
        p.vy += (Math.random() - 0.5) * 0.01;
        p.vx = Math.max(-0.25, Math.min(0.25, p.vx));
        p.vy = Math.max(-0.25, Math.min(0.25, p.vy));

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > TRAIL_LENGTH) p.trail.shift();

        const color = i % 3 === 0 ? GOLD : CREAM;

        // trail — a very thin fading lines
        ctx.beginPath();
        p.trail.forEach((point, idx) => {
          const alpha = (idx / p.trail.length) * 0.12;
          if (idx === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.strokeStyle = `rgba(${color}, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.lineTo(point.x, point.y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
          }
        });

        // glowing head
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 10);
        gradient.addColorStop(0, `rgba(${color}, 0.55)`);
        gradient.addColorStop(1, `rgba(${color}, 0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, 0.7)`;
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(step);
    };

    animationRef.current = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 opacity-70"
    />
  );
}
