"use client";

/**
 * Custom magnetic cursor — follows the mouse with springy lag, snaps to
 * interactive elements (buttons, links), blend-mode renders white over dark.
 *
 * Disabled on touch devices (where `(hover: hover)` is false).
 * Hides the native cursor only on the body via global CSS hook below.
 */

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [text, setText] = useState<string>("");

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  // Springy follow — gives the cursor a nice elastic lag.
  const sx = useSpring(x, { stiffness: 600, damping: 32, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 600, damping: 32, mass: 0.4 });

  useEffect(() => {
    if (!window.matchMedia("(hover: hover)").matches) return;
    setEnabled(true);
    document.documentElement.classList.add("custom-cursor");

    function onMove(e: MouseEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
    }

    function pickHover(target: EventTarget | null) {
      if (!(target instanceof Element)) return;
      const el = target.closest<HTMLElement>(
        "a, button, [role='button'], input, textarea, select, [data-cursor]"
      );
      if (el) {
        setHovering(true);
        setText(el.dataset.cursor || "");
      } else {
        setHovering(false);
        setText("");
      }
    }

    function onOver(e: MouseEvent) { pickHover(e.target); }
    function onOut(e: MouseEvent) { pickHover((e as any).relatedTarget); }

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mouseout", onOut);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mouseout", onOut);
      document.documentElement.classList.remove("custom-cursor");
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      {/* Ring — large, lags more, blend mode */}
      <motion.div
        aria-hidden
        style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: hovering ? 64 : 28,
          height: hovering ? 64 : 28,
          backgroundColor: hovering ? "rgba(167,139,250,0.18)" : "rgba(255,255,255,0)",
          borderColor: hovering ? "rgba(244,114,182,0.6)" : "rgba(255,255,255,0.45)",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full border mix-blend-difference"
      >
        {text && (
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-white whitespace-nowrap">
            {text}
          </span>
        )}
      </motion.div>
      {/* Dot — tight, instant follow */}
      <motion.div
        aria-hidden
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: hovering ? 0 : 1, scale: hovering ? 0.4 : 1 }}
        transition={{ duration: 0.15 }}
        className="pointer-events-none fixed top-0 left-0 z-[9999] w-1.5 h-1.5 rounded-full bg-white mix-blend-difference"
      />
    </>
  );
}
