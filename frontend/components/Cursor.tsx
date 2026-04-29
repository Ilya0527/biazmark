"use client";

/**
 * Multi-state contextual cursor.
 *
 *   default  ─  small coral dot + comet trail (6 fading echoes)
 *   button   ─  ring expands to 56px, arrow inside that POINTS the direction
 *               the cursor is moving (rotates with velocity vector)
 *   input    ─  vertical text bar │ that pulses
 *   code     ─  terminal block ▮ in mono
 *   image    ─  magnifier circle with diagonal handle
 *
 *   click    ─  4-particle burst radiating outward, then fade
 *
 * Mode is detected from `event.target.closest(...)` — every interactive
 * element gets its own treatment automatically. Optional `data-cursor` attr
 * forces a mode or label. Disabled on touch devices.
 */

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, type MotionValue } from "framer-motion";

type Mode = "default" | "button" | "input" | "code" | "image";

function detectMode(target: EventTarget | null): { mode: Mode; label: string } {
  if (!(target instanceof Element)) return { mode: "default", label: "" };

  // explicit override
  const dc = target.closest<HTMLElement>("[data-cursor]");
  if (dc?.dataset.cursorMode) {
    return {
      mode: (dc.dataset.cursorMode as Mode) || "default",
      label: dc.dataset.cursor || "",
    };
  }

  if (target.closest("input, textarea, [contenteditable='true']")) return { mode: "input", label: "" };
  if (target.closest("pre, code, kbd")) return { mode: "code", label: "" };
  if (target.closest("img, video")) return { mode: "image", label: "" };
  if (target.closest("a, button, [role='button'], select, summary, label[for]")) {
    return { mode: "button", label: dc?.dataset.cursor || "" };
  }
  return { mode: "default", label: "" };
}

const TRAIL_LEN = 6;

export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<Mode>("default");
  const [label, setLabel] = useState("");

  // Motion values for the live position
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  // Springy follower for the ring (lags behind)
  const rx = useSpring(x, { stiffness: 600, damping: 32, mass: 0.45 });
  const ry = useSpring(y, { stiffness: 600, damping: 32, mass: 0.45 });

  // Direction (degrees) the cursor is moving — used by the button arrow
  const angle = useMotionValue(0);

  // Trail buffer
  const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([]);
  const trailIdRef = useRef(0);

  // Click bursts
  const [bursts, setBursts] = useState<{ x: number; y: number; id: number }[]>([]);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover)").matches) return;
    setEnabled(true);
    document.documentElement.classList.add("custom-cursor");

    let lastX = -100;
    let lastY = -100;

    function onMove(e: MouseEvent) {
      x.set(e.clientX);
      y.set(e.clientY);

      // velocity → angle
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      if (Math.abs(dx) + Math.abs(dy) > 2) {
        angle.set((Math.atan2(dy, dx) * 180) / Math.PI);
      }
      lastX = e.clientX;
      lastY = e.clientY;

      // trail
      trailIdRef.current += 1;
      const id = trailIdRef.current;
      setTrail((prev) => {
        const next = [...prev, { x: e.clientX, y: e.clientY, id }];
        return next.length > TRAIL_LEN ? next.slice(next.length - TRAIL_LEN) : next;
      });
    }

    function onClick(e: MouseEvent) {
      const id = ++trailIdRef.current;
      setBursts((prev) => [...prev, { x: e.clientX, y: e.clientY, id }]);
      setTimeout(() => setBursts((prev) => prev.filter((b) => b.id !== id)), 700);
    }

    function pickMode(target: EventTarget | null) {
      const { mode: m, label: l } = detectMode(target);
      setMode(m);
      setLabel(l);
    }
    function onOver(e: MouseEvent) { pickMode(e.target); }
    function onOut(e: MouseEvent) { pickMode((e as any).relatedTarget); }

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mouseout", onOut);
    window.addEventListener("mousedown", onClick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mouseout", onOut);
      window.removeEventListener("mousedown", onClick);
      document.documentElement.classList.remove("custom-cursor");
    };
  }, [x, y, angle]);

  if (!enabled) return null;

  return (
    <>
      {/* TRAIL — fading echoes following the dot */}
      {trail.map((p, i) => {
        const t = (i + 1) / TRAIL_LEN;
        return (
          <motion.div
            key={p.id}
            aria-hidden
            initial={{ opacity: 0.5 * t, scale: 1 * t }}
            animate={{ opacity: 0, scale: 0.3 * t }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              transform: `translate(${p.x}px, ${p.y}px) translate(-50%, -50%)`,
              width: 6,
              height: 6,
              borderRadius: 999,
              background: "var(--coral)",
              pointerEvents: "none",
              zIndex: 9998,
            }}
          />
        );
      })}

      {/* RING / FOLLOWER — lags behind, morphs by mode */}
      <motion.div
        aria-hidden
        style={{
          x: rx, y: ry, translateX: "-50%", translateY: "-50%",
          position: "fixed", top: 0, left: 0,
          pointerEvents: "none", zIndex: 9999,
          mixBlendMode: "normal",
        }}
        animate={{
          width:
            mode === "button" ? (label ? 80 : 56) :
            mode === "input"  ? 4 :
            mode === "code"   ? 22 :
            mode === "image"  ? 56 :
            28,
          height:
            mode === "button" ? 56 :
            mode === "input"  ? 26 :
            mode === "code"   ? 22 :
            mode === "image"  ? 56 :
            28,
          borderRadius:
            mode === "input" || mode === "code" ? 2 :
            999,
          backgroundColor:
            mode === "button" ? "rgba(220,76,62,0.12)" :
            mode === "input"  ? "var(--ink)" :
            mode === "code"   ? "var(--ink)" :
            mode === "image"  ? "rgba(13,13,16,0.04)" :
            "rgba(13,13,16,0)",
          borderWidth: mode === "input" || mode === "code" ? 0 : 1.5,
          borderColor:
            mode === "button" ? "var(--coral)" :
            mode === "image"  ? "var(--ink)" :
            "rgba(13,13,16,0.45)",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 28, mass: 0.5 }}
        className="border-solid"
      >
        <ModeContent mode={mode} label={label} angle={angle} />
      </motion.div>

      {/* DOT — instant follow, hides when ring takes over */}
      <motion.div
        aria-hidden
        style={{
          x, y, translateX: "-50%", translateY: "-50%",
          position: "fixed", top: 0, left: 0,
          width: 6, height: 6, borderRadius: 999,
          background: "var(--ink)",
          pointerEvents: "none",
          zIndex: 9999,
        }}
        animate={{
          opacity: mode === "default" ? 1 : 0,
          scale:   mode === "default" ? 1 : 0.3,
        }}
        transition={{ duration: 0.15 }}
      />

      {/* CLICK BURSTS */}
      <AnimatePresence>
        {bursts.map((b) => (
          <Burst key={b.id} x={b.x} y={b.y} />
        ))}
      </AnimatePresence>
    </>
  );
}

/** Inside-the-ring graphic per mode. */
function ModeContent({
  mode,
  label,
  angle,
}: {
  mode: Mode;
  label: string;
  angle: MotionValue<number>;
}) {
  if (mode === "button") {
    return (
      <div className="absolute inset-0 flex items-center justify-center gap-1.5 px-2">
        {/* Arrow that rotates with cursor velocity */}
        <motion.svg
          width="14" height="14" viewBox="0 0 24 24"
          style={{ rotate: angle, color: "var(--coral)" }}
        >
          <path
            d="M5 12h14M13 5l7 7-7 7"
            fill="none" stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round"
          />
        </motion.svg>
        {label && (
          <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-coral whitespace-nowrap">
            {label}
          </span>
        )}
      </div>
    );
  }
  if (mode === "input") {
    return (
      <span
        aria-hidden
        className="absolute inset-0 animate-pulse"
        style={{ background: "var(--ink)" }}
      />
    );
  }
  if (mode === "code") {
    return (
      <span
        aria-hidden
        className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-bold"
        style={{ color: "var(--bg)" }}
      >
        $_
      </span>
    );
  }
  if (mode === "image") {
    // Magnifying-glass: ring + diagonal handle
    return (
      <svg
        aria-hidden
        viewBox="0 0 56 56"
        className="absolute inset-0"
        style={{ overflow: "visible" }}
      >
        <line
          x1="42" y1="42" x2="58" y2="58"
          stroke="var(--ink)" strokeWidth="3" strokeLinecap="round"
        />
      </svg>
    );
  }
  return null;
}

function Burst({ x, y }: { x: number; y: number }) {
  return (
    <>
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <motion.div
          key={deg}
          aria-hidden
          initial={{
            x, y,
            translateX: "-50%", translateY: "-50%",
            opacity: 0.85,
            scale: 0.4,
          }}
          animate={{
            x: x + Math.cos((deg * Math.PI) / 180) * 28,
            y: y + Math.sin((deg * Math.PI) / 180) * 28,
            opacity: 0,
            scale: 0.1,
          }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          style={{
            position: "fixed", top: 0, left: 0,
            width: 6, height: 6, borderRadius: 999,
            background: "var(--coral)",
            pointerEvents: "none",
            zIndex: 9997,
          }}
        />
      ))}
    </>
  );
}
