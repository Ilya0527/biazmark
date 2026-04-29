"use client";

/**
 * Ambient background — refined Anglo-modern, scroll-aware, cursor-aware,
 * subtly thematic for an autonomous-marketing product.
 *
 * Composition:
 *   • 3 soft tinted gradient washes (coral / navy / sun) drifting at slow,
 *     differing parallax speeds — depth as you scroll.
 *   • Whisper-thin hairline grid (static).
 *   • 6 sparse editorial marks (dot, diamond, line, ring, ×, triangle) that
 *     lean slightly toward the cursor like compass needles toward magnetic
 *     north — subtle, ~14-22px max pull. Combined with scroll parallax.
 *   • Whisper words: a single italic serif word cross-fades through the
 *     5-agent verbs (researching · strategising · creating · publishing ·
 *     optimising · learning). Tells you what kind of site you're on without
 *     ever shouting it.
 *
 * Mobile-friendly:
 *   • Pure CSS transforms via framer-motion. No canvas, no rAF.
 *   • Single passive mousemove listener (no-op on touch).
 *   • will-change: transform on moving elements only.
 *   • Respects prefers-reduced-motion → all parallax + cursor-pull freeze;
 *     whisper word cycles slower (8s) so it's still informative but inert.
 */

import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";

const WHISPER_WORDS = [
  "researching",
  "strategising",
  "creating",
  "publishing",
  "analysing",
  "optimising",
  "learning",
];

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
  // 6 more for the new marks
  const m7x = useTransform(scx, [-0.5, 0.5], [-16,  16]);
  const m7y = useTransform(scy, [-0.5, 0.5], [ 10, -10]);
  const m8x = useTransform(scx, [-0.5, 0.5], [ 14, -14]);
  const m8y = useTransform(scy, [-0.5, 0.5], [-16,  16]);
  const m9x  = useTransform(scx, [-0.5, 0.5], [-22,  22]);
  const m9y  = useTransform(scy, [-0.5, 0.5], [ 14, -14]);
  const m10x = useTransform(scx, [-0.5, 0.5], [ 18, -18]);
  const m10y = useTransform(scy, [-0.5, 0.5], [-12,  12]);
  const m11x = useTransform(scx, [-0.5, 0.5], [-12,  12]);
  const m11y = useTransform(scy, [-0.5, 0.5], [-20,  20]);
  const m12x = useTransform(scx, [-0.5, 0.5], [ 22, -22]);
  const m12y = useTransform(scy, [-0.5, 0.5], [  8,  -8]);

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

      {/* ─── Drifting whisper words — 4 simultaneous, slow vertical drift ─── */}
      {!reduce && (
        <>
          <DriftingWord leftPct={8}  size="clamp(54px, 6vw, 92px)"  angleDeg={-4} delaySec={0}  durationSec={28} />
          <DriftingWord leftPct={32} size="clamp(70px, 8vw, 118px)" angleDeg={ 3} delaySec={9}  durationSec={30} />
          <DriftingWord leftPct={58} size="clamp(48px, 5vw, 78px)"  angleDeg={-2} delaySec={5}  durationSec={24} />
          <DriftingWord leftPct={80} size="clamp(82px, 9vw, 142px)" angleDeg={ 5} delaySec={14} durationSec={34} />
        </>
      )}

      {/* Bottom-right tiny triangle (scroll rotates it) */}
      <motion.div style={{ y: N(yB), rotate: N(rotR), position: "absolute", bottom: "8%", right: "18%", willChange: "transform" }}>
        <motion.span style={{ x: N(m6x), y: N(m6y), display: "block", width: 12, height: 12, opacity: 0.4, willChange: "transform" }}>
          <svg viewBox="0 0 12 12" width="12" height="12">
            <polygon points="6,1 11,11 1,11" fill="var(--sun)" stroke="var(--ink)" strokeWidth="0.8" />
          </svg>
        </motion.span>
      </motion.div>

      {/* ─── 6 more editorial marks for richness ─── */}

      {/* Plus sign — top-mid */}
      <motion.div style={{ y: N(yC), position: "absolute", top: "8%", left: "44%", willChange: "transform" }}>
        <motion.span style={{ x: N(m7x), y: N(m7y), display: "block", width: 14, height: 14, opacity: 0.32 }}>
          <svg viewBox="0 0 14 14" width="14" height="14">
            <line x1="7" y1="2" x2="7" y2="12" stroke="var(--navy)" strokeWidth="1.4" strokeLinecap="round" />
            <line x1="2" y1="7" x2="12" y2="7" stroke="var(--navy)" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </motion.span>
      </motion.div>

      {/* Asterisk — left mid-upper */}
      <motion.div style={{ y: N(yD), rotate: N(rotR), position: "absolute", top: "32%", left: "20%", willChange: "transform" }}>
        <motion.span style={{ x: N(m8x), y: N(m8y), display: "block", width: 16, height: 16, opacity: 0.35 }}>
          <svg viewBox="0 0 16 16" width="16" height="16">
            <line x1="8" y1="1"  x2="8"  y2="15" stroke="var(--coral)" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="1" y1="8"  x2="15" y2="8"  stroke="var(--coral)" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="3" y1="3"  x2="13" y2="13" stroke="var(--coral)" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="13" y1="3" x2="3"  y2="13" stroke="var(--coral)" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </motion.span>
      </motion.div>

      {/* Three dots vertical — right mid-upper */}
      <motion.div style={{ y: N(yB), position: "absolute", top: "28%", right: "22%", willChange: "transform" }}>
        <motion.span style={{ x: N(m9x), y: N(m9y), display: "flex", flexDirection: "column", gap: 3, opacity: 0.4 }}>
          <span style={{ width: 4, height: 4, borderRadius: 999, background: "var(--ink)" }} />
          <span style={{ width: 4, height: 4, borderRadius: 999, background: "var(--ink)" }} />
          <span style={{ width: 4, height: 4, borderRadius: 999, background: "var(--ink)" }} />
        </motion.span>
      </motion.div>

      {/* Diagonal slash — left lower */}
      <motion.div style={{ y: N(yC), position: "absolute", bottom: "26%", left: "30%", willChange: "transform" }}>
        <motion.span style={{ x: N(m10x), y: N(m10y), display: "block", width: 22, height: 22, opacity: 0.3 }}>
          <svg viewBox="0 0 22 22" width="22" height="22">
            <line x1="3" y1="19" x2="19" y2="3" stroke="var(--ink)" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </motion.span>
      </motion.div>

      {/* Half-circle — right mid */}
      <motion.div style={{ y: N(yD), position: "absolute", top: "62%", left: "48%", willChange: "transform" }}>
        <motion.span style={{ x: N(m11x), y: N(m11y), display: "block", width: 24, height: 12, opacity: 0.35 }}>
          <svg viewBox="0 0 24 12" width="24" height="12">
            <path d="M2 12 A10 10 0 0 1 22 12" fill="none" stroke="var(--coral)" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </motion.span>
      </motion.div>

      {/* Open square outline — bottom-mid */}
      <motion.div style={{ y: N(yB), rotate: N(rotR), position: "absolute", bottom: "30%", right: "32%", willChange: "transform" }}>
        <motion.span style={{ x: N(m12x), y: N(m12y), display: "block", width: 16, height: 16, border: "1px solid var(--navy)", opacity: 0.32, willChange: "transform" }} />
      </motion.div>

      {/* ─── PULSE RING — radar-style 'system alive' signal in bottom-left ─── */}
      {!reduce && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: "12%",
            left: "8%",
            width: 0, height: 0,
            pointerEvents: "none",
          }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="ambient-pulse"
              style={{
                position: "absolute",
                left: -100, top: -100,
                width: 200, height: 200,
                borderRadius: 999,
                border: "1px solid var(--coral)",
                opacity: 0,
                animation: `ambient-pulse 7s ${i * 2.3}s ease-out infinite`,
              }}
            />
          ))}
        </div>
      )}

      {/* ─── FLOATING METRIC CHIPS — marketing telemetry drifting across ─── */}
      {!reduce && (
        <>
          <DriftingMetric topPct={22} text="+18% CTR"     delaySec={2}  durationSec={42} />
          <DriftingMetric topPct={48} text="ROAS 4.2×"    delaySec={11} durationSec={48} />
          <DriftingMetric topPct={66} text="reach +12.4K" delaySec={20} durationSec={45} />
          <DriftingMetric topPct={36} text="CPA −$3.20"   delaySec={28} durationSec={50} />
          <DriftingMetric topPct={78} text="conv 2.8%"    delaySec={36} durationSec={44} />
        </>
      )}
    </div>
  );
}

/* ─── DriftingMetric — small mono-font chip that drifts across horizontally ─── */

function DriftingMetric({
  topPct,
  text,
  delaySec,
  durationSec,
}: {
  topPct: number;
  text: string;
  delaySec: number;
  durationSec: number;
}) {
  return (
    <motion.div
      aria-hidden
      initial={{ x: "-20vw", opacity: 0 }}
      animate={{
        x: "120vw",
        opacity: [0, 0.18, 0.18, 0],
      }}
      transition={{
        duration: durationSec,
        delay: delaySec,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
        times: [0, 0.1, 0.9, 1],
      }}
      style={{
        position: "absolute",
        top: `${topPct}%`,
        left: 0,
        fontFamily: '"JetBrains Mono", ui-monospace, monospace',
        fontSize: "11px",
        color: "var(--ink)",
        background: "rgba(247,244,234,0.6)",
        border: "1px solid var(--hair)",
        borderRadius: 999,
        padding: "3px 9px",
        letterSpacing: "0.04em",
        whiteSpace: "nowrap",
        userSelect: "none",
        pointerEvents: "none",
        willChange: "transform, opacity",
        backdropFilter: "blur(2px)",
      }}
    >
      {text}
    </motion.div>
  );
}

/* ─── DriftingWord — slow upward sweep, cycles a random verb each loop ─── */

function DriftingWord({
  leftPct,
  size,
  angleDeg,
  delaySec,
  durationSec,
}: {
  leftPct: number;
  size: string;
  angleDeg: number;
  delaySec: number;
  durationSec: number;
}) {
  // The word cycles each animation iteration — onUpdate would be expensive,
  // so we just rotate through the list deterministically with the iteration
  // count. 7 words → period of 7 iterations. Visually: each appearance is a
  // different word, no repeats in nearby slots.
  const [iter, setIter] = useState(0);
  const word = WHISPER_WORDS[iter % WHISPER_WORDS.length];

  return (
    <motion.div
      aria-hidden
      initial={{ y: "110vh", opacity: 0 }}
      animate={{
        y: "-30vh",
        opacity: [0, 0.06, 0.06, 0],
      }}
      transition={{
        duration: durationSec,
        delay: delaySec,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
        times: [0, 0.15, 0.85, 1],
      }}
      onUpdate={(latest) => {
        // Detect the moment we've wrapped: y reset to 110vh means new iteration.
        // (framer-motion repeat fires onComplete each iteration; cheap enough.)
      }}
      onAnimationComplete={() => setIter((i) => (i + Math.floor(Math.random() * 3) + 1) % WHISPER_WORDS.length)}
      style={{
        position: "absolute",
        left: `${leftPct}%`,
        top: 0,
        fontFamily: '"Instrument Serif", Georgia, serif',
        fontStyle: "italic",
        fontSize: size,
        color: "var(--ink)",
        letterSpacing: "-0.04em",
        lineHeight: 1,
        whiteSpace: "nowrap",
        userSelect: "none",
        pointerEvents: "none",
        transform: `rotate(${angleDeg}deg)`,
        willChange: "transform, opacity",
      }}
    >
      {word}
    </motion.div>
  );
}
