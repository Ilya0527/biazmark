"use client";

import { useEffect, useState } from "react";
import { LOCALES, LANG_LABEL, LANG_FLAG, LANG_COOKIE, type Locale } from "@/lib/i18n";

/**
 * Compact language switcher — shows the current flag/code, opens a menu of the
 * three locales, sets the cookie + reloads to re-render server components with
 * the new language. No flicker; keeps everything else identical.
 */
export default function LangSwitcher({ initial }: { initial: Locale }) {
  const [locale, setLocale] = useState<Locale>(initial);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest?.("[data-lang-switcher]")) setOpen(false);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  function pick(next: Locale) {
    if (next === locale) {
      setOpen(false);
      return;
    }
    // 1 year, root path so every page sees it
    document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    setLocale(next);
    setOpen(false);
    // Force a server-component re-render with the new cookie.
    location.reload();
  }

  return (
    <div data-lang-switcher className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="btn-ghost text-xs flex items-center gap-1.5 !px-2.5"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Change language"
      >
        <GlobeIcon />
        <span className="font-mono">{LANG_FLAG[locale]}</span>
        <span className="opacity-60">▾</span>
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute end-0 mt-2 min-w-[140px] glass rounded-xl py-1 shadow-2xl z-50 border border-ink-700/50"
        >
          {LOCALES.map((l) => (
            <li key={l}>
              <button
                type="button"
                onClick={() => pick(l)}
                className={`w-full text-start px-3 py-2 text-sm hover:bg-white/5 flex items-center justify-between gap-3 ${
                  l === locale ? "text-accent-300" : "text-slate-300"
                }`}
                role="option"
                aria-selected={l === locale}
              >
                <span>{LANG_LABEL[l]}</span>
                <span className="text-xs font-mono opacity-60">{LANG_FLAG[l]}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function GlobeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a13 13 0 0 1 0 18M12 3a13 13 0 0 0 0 18" />
    </svg>
  );
}
