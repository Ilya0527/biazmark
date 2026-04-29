"use client";

/**
 * Refined Anglo-modern ambient — three slow-drifting tinted gradients on a
 * warm off-white base. No canvas churn, no GPU spiking. The point is *whisper*,
 * not spectacle: the eye registers shape and color, the conscious mind doesn't.
 *
 * Variant kept for API compat but visual is now identical across variants —
 * the page-level decoration is what gives each section its character.
 */

import { useId } from "react";

export default function AmbientBackground({
  intensity = 0.6,
}: {
  variant?: "mesh" | "constellation" | "waves";
  intensity?: number;
}) {
  const id = useId();
  const o = Math.max(0, Math.min(1, intensity));

  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
    >
      {/* Coral wash — top-right */}
      <div
        className="absolute"
        style={{
          top: "-180px", right: "-160px",
          width: 620, height: 620,
          background: "radial-gradient(circle, rgba(220,76,62,0.35), transparent 70%)",
          filter: "blur(60px)",
          opacity: 0.7 * o,
          animation: "drift-a 32s ease-in-out infinite",
        }}
      />
      {/* Navy wash — bottom-left */}
      <div
        className="absolute"
        style={{
          bottom: "-160px", left: "-140px",
          width: 540, height: 540,
          background: "radial-gradient(circle, rgba(26,36,64,0.18), transparent 70%)",
          filter: "blur(70px)",
          opacity: 0.8 * o,
          animation: "drift-b 38s ease-in-out infinite",
        }}
      />
      {/* Sun wash — center, very soft */}
      <div
        className="absolute"
        style={{
          top: "30%", left: "30%",
          width: 460, height: 460,
          background: "radial-gradient(circle, rgba(244,193,77,0.25), transparent 70%)",
          filter: "blur(80px)",
          opacity: 0.6 * o,
          animation: "drift-c 44s ease-in-out infinite",
        }}
      />

      {/* Hairline grid — barely there */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.18]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id={`grid-${id}`} width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#0d0d10" strokeWidth="0.4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grid-${id})`} />
      </svg>

      {/* Editorial accents — three tiny geometric marks at fixed positions */}
      <span
        className="absolute"
        style={{
          top: "12%", left: "6%",
          width: 6, height: 6, borderRadius: 999,
          background: "var(--coral)",
          opacity: 0.7,
        }}
      />
      <span
        className="absolute"
        style={{
          top: "70%", right: "8%",
          width: 8, height: 8,
          background: "var(--navy)",
          opacity: 0.5,
          transform: "rotate(45deg)",
        }}
      />
      <span
        className="absolute"
        style={{
          bottom: "20%", left: "40%",
          width: 22, height: 1,
          background: "var(--ink)",
          opacity: 0.3,
        }}
      />
    </div>
  );
}
