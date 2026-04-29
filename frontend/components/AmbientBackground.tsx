"use client";

/**
 * Ambient background — refined Anglo-modern, scroll-aware.
 *
 * Composition:
 *   • 3 soft tinted gradient washes (coral / navy / sun) drifting at slow,
 *     differing parallax speeds — gives the page a sense of depth as you scroll.
 *   • A whisper-thin hairline grid (static).
 *   • 6 sparse editorial marks (dot, triangle, square, line, ring, x)
 *     parallaxing at faster speeds for foreground depth.
 *
 * Mobile-friendly:
 *   • Pure CSS transforms via framer-motion's `useScroll` + spring smoothing.
 *     No canvas, no requestAnimationFrame loops, no JS heavy lifting.
 *     The browser hands the layer to the GPU and never thinks about it again.
 *   • will-change: transform only on the moving layers.
 *   • Respects prefers-reduced-motion → no parallax for users who opt out.
 *   • No touch handlers, no orientation handlers — drains zero battery on idle.
 */

import { useEffect, useId, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

export default function AmbientBackground({
  intensity = 0.6,
}: {
  variant?: "mesh" | "constellation" | "waves";
  intensity?: number;
}) {
  const id = useId();
  const o = Math.max(0, Math.min(1, intensity));

  // Respect accessibility preference — no movement for users who asked.
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(m.matches);
    const onChange = () => setReduce(m.matches);
    m.addEventListener?.("change", onChange);
    return () => m.removeEventListener?.("change", onChange);
  }, []);

  // Scroll-driven parallax. Range 0..1500px maps to negative Y offsets.
  const { scrollY } = useScroll();
  // Different speeds per layer — slow for big gradients, faster for tiny shapes.
  const y1 = useSpring(useTransform(scrollY, [0, 1500], [0, -100]),  { stiffness: 70, damping: 24 });
  const y2 = useSpring(useTransform(scrollY, [0, 1500], [0, -180]),  { stiffness: 70, damping: 24 });
  const y3 = useSpring(useTransform(scrollY, [0, 1500], [0, -260]),  { stiffness: 70, damping: 24 });
  const y4 = useSpring(useTransform(scrollY, [0, 1500], [0, -340]),  { stiffness: 80, damping: 22 });
  const r1 = useSpring(useTransform(scrollY, [0, 1500], [0, 30]),    { stiffness: 60, damping: 22 }); // gentle rotation

  // When reduce-motion is on, freeze everything at 0.
  const NY = (mv: any) => (reduce ? 0 : mv);

  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
    >
      {/* ─── Gradient washes — slow parallax ─── */}
      <motion.div
        style={{
          y: NY(y1),
          willChange: "transform",
          position: "absolute",
          top: "-180px", right: "-160px",
          width: 620, height: 620,
          background: "radial-gradient(circle, rgba(194,91,77,0.22), transparent 70%)",
          filter: "blur(60px)",
          opacity: 0.6 * o,
        }}
      />
      <motion.div
        style={{
          y: NY(y2),
          willChange: "transform",
          position: "absolute",
          bottom: "-160px", left: "-140px",
          width: 540, height: 540,
          background: "radial-gradient(circle, rgba(26,36,64,0.12), transparent 70%)",
          filter: "blur(70px)",
          opacity: 0.7 * o,
        }}
      />
      <motion.div
        style={{
          y: NY(y1),
          willChange: "transform",
          position: "absolute",
          top: "30%", left: "30%",
          width: 460, height: 460,
          background: "radial-gradient(circle, rgba(232,200,120,0.18), transparent 70%)",
          filter: "blur(80px)",
          opacity: 0.45 * o,
        }}
      />

      {/* ─── Hairline grid — static, barely visible ─── */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.16]">
        <defs>
          <pattern id={`grid-${id}`} width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#0d0d10" strokeWidth="0.4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grid-${id})`} />
      </svg>

      {/* ─── Editorial marks — sparse, parallax-driven, GPU-only ─── */}
      {/* Top-left coral dot */}
      <motion.span
        style={{
          y: NY(y3),
          willChange: "transform",
          position: "absolute",
          top: "10%", left: "5%",
          width: 6, height: 6, borderRadius: 999,
          background: "var(--coral)",
          opacity: 0.65,
        }}
      />
      {/* Top-right navy diamond */}
      <motion.span
        style={{
          y: NY(y4),
          rotate: NY(r1),
          willChange: "transform",
          position: "absolute",
          top: "18%", right: "8%",
          width: 10, height: 10,
          background: "var(--navy)",
          opacity: 0.4,
          transform: "rotate(45deg)",
        }}
      />
      {/* Mid-left horizontal line */}
      <motion.span
        style={{
          y: NY(y2),
          willChange: "transform",
          position: "absolute",
          top: "44%", left: "3%",
          width: 28, height: 1,
          background: "var(--ink)",
          opacity: 0.28,
        }}
      />
      {/* Mid-right ring outline */}
      <motion.span
        style={{
          y: NY(y3),
          willChange: "transform",
          position: "absolute",
          top: "55%", right: "6%",
          width: 22, height: 22,
          borderRadius: 999,
          border: "1px solid var(--ink)",
          opacity: 0.25,
        }}
      />
      {/* Bottom-left × cross */}
      <motion.span
        style={{
          y: NY(y4),
          willChange: "transform",
          position: "absolute",
          bottom: "14%", left: "12%",
          width: 14, height: 14,
          opacity: 0.3,
        }}
      >
        <svg viewBox="0 0 14 14" width="14" height="14">
          <line x1="2" y1="2" x2="12" y2="12" stroke="var(--coral)" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="12" y1="2" x2="2" y2="12" stroke="var(--coral)" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </motion.span>
      {/* Bottom-right tiny triangle */}
      <motion.span
        style={{
          y: NY(y2),
          rotate: NY(r1),
          willChange: "transform",
          position: "absolute",
          bottom: "8%", right: "18%",
          width: 12, height: 12,
          opacity: 0.4,
        }}
      >
        <svg viewBox="0 0 12 12" width="12" height="12">
          <polygon points="6,1 11,11 1,11" fill="var(--sun)" stroke="var(--ink)" strokeWidth="0.8" />
        </svg>
      </motion.span>
    </div>
  );
}
