"use client";

/**
 * "The loop never sleeps" — visual signature of an autonomous marketing system.
 *
 * Seven stages of the autonomous loop, scrolling horizontally as a seamless
 * marquee. The strip never stops moving, mirroring the product itself: brief
 * in, campaigns out, optimisations forever.
 *
 *   Brief → Research → Strategy → Content → Publish → Analyse → Optimise ↻
 *
 * Pure CSS animation (already in globals.css as `.animate-marquee`). No JS
 * runtime cost. RTL-safe — the marquee direction visually flips because we
 * duplicate the row content twice in source order.
 */

import { type Locale, t } from "@/lib/i18n";

const STAGES = [
  { key: "brief",     label: { en: "Brief",     he: "תיאור",        ru: "Бриф" } },
  { key: "research",  label: { en: "Research",  he: "מחקר",         ru: "Исследование" } },
  { key: "strategy",  label: { en: "Strategy",  he: "אסטרטגיה",     ru: "Стратегия" } },
  { key: "content",   label: { en: "Content",   he: "תוכן",         ru: "Контент" } },
  { key: "publish",   label: { en: "Publish",   he: "פרסום",        ru: "Публикация" } },
  { key: "analyse",   label: { en: "Analyse",   he: "ניתוח",        ru: "Анализ" } },
  { key: "optimise",  label: { en: "Optimise",  he: "אופטימיזציה",  ru: "Оптимизация" } },
];

const TITLE: Record<Locale, string> = {
  en: "The loop never sleeps.",
  he: "הלולאה לא נחה.",
  ru: "Цикл никогда не спит.",
};

const SUBTITLE: Record<Locale, string> = {
  en: "Seven stages run continuously, day and night, every account.",
  he: "שבעה שלבים פועלים ברצף, יום ולילה, בכל חשבון.",
  ru: "Семь этапов работают непрерывно, днём и ночью, на каждом аккаунте.",
};

export default function TheLoop({ locale }: { locale: Locale }) {
  // Render stages twice for seamless marquee
  const list = [...STAGES, ...STAGES];

  return (
    <section className="relative">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tightest leading-tight">
          {TITLE[locale]}
        </h2>
        <p className="text-muted text-sm md:text-base mt-3">{SUBTITLE[locale]}</p>
      </div>

      {/* Edge fades — top + bottom of the marquee fade into the bg.
          left/right gradient masks make the strip feel infinite. */}
      <div
        className="relative overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
        }}
      >
        <div
          className="flex items-center gap-6 md:gap-10 animate-marquee py-6"
          dir="ltr"
          style={{ width: "max-content" }}
        >
          {list.map((s, i) => (
            <div key={i} className="flex items-center gap-6 md:gap-10 shrink-0">
              <Stage label={s.label[locale]} index={i % STAGES.length} />
              <Arrow />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stage({ label, index }: { label: string; index: number }) {
  return (
    <div className="flex items-center gap-3 shrink-0">
      <span
        className="inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-mono font-semibold"
        style={{
          background: index % 2 === 0 ? "var(--coral)" : "var(--navy)",
          color: "#fff",
        }}
      >
        {(index + 1).toString().padStart(2, "0")}
      </span>
      <span
        className="serif"
        style={{
          fontSize: "clamp(28px, 4vw, 48px)",
          color: "var(--ink)",
          letterSpacing: "-0.03em",
          lineHeight: 1,
        }}
      >
        {label}
      </span>
    </div>
  );
}

function Arrow() {
  return (
    <svg
      width="22"
      height="14"
      viewBox="0 0 22 14"
      aria-hidden
      className="shrink-0"
      style={{ color: "var(--muted)" }}
    >
      <path
        d="M0 7 H18 M14 2 L20 7 L14 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
