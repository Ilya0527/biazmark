"use client";

/**
 * Ambient background — refined Anglo-modern, scroll-aware, cursor-aware.
 *
 * Composition:
 *   • 3 soft tinted gradient washes (coral / navy / sun) drifting at slow,
 *     differing parallax speeds — depth as you scroll.
 *   • Whisper-thin hairline grid (static).
 *   • 6 sparse editorial marks (dot, diamond, line, ring, ×, triangle) that
 *     lean slightly toward the cursor like compass needles toward magnetic
 *     north — subtle, ~14-22px max pull. Combined with scroll parallax for
 *     a layered feel.
 *
 * Mobile-friendly:
 *   • Pure CSS transforms via framer-motion. No canvas, no rAF, no JS work
 *     beyond a single passive mousemove listener (which is no-op on touch).
 *   • will-change: transform on moving elements only.
 *   • Respects prefers-reduced-motion → all parallax + cursor-pull freeze.
 *   • Disabled cursor-pull on touch devices (matchMedia '(hover: hover)').
 */

import { useEffect, useId, useState } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";

export default function AmbientBackground({
  intensity = 0.6,
}: {
  variant?: "mesh" | "constellation" | "waves";
  intensity?: number;
}) {
  const id = useId();
  const o = Math.max(0, Math.min(1, intensity));

  // Reduce-motion gate
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(m.matches);
    const onChange = () => setReduce(m.matches);
    m.addEventListener?.("change", onChange);
    return () => m.removeEventListener?.("change", onChange);
  }, []);

  // ─── Scroll parallax (y offsets) ───
  const { scrollY } = useScroll();
  const yA = useSpring(useTransform(scrollY, [0, 1500], [0,  -90]), { stiffness: 70, damping: 24 });
  const yB = useSpring(useTransform(scrollY, [0, 1500], [0, -160]), { stiffness: 70, damping: 24 });
  const yC = useSpring(useTransform(scrollY, [0, 1500], [0, -240]), { stiffness: 70, damping: 24 });
  const yD = useSpring(useTransform(scrollY, [0, 1500], [0, -320]), { stiffness: 80, damping: 22 });
  const rotR = useSpring(useTransform(scrollY, [0, 1500], [0,  35]), { stiffness: 60, damping: 22 });

  // ─── Cursor pull — normalized -0.5..0.5 of viewport ───
  const cx = useMotionValue(0);
  const cy = useMotionValue(0);
  useEffect(() => {
    if (!window.matchMedia("(hover: hover)").matches) return;
    function onMove(e: MouseEvent) {
      cx.set(e.clientX / window.innerWidth  - 0.5);
      cy.set(e.clientY / window.innerHeight - 0.5);
    }
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [cx, cy]);

  // Spring-smooth the cursor signal — gives the magnetic-pull a calm lag
  const scx = useSpring(cx, { stiffness: 50, damping: 16, mass: 0.6 });
  const scy = useSpring(cy, { stiffness: 50, damping: 16, mass: 0.6 });

  // For each mark, compute its individual cursor offset (different magnitudes
  // and signs so they don't all move in lockstep — feels organic).
  const m1x = useTransform(scx, [-0.5, 0.5], [-18,  18]);
  const m1y = useTransform(scy, [-0.5, 0.5], [-14,  14]);
  const m2x = useTransform(scx, [-0.5, 0.5], [ 12, -12]);   // inverted — pushes away
  const m2y = useTransform(scy, [-0.5, 0.5], [-22,  22]);
  const m3x = useTransform(scx, [-0.5, 0.5], [-10,  10]);
  const m3y = useTransform(scy, [-0.5, 0.5], [ -8,   8]);
  const m4x = useTransform(scx, [-0.5, 0.5], [ 16, -16]);
  const m4y = useTransform(scy, [-0.5, 0.5], [ 12, -12]);
  const m5x = useTransform(scx, [-0.5, 0.5], [-14,  14]);
  const m5y = useTransform(scy, [-0.5, 0.5], [ 18, -18]);
  const m6x = useTransform(scx, [-0.5, 0.5], [ 20, -20]);
  const m6y = useTransform(scy, [-0.5, 0.5], [-10,  10]);

  // Reduce-motion: freeze every motion value at 0
  const N = (mv: any) => (reduce ? 0 : mv);

  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
    >
      {/* ─── Gradient washes — slow scroll parallax, no cursor pull ─── */}
      <motion.div
        style={{
          y: N(yA),
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
          y: N(yB),
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
          y: N(yA),
          willChange: "transform",
          position: "absolute",
          top: "30%", left: "30%",
          width: 460, height: 460,
          background: "radial-gradient(circle, rgba(232,200,120,0.18), transparent 70%)",
          filter: "blur(80px)",
          opacity: 0.45 * o,
        }}
      />

      {/* ─── Hairline grid ─── */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.16]">
        <defs>
          <pattern id={`grid-${id}`} width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#0d0d10" strokeWidth="0.4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grid-${id})`} />
      </svg>

      {/* ─── Editorial marks — scroll parallax + cursor pull ─── */}
      {/* Each mark uses an outer wrapper for scroll-y, inner for cursor x/y. */}

      {/* Top-left coral dot */}
      <motion.div style={{ y: N(yC), position: "absolute", top: "10%", left: "5%", willChange: "transform" }}>
        <motion.span
          style={{
            x: N(m1x), y: N(m1y),
            display: "block",
            width: 6, height: 6, borderRadius: 999,
            background: "var(--coral)",
            opacity: 0.65,
            willChange: "transform",
          }}
        />
      </motion.div>

      {/* Top-right navy diamond (rotates with scroll) */}
      <motion.div style={{ y: N(yD), rotate: N(rotR), position: "absolute", top: "18%", right: "8%", willChange: "transform" }}>
        <motion.span
          style={{
            x: N(m2x), y: N(m2y),
            display: "block",
            width: 10, height: 10,
            background: "var(--navy)",
            opacity: 0.4,
            transform: "rotate(45deg)",
            willChange: "transform",
          }}
        />
      </motion.div>

      {/* Mid-left horizontal line */}
      <motion.div style={{ y: N(yB), position: "absolute", top: "44%", left: "3%", willChange: "transform" }}>
        <motion.span
          style={{
            x: N(m3x), y: N(m3y),
            display: "block",
            width: 28, height: 1,
            background: "var(--ink)",
            opacity: 0.28,
            willChange: "transform",
          }}
        />
      </motion.div>

      {/* Mid-right ring outline */}
      <motion.div style={{ y: N(yC), position: "absolute", top: "55%", right: "6%", willChange: "transform" }}>
        <motion.span
          style={{
            x: N(m4x), y: N(m4y),
            display: "block",
            width: 22, height: 22,
            borderRadius: 999,
            border: "1px solid var(--ink)",
            opacity: 0.25,
            willChange: "transform",
          }}
        />
      </motion.div>

      {/* Bottom-left × cross */}
      <motion.div style={{ y: N(yD), position: "absolute", bottom: "14%", left: "12%", willChange: "transform" }}>
        <motion.span style={{ x: N(m5x), y: N(m5y), display: "block", width: 14, height: 14, opacity: 0.3, willChange: "transform" }}>
          <svg viewBox="0 0 14 14" width="14" height="14">
            <line x1="2" y1="2" x2="12" y2="12" stroke="var(--coral)" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="12" y1="2" x2="2" y2="12" stroke="var(--coral)" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </motion.span>
      </motion.div>

      {/* Bottom-right tiny triangle (scroll rotates it) */}
      <motion.div style={{ y: N(yB), rotate: N(rotR), position: "absolute", bottom: "8%", right: "18%", willChange: "transform" }}>
        <motion.span style={{ x: N(m6x), y: N(m6y), display: "block", width: 12, height: 12, opacity: 0.4, willChange: "transform" }}>
          <svg viewBox="0 0 12 12" width="12" height="12">
            <polygon points="6,1 11,11 1,11" fill="var(--sun)" stroke="var(--ink)" strokeWidth="0.8" />
          </svg>
        </motion.span>
      </motion.div>
    </div>
  );
}
