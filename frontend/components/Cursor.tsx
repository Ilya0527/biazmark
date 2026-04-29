"use client";

/**
 * Multi-state contextual cursor + random easter-egg "tricks".
 *
 *   default  ─  small coral dot + comet trail (6 fading echoes)
 *   button   ─  ring expands to 56px, arrow inside that POINTS the direction
 *               the cursor is moving (rotates with velocity vector)
 *   input    ─  vertical text bar │ that pulses
 *   code     ─  terminal block ▮ in mono
 *   image    ─  magnifier circle with diagonal handle
 *
 *   click    ─  6-particle burst radiating outward, then fade
 *
 *   🎁 TRICKS — every 12-22 seconds while in default mode the dot becomes one
 *      of these for ~2.5s then returns to normal. Pure delight, no purpose.
 *      star · heart · airplane · sparkles · bone · coffee · compass · lightning · planet
 *
 * Mode is detected from `event.target.closest(...)` — every interactive
 * element gets its own treatment automatically. Optional `data-cursor` attr
 * forces a mode or label. Disabled on touch devices.
 */

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, type MotionValue } from "framer-motion";

type Mode = "default" | "button" | "input" | "code" | "image";
type Trick =
  | "star"
  | "heart"
  | "airplane"
  | "sparkles"
  | "bone"
  | "coffee"
  | "compass"
  | "lightning"
  | "planet";

const TRICKS: Trick[] = ["star", "heart", "airplane", "sparkles", "bone", "coffee", "compass", "lightning", "planet"];

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

  // Random trick scheduler — runs only while we're in default mode.
  const [trick, setTrick] = useState<Trick | null>(null);
  useEffect(() => {
    if (mode !== "default" || trick) return;
    const next = 12000 + Math.random() * 10000; // 12-22 seconds
    const t = setTimeout(() => {
      const pick = TRICKS[Math.floor(Math.random() * TRICKS.length)];
      setTrick(pick);
      // each trick lives ~2.5s
      setTimeout(() => setTrick(null), 2600);
    }, next);
    return () => clearTimeout(t);
  }, [mode, trick]);

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

      {/* DOT — instant follow, hides when ring takes over OR when a trick is on */}
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
          opacity: mode === "default" && !trick ? 1 : 0,
          scale:   mode === "default" && !trick ? 1 : 0.3,
        }}
        transition={{ duration: 0.15 }}
      />

      {/* TRICK — random easter-egg cursor effect */}
      <AnimatePresence>
        {mode === "default" && trick && (
          <motion.div
            key={trick + trailIdRef.current}
            aria-hidden
            style={{
              x, y, translateX: "-50%", translateY: "-50%",
              position: "fixed", top: 0, left: 0,
              pointerEvents: "none",
              zIndex: 9999,
            }}
          >
            <TrickContent trick={trick} />
          </motion.div>
        )}
      </AnimatePresence>

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

/* ─── Random easter-egg tricks ─── */

function TrickContent({ trick }: { trick: Trick }) {
  switch (trick) {
    case "star": return <TrickStar />;
    case "heart": return <TrickHeart />;
    case "airplane": return <TrickAirplane />;
    case "sparkles": return <TrickSparkles />;
    case "bone": return <TrickBone />;
    case "coffee": return <TrickCoffee />;
    case "compass": return <TrickCompass />;
    case "lightning": return <TrickLightning />;
    case "planet": return <TrickPlanet />;
  }
}

function TrickStar() {
  return (
    <motion.svg
      width="28" height="28" viewBox="0 0 24 24"
      style={{ marginLeft: -14, marginTop: -14 }}
      initial={{ scale: 0, rotate: -180, opacity: 0 }}
      animate={{ scale: [0, 1.2, 1, 1, 0], rotate: [0, 360, 720], opacity: [0, 1, 1, 1, 0] }}
      transition={{ duration: 2.5, ease: "easeInOut" }}
    >
      <path
        d="M12 2l2.6 6.5L21 9.6l-5 4.6 1.4 6.6L12 17.5l-5.4 3.3L8 14.2 3 9.6l6.4-1.1L12 2z"
        fill="var(--coral)"
        stroke="var(--ink)"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </motion.svg>
  );
}

function TrickHeart() {
  return (
    <motion.svg
      width="22" height="22" viewBox="0 0 24 24"
      style={{ marginLeft: -11, marginTop: -11 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: [0, 1.3, 1, 1.3, 1, 1.3, 0],
        opacity: [0, 1, 1, 1, 1, 1, 0],
      }}
      transition={{ duration: 2.5, times: [0, 0.15, 0.3, 0.5, 0.7, 0.85, 1] }}
    >
      <path
        d="M12 21s-7-4.5-9.5-9C1 9 2.5 5 6.5 5c2 0 3.5 1 5.5 3 2-2 3.5-3 5.5-3 4 0 5.5 4 4 7-2.5 4.5-9.5 9-9.5 9z"
        fill="var(--coral)"
        stroke="var(--ink)"
        strokeWidth="0.8"
      />
    </motion.svg>
  );
}

function TrickAirplane() {
  return (
    <motion.svg
      width="26" height="26" viewBox="0 0 24 24"
      style={{ marginLeft: -13, marginTop: -13 }}
      initial={{ scale: 0, x: -40, y: 30, rotate: -45, opacity: 0 }}
      animate={{
        scale: [0, 1, 1, 1, 0],
        x:     [-40, 0, 0, 50, 80],
        y:     [30, 0, 0, -30, -60],
        rotate:[-45, -20, -20, 0, 20],
        opacity:[0, 1, 1, 1, 0],
      }}
      transition={{ duration: 2.5, ease: "easeOut" }}
    >
      <path
        d="M2.5 19.5l19-8-19-8 0 6.5 14 1.5-14 1.5z"
        fill="var(--ink)"
        stroke="var(--ink)"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
    </motion.svg>
  );
}

function TrickSparkles() {
  // 5 sparkles popping in a constellation around the cursor
  const positions = [
    { x: -20, y: -16, delay: 0,    size: 10 },
    { x:  18, y: -20, delay: 0.2,  size: 8  },
    { x: -22, y:  14, delay: 0.4,  size: 7  },
    { x:  20, y:  16, delay: 0.6,  size: 9  },
    { x:   0, y:  24, delay: 0.8,  size: 6  },
  ];
  return (
    <>
      {positions.map((p, i) => (
        <motion.svg
          key={i}
          width={p.size} height={p.size} viewBox="0 0 24 24"
          style={{ position: "absolute", left: p.x, top: p.y, marginLeft: -p.size/2, marginTop: -p.size/2 }}
          initial={{ scale: 0, opacity: 0, rotate: 0 }}
          animate={{ scale: [0, 1.2, 0], opacity: [0, 1, 0], rotate: [0, 180] }}
          transition={{ duration: 1.4, delay: p.delay, ease: "easeOut" }}
        >
          <path
            d="M12 2l2 8 8 2-8 2-2 8-2-8-8-2 8-2z"
            fill="var(--coral)"
          />
        </motion.svg>
      ))}
    </>
  );
}

function TrickBone() {
  // The user mentioned "כלב ועצם" — the bone, wagging.
  return (
    <motion.svg
      width="28" height="14" viewBox="0 0 28 14"
      style={{ marginLeft: -14, marginTop: -7 }}
      initial={{ scale: 0, rotate: 0, opacity: 0 }}
      animate={{
        scale:  [0, 1, 1, 1, 1, 1, 0],
        rotate: [0, -20, 20, -20, 20, 0, 0],
        opacity:[0, 1, 1, 1, 1, 1, 0],
      }}
      transition={{ duration: 2.5, ease: "easeInOut" }}
    >
      <path
        d="M5 7 C5 4, 2 4, 2 7 C2 10, 5 10, 5 7 L23 7 C23 10, 26 10, 26 7 C26 4, 23 4, 23 7 Z"
        fill="#f7f4ea"
        stroke="var(--ink)"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </motion.svg>
  );
}

function TrickCoffee() {
  return (
    <motion.div
      style={{ marginLeft: -14, marginTop: -16, position: "relative" }}
      initial={{ scale: 0, y: 10, opacity: 0 }}
      animate={{
        scale: [0, 1, 1, 1, 0],
        y:     [10, 0, -2, 0, -10],
        opacity:[0, 1, 1, 1, 0],
      }}
      transition={{ duration: 2.5, ease: "easeInOut" }}
    >
      {/* steam */}
      <motion.svg
        width="28" height="10" viewBox="0 0 28 10"
        style={{ position: "absolute", top: -8, left: 0 }}
        animate={{ y: [-2, -6, -10], opacity: [0.8, 0.4, 0] }}
        transition={{ duration: 1.4, repeat: 1, ease: "easeOut" }}
      >
        <path d="M8 9c0-2 2-3 2-5s-2-3-2-5" stroke="var(--ink)" strokeWidth="1.2" fill="none" opacity="0.6" />
        <path d="M16 9c0-2 2-3 2-5s-2-3-2-5" stroke="var(--ink)" strokeWidth="1.2" fill="none" opacity="0.6" />
      </motion.svg>
      {/* cup */}
      <svg width="28" height="22" viewBox="0 0 28 22">
        <path
          d="M3 4 L21 4 L20 18 C20 20 18 21 16 21 L8 21 C6 21 4 20 4 18 Z"
          fill="#f7f4ea" stroke="var(--ink)" strokeWidth="1.4" strokeLinejoin="round"
        />
        <path
          d="M21 8 C25 8 25 14 21 14"
          fill="none" stroke="var(--ink)" strokeWidth="1.4"
        />
        <ellipse cx="12" cy="6" rx="7" ry="1.2" fill="var(--coral)" opacity="0.75" />
      </svg>
    </motion.div>
  );
}

function TrickCompass() {
  return (
    <motion.svg
      width="28" height="28" viewBox="0 0 24 24"
      style={{ marginLeft: -14, marginTop: -14 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
      transition={{ duration: 2.5 }}
    >
      <circle cx="12" cy="12" r="10" fill="#f7f4ea" stroke="var(--ink)" strokeWidth="1.2" />
      <motion.g
        style={{ originX: "12px", originY: "12px" }}
        animate={{ rotate: [0, 270, 90, 360, 720] }}
        transition={{ duration: 2.5, ease: "easeInOut" }}
      >
        <polygon points="12,4 14,12 12,20 10,12" fill="var(--coral)" />
        <circle cx="12" cy="12" r="1.4" fill="var(--ink)" />
      </motion.g>
    </motion.svg>
  );
}

function TrickLightning() {
  return (
    <motion.svg
      width="22" height="28" viewBox="0 0 24 30"
      style={{ marginLeft: -11, marginTop: -14 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale:   [0, 1.2, 1, 1.3, 1, 0],
        opacity: [0, 1, 1, 1, 1, 0],
        rotate:  [-10, 5, -5, 10, 0],
      }}
      transition={{ duration: 1.6, ease: "easeOut" }}
    >
      <path
        d="M14 1 L4 16 L11 16 L9 29 L20 13 L13 13 Z"
        fill="var(--sun)"
        stroke="var(--ink)"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </motion.svg>
  );
}

function TrickPlanet() {
  return (
    <motion.div
      style={{ marginLeft: -22, marginTop: -22 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
      transition={{ duration: 2.5 }}
    >
      <motion.svg
        width="44" height="44" viewBox="0 0 44 44"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 2.5, ease: "linear" }}
      >
        {/* ring */}
        <ellipse
          cx="22" cy="22" rx="20" ry="6"
          fill="none" stroke="var(--ink)" strokeWidth="1.2"
        />
        {/* planet body */}
        <circle cx="22" cy="22" r="8" fill="var(--coral)" stroke="var(--ink)" strokeWidth="1" />
        {/* small moon */}
        <circle cx="42" cy="22" r="2" fill="var(--ink)" />
      </motion.svg>
    </motion.div>
  );
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
