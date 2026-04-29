"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { t, type Locale, DEFAULT_LOCALE } from "@/lib/i18n";

/**
 * Shows a dismissible banner when the backend API is unreachable.
 *
 * The Vercel-hosted demo doesn't have a backend wired up by default, so the
 * dashboard pages would look broken. This banner explains why + points at the
 * install page so visitors can spin up their own stack.
 *
 * When a backend IS reachable (or the user has dismissed the banner) we render
 * nothing — no layout shift, no chrome.
 */
export default function BackendBanner({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const [state, setState] = useState<"checking" | "ok" | "down" | "dismissed">("checking");

  useEffect(() => {
    if (sessionStorage.getItem("biazmark.banner.dismissed") === "1") {
      setState("dismissed");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const base =
          (typeof window !== "undefined" && localStorage.getItem("biazmark.apiBase")) ||
          process.env.NEXT_PUBLIC_API_URL ||
          "";
        const r = await fetch(`${base}/api/health`, { cache: "no-store" });
        if (!cancelled) setState(r.ok ? "ok" : "down");
      } catch {
        if (!cancelled) setState("down");
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (state !== "down") return null;

  return (
    <div
      className="relative z-30 border-b border-ink-300"
      style={{ background: "linear-gradient(90deg, rgba(245,158,11,0.08), rgba(236,72,153,0.08))" }}
    >
      <div className="max-w-6xl mx-auto px-6 py-2.5 flex items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2 text-coral min-w-0">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
          <span className="truncate">
            <span className="font-semibold">{t(locale, "banner.title")}</span>{" "}
            <span className="text-muted">
              {t(locale, "banner.body")}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link href="/install" className="btn-ghost !py-1 !px-2 text-coral hover:text-ink-900">
            {t(locale, "banner.cta")}
          </Link>
          <button
            type="button"
            aria-label="Dismiss"
            onClick={() => {
              sessionStorage.setItem("biazmark.banner.dismissed", "1");
              setState("dismissed");
            }}
            className="text-coral/60 hover:text-coral px-1"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
