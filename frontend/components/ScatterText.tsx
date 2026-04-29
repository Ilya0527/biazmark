"use client";

/**
 * Each character is a separate motion span. As you scroll past, letters
 * *decompose* — scatter outward, rotate, fade. Scrolling back reassembles.
 * Inspired by Lusion / Active Theory landing pages.
 *
 * Use as: <ScatterText text="Marketing that" />
 *
 * RTL safe: chars render in source order; CSS direction handles visual flow.
 */

import { useRef, type RefObject } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

export default function ScatterText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const chars = Array.from(text);

  return (
    <span ref={ref} className={`inline-block ${className}`} aria-label={text}>
      {chars.map((ch, i) =>
        ch === " " ? (
          <span key={i} aria-hidden style={{ display: "inline-block", width: "0.3em" }} />
        ) : (
          <Char key={i} ch={ch} i={i} progress={scrollYProgress} />
        )
      )}
    </span>
  );
}

function Char({
  ch,
  i,
  progress,
}: {
  ch: string;
  i: number;
  progress: MotionValue<number>;
}) {
  // Deterministic pseudo-random per index (so SSR + client agree)
  const r = (((Math.sin(i * 9301 + 49297) * 43758.5453) % 1) + 1) % 1;
  const r2 = (((Math.sin(i * 12.9898) % 1) + 1) % 1);
  const r3 = (((Math.cos(i * 78.233) % 1) + 1) % 1);
  const dir = i % 2 === 0 ? 1 : -1;
  const tx = (r - 0.5) * 220 * dir;
  const ty = (r2 - 0.5) * 220;
  const rot = (r3 - 0.5) * 80;

  const x = useTransform(progress, [0, 0.4, 0.9], [tx, 0, tx]);
  const y = useTransform(progress, [0, 0.4, 0.9], [ty, 0, ty]);
  const rotate = useTransform(progress, [0, 0.4, 0.9], [rot, 0, rot]);
  const opacity = useTransform(progress, [0, 0.18, 0.4, 0.9, 1], [0, 1, 1, 0, 0]);

  return (
    <motion.span
      aria-hidden
      style={{ x, y, rotate, opacity, display: "inline-block" }}
    >
      {ch}
    </motion.span>
  );
}
