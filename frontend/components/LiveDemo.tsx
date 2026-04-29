"use client";

/**
 * THE LIVE AI DEMO — visitor types a business in two fields, hits Run,
 * within ~3 seconds Claude Haiku returns a real marketing angle: headline,
 * positioning, post body, CTA, hashtags. No signup, no API key, no friction.
 *
 * This is the product, working, in the visitor's hands within 5 seconds of
 * landing on the homepage. Rate-limited to 5/hour per IP.
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type Locale, t } from "@/lib/i18n";

type DemoResult = {
  headline: string;
  angle: string;
  body: string;
  cta: string;
  hashtags: string[];
};

const COPY: Record<Locale, {
  badge: string;
  title: string;
  industryLabel: string;
  industryPh: string;
  descLabel: string;
  descPh: string;
  cta: string;
  ctaRunning: string;
  result: string;
  resultBody: string;
  resultCta: string;
  thinkingLines: string[];
  errorTitle: string;
  errorRate: string;
  errorOther: string;
  examples: { industry: string; description: string }[];
  tryExample: string;
}> = {
  en: {
    badge: "Live AI · No signup",
    title: "Try it now — get a real marketing angle in 5 seconds.",
    industryLabel: "Industry",
    industryPh: "specialty coffee, B2B SaaS, dental clinic, …",
    descLabel: "What does the business do?",
    descPh: "One or two sentences. The more specific, the better the angle.",
    cta: "Generate angle  →",
    ctaRunning: "Claude is thinking…",
    result: "Headline",
    resultBody: "Post-ready body",
    resultCta: "CTA",
    thinkingLines: [
      "Reading the brief…",
      "Pulling positioning levers…",
      "Drafting headlines…",
      "Tightening the hook…",
    ],
    errorTitle: "Couldn't generate. ",
    errorRate: "You've hit the demo limit (5/hour). Sign up to remove the cap.",
    errorOther: "Try again in a moment.",
    examples: [
      { industry: "specialty coffee", description: "Tel Aviv coffee shop, fresh-roasted single-origin beans, no chain coffee snobs" },
      { industry: "B2B SaaS", description: "Time-tracking app for design agencies, integrates with Figma" },
      { industry: "vegan bakery", description: "Plant-based pastries, gluten-free options, delivers across Israel" },
    ],
    tryExample: "Try an example",
  },
  he: {
    badge: "AI חי · בלי הרשמה",
    title: "נסה עכשיו — תקבל זווית שיווקית אמיתית תוך 5 שניות.",
    industryLabel: "תעשייה",
    industryPh: "קפה ספיישלטי, B2B SaaS, מרפאת שיניים, …",
    descLabel: "מה העסק עושה?",
    descPh: "משפט או שניים. ככל שיותר ספציפי, הזווית טובה יותר.",
    cta: "צור זווית  ←",
    ctaRunning: "Claude חושב…",
    result: "כותרת",
    resultBody: "גוף מוכן לפרסום",
    resultCta: "CTA",
    thinkingLines: [
      "קורא את התיאור…",
      "מושך מנופי מיצוב…",
      "מנסח כותרות…",
      "מהדק את הקרס…",
    ],
    errorTitle: "לא ניתן לייצר כרגע. ",
    errorRate: "הגעת למגבלת ה-demo (5 לשעה). הירשם לקבלת גישה ללא הגבלה.",
    errorOther: "נסה שוב בעוד רגע.",
    examples: [
      { industry: "קפה ספיישלטי", description: "בית קפה בתל אביב, פולים טריים מקלייה אחת, בלי גינוני רשתות" },
      { industry: "B2B SaaS", description: "אפליקציית מעקב שעות לסוכנויות עיצוב, אינטגרציה עם Figma" },
      { industry: "מאפיה טבעונית", description: "מאפים על בסיס צמחי, אופציות ללא גלוטן, משלוח בכל הארץ" },
    ],
    tryExample: "נסה דוגמה",
  },
  ru: {
    badge: "Живой AI · Без регистрации",
    title: "Попробуйте сейчас — реальный маркетинговый угол за 5 секунд.",
    industryLabel: "Индустрия",
    industryPh: "specialty coffee, B2B SaaS, стоматология, …",
    descLabel: "Чем занимается бизнес?",
    descPh: "Одно-два предложения. Чем конкретнее, тем точнее угол.",
    cta: "Создать угол  →",
    ctaRunning: "Claude думает…",
    result: "Заголовок",
    resultBody: "Готовый пост",
    resultCta: "CTA",
    thinkingLines: [
      "Читаю бриф…",
      "Тяну рычаги позиционирования…",
      "Сочиняю заголовки…",
      "Затягиваю крючок…",
    ],
    errorTitle: "Не удалось сгенерировать. ",
    errorRate: "Лимит демо исчерпан (5 в час). Зарегистрируйтесь, чтобы убрать лимит.",
    errorOther: "Попробуйте через минуту.",
    examples: [
      { industry: "specialty coffee", description: "Кофейня в Тель-Авиве, свежеобжаренный single-origin, без сетевого пафоса" },
      { industry: "B2B SaaS", description: "Учёт времени для дизайн-агентств, интеграция с Figma" },
      { industry: "веганская пекарня", description: "Растительная выпечка, без глютена, доставка по Израилю" },
    ],
    tryExample: "Попробуйте пример",
  },
};

export default function LiveDemo({ locale }: { locale: Locale }) {
  const c = COPY[locale];
  const [industry, setIndustry] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<DemoResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [thinkingIdx, setThinkingIdx] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);

  // Cycle through thinking lines while busy
  useEffect(() => {
    if (!busy) return;
    const i = setInterval(() => setThinkingIdx((x) => (x + 1) % c.thinkingLines.length), 900);
    return () => clearInterval(i);
  }, [busy, c.thinkingLines.length]);

  async function run(e?: React.FormEvent) {
    e?.preventDefault();
    if (!industry.trim() || !description.trim()) return;
    setBusy(true);
    setError(null);
    setResult(null);
    setThinkingIdx(0);
    try {
      const r = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ industry, description }),
        cache: "no-store",
      });
      if (!r.ok) {
        if (r.status === 429) setError(c.errorTitle + c.errorRate);
        else setError(c.errorTitle + c.errorOther);
        return;
      }
      const data: DemoResult = await r.json();
      setResult(data);
      // Smooth-scroll the result into view
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
    } catch {
      setError(c.errorTitle + c.errorOther);
    } finally {
      setBusy(false);
    }
  }

  function fillExample(ex: { industry: string; description: string }) {
    setIndustry(ex.industry);
    setDescription(ex.description);
  }

  return (
    <div className="max-w-3xl mx-auto" data-cursor="">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="card relative overflow-hidden"
      >
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-coral mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {c.badge}
          </div>
          <h3 className="text-xl md:text-2xl font-semibold mb-5 leading-tight">{c.title}</h3>

          <form onSubmit={run} className="space-y-3" dir="auto">
            <div className="grid md:grid-cols-[200px_1fr] gap-3">
              <div>
                <label className="label">{c.industryLabel}</label>
                <input
                  className="input"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder={c.industryPh}
                  disabled={busy}
                  maxLength={80}
                />
              </div>
              <div>
                <label className="label">{c.descLabel}</label>
                <input
                  className="input"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={c.descPh}
                  disabled={busy}
                  maxLength={500}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="submit"
                disabled={busy || !industry.trim() || !description.trim()}
                className="btn-primary"
                data-cursor="generate"
              >
                {busy ? c.ctaRunning : c.cta}
              </button>
              <span className="text-xs text-muted ms-2">{c.tryExample}:</span>
              {c.examples.map((ex, i) => (
                <button
                  key={i}
                  type="button"
                  className="text-xs px-2 py-1 rounded-md border border-ink-300 text-muted hover:text-ink-900 hover:border-accent-500/40 transition-colors"
                  onClick={() => fillExample(ex)}
                  disabled={busy}
                >
                  {ex.industry}
                </button>
              ))}
            </div>
          </form>

          {/* Thinking state */}
          <AnimatePresence mode="wait">
            {busy && (
              <motion.div
                key="thinking"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-5 flex items-center gap-3 text-sm text-muted"
              >
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-bounce" />
                </span>
                <motion.span
                  key={thinkingIdx}
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="font-mono text-xs"
                >
                  {c.thinkingLines[thinkingIdx]}
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                key="err"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-5 card !border-amber-500/30 text-coral text-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Result */}
          <AnimatePresence>
            {result && (
              <motion.div
                ref={resultRef}
                key="result"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
                className="mt-6 space-y-4"
              >
                <div className="card !border-accent-500/40 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />
                  <div className="relative">
                    <div className="text-xs uppercase tracking-wider text-coral mb-2">
                      {c.result}
                    </div>
                    <Typewrite
                      text={result.headline}
                      className="text-2xl md:text-3xl font-bold leading-tight"
                      delay={0}
                    />
                    <div className="text-xs italic text-muted mt-2">{result.angle}</div>
                  </div>
                </div>

                <div className="card">
                  <div className="text-xs uppercase tracking-wider text-muted mb-2">
                    {c.resultBody}
                  </div>
                  <Typewrite
                    text={result.body}
                    className="text-base text-ink-900 whitespace-pre-wrap"
                    delay={result.headline.length * 18 + 200}
                  />
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {result.hashtags.map((h, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1 + i * 0.08 }}
                        className="badge badge-accent text-[11px]"
                      >
                        #{h.replace(/^#/, "")}
                      </motion.span>
                    ))}
                  </div>
                </div>

                <div className="text-center">
                  <span className="text-xs text-muted">{c.resultCta}</span>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.4, duration: 0.5 }}
                    className="text-lg font-semibold text-coral mt-1"
                  >
                    → {result.cta}
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

/** Char-by-char typewriter for the AI result. RTL-safe. */
function Typewrite({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const [shown, setShown] = useState("");
  useEffect(() => {
    setShown("");
    let i = 0;
    let t: ReturnType<typeof setTimeout>;
    const start = setTimeout(function tick() {
      i++;
      setShown(text.slice(0, i));
      if (i < text.length) t = setTimeout(tick, 18);
    }, delay);
    return () => { clearTimeout(start); clearTimeout(t); };
  }, [text, delay]);
  return <span className={className}>{shown}<span className="inline-block w-0.5 h-[1em] bg-accent-400 align-middle ms-0.5 animate-pulse" /></span>;
}
