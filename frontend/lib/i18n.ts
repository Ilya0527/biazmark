// Three-language i18n — English / Hebrew / Russian.
//
// This module is PURE (no next/headers, no DOM). Safe to import from both
// client and server components. The cookie-reading helper lives in
// `lib/i18n-server.ts` because it pulls in next/headers.
//
// Usage (anywhere):
//   import { t } from "@/lib/i18n";
//   <h1>{t(locale, "hero.title")}</h1>

export const LOCALES = ["en", "he", "ru"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";
export const LANG_COOKIE = "biazmark.lang";

export const RTL: Record<Locale, boolean> = { en: false, he: true, ru: false };

export const LANG_LABEL: Record<Locale, string> = {
  en: "English",
  he: "עברית",
  ru: "Русский",
};

export const LANG_FLAG: Record<Locale, string> = {
  en: "EN",
  he: "HE",
  ru: "RU",
};

// ---------------- dictionary ----------------

type Dict = Record<string, string>;

const en: Dict = {
  "nav.businesses": "Businesses",
  "nav.install": "Install",
  "nav.new": "New business",

  "hero.badge": "Autonomous · Self-improving · Live",
  "hero.title.1": "Marketing that",
  "hero.title.2": "runs itself.",
  "hero.subtitle":
    "Brief in, campaigns out. Five AI agents handle research, strategy, content, publishing, analytics, and optimization — end to end.",
  "hero.now": "Now generating:",
  "hero.cta.onboard": "Onboard a business →",
  "hero.cta.install": "Install in 2 minutes",
  "hero.cta.docs": "API docs",
  "hero.installer.note": "Windows installer",
  "hero.installer.more": "see Mac, Linux, Docker →",

  "type.1": "Meta ads for a coffee DTC brand",
  "type.2": "LinkedIn posts for a B2B SaaS",
  "type.3": "Articles for a wellness app",
  "type.4": "TikTok scripts for a fashion label",
  "type.5": "Email drip for a bookshop",

  "stats.tier": "Current tier",
  "stats.tier.research": "research",
  "stats.tier.auto": "Autonomous agents on",
  "stats.tier.loop": "Loop",
  "stats.tier.manual": "manual",
  "stats.tier.min": "min",
  "stats.businesses": "Businesses",
  "stats.businesses.managed": "Managed in this instance",
  "stats.businesses.none": "None yet — onboard one",
  "stats.connectors": "Connectors",

  "agents.title": "Five agents. One loop.",
  "agents.researcher": "Researcher",
  "agents.researcher.desc": "Market + competitors",
  "agents.strategist": "Strategist",
  "agents.strategist.desc": "Positioning + channels",
  "agents.creator": "Creator",
  "agents.creator.desc": "Posts · ads · articles · emails",
  "agents.analyst": "Analyst",
  "agents.analyst.desc": "Reads metrics, finds signal",
  "agents.optimizer": "Optimizer",
  "agents.optimizer.desc": "Kills losers, scales winners",

  "biz.title": "Your businesses",
  "biz.new": "+ New",
  "biz.empty": "No businesses yet. Start by",
  "biz.empty.cta": "onboarding one",

  "footer.tagline": "autonomous marketing",

  "banner.title": "Demo mode.",
  "banner.body":
    "The backend isn't wired up here. Install in 2 minutes to get the full autonomous loop.",
  "banner.cta": "Install →",
};

const he: Dict = {
  "nav.businesses": "עסקים",
  "nav.install": "התקנה",
  "nav.new": "עסק חדש",

  "hero.badge": "אוטונומי · משתפר · חי",
  "hero.title.1": "שיווק",
  "hero.title.2": "שעובד לבד.",
  "hero.subtitle":
    "תיאור פנימה, קמפיינים החוצה. חמישה סוכני AI מנהלים מחקר, אסטרטגיה, תוכן, פרסום, ניתוח ואופטימיזציה — מקצה לקצה.",
  "hero.now": "עכשיו מייצר:",
  "hero.cta.onboard": "הוסף עסק ←",
  "hero.cta.install": "התקן ב-2 דקות",
  "hero.cta.docs": "תיעוד API",
  "hero.installer.note": "התקנה ל-Windows",
  "hero.installer.more": "ראה Mac, Linux, Docker ←",

  "type.1": "מודעות Meta למותג קפה DTC",
  "type.2": "פוסטים ב-LinkedIn ל-SaaS B2B",
  "type.3": "כתבות לאפליקציית wellness",
  "type.4": "תסריטי TikTok למותג אופנה",
  "type.5": "סדרת אימיילים לחנות ספרים",

  "stats.tier": "מסלול נוכחי",
  "stats.tier.research": "מחקר",
  "stats.tier.auto": "סוכנים אוטונומיים פעילים",
  "stats.tier.loop": "לופ",
  "stats.tier.manual": "ידני",
  "stats.tier.min": "דקות",
  "stats.businesses": "עסקים",
  "stats.businesses.managed": "מנוהלים במכונה הזו",
  "stats.businesses.none": "עדיין כלום — הוסף עסק",
  "stats.connectors": "ערוצים",

  "agents.title": "חמישה סוכנים. לופ אחד.",
  "agents.researcher": "חוקר",
  "agents.researcher.desc": "שוק + מתחרים",
  "agents.strategist": "אסטרטג",
  "agents.strategist.desc": "מיצוב + ערוצים",
  "agents.creator": "יוצר",
  "agents.creator.desc": "פוסטים · מודעות · כתבות · אימיילים",
  "agents.analyst": "אנליסט",
  "agents.analyst.desc": "קורא מטריקות, מוצא סיגנל",
  "agents.optimizer": "אופטימייזר",
  "agents.optimizer.desc": "מסיים מפסידים, מגדיל מנצחים",

  "biz.title": "העסקים שלך",
  "biz.new": "חדש +",
  "biz.empty": "אין עדיין עסקים. תתחיל",
  "biz.empty.cta": "בהוספת עסק",

  "footer.tagline": "שיווק אוטונומי",

  "banner.title": "מצב דמו.",
  "banner.body": "ה-backend לא מחובר כאן. התקן ב-2 דקות לקבלת הלופ האוטונומי המלא.",
  "banner.cta": "התקן ←",
};

const ru: Dict = {
  "nav.businesses": "Бизнесы",
  "nav.install": "Установка",
  "nav.new": "Новый бизнес",

  "hero.badge": "Автономный · Самообучающийся · Живой",
  "hero.title.1": "Маркетинг, который",
  "hero.title.2": "работает сам.",
  "hero.subtitle":
    "Бриф на входе, кампании на выходе. Пять AI-агентов берут на себя исследование, стратегию, контент, публикацию, аналитику и оптимизацию — от и до.",
  "hero.now": "Сейчас генерирует:",
  "hero.cta.onboard": "Добавить бизнес →",
  "hero.cta.install": "Установить за 2 минуты",
  "hero.cta.docs": "API-документация",
  "hero.installer.note": "Установщик для Windows",
  "hero.installer.more": "см. Mac, Linux, Docker →",

  "type.1": "Meta-реклама для кофейного DTC-бренда",
  "type.2": "Посты в LinkedIn для B2B SaaS",
  "type.3": "Статьи для wellness-приложения",
  "type.4": "Сценарии TikTok для модного бренда",
  "type.5": "Email-цепочка для книжного магазина",

  "stats.tier": "Текущий тариф",
  "stats.tier.research": "исследование",
  "stats.tier.auto": "Автономные агенты включены",
  "stats.tier.loop": "Цикл",
  "stats.tier.manual": "вручную",
  "stats.tier.min": "мин",
  "stats.businesses": "Бизнесы",
  "stats.businesses.managed": "Управляются в этой инстанции",
  "stats.businesses.none": "Пока ничего — добавьте",
  "stats.connectors": "Каналы",

  "agents.title": "Пять агентов. Один цикл.",
  "agents.researcher": "Исследователь",
  "agents.researcher.desc": "Рынок + конкуренты",
  "agents.strategist": "Стратег",
  "agents.strategist.desc": "Позиционирование + каналы",
  "agents.creator": "Креатор",
  "agents.creator.desc": "Посты · реклама · статьи · письма",
  "agents.analyst": "Аналитик",
  "agents.analyst.desc": "Читает метрики, находит сигнал",
  "agents.optimizer": "Оптимизатор",
  "agents.optimizer.desc": "Убирает слабых, масштабирует лидеров",

  "biz.title": "Ваши бизнесы",
  "biz.new": "+ Новый",
  "biz.empty": "Бизнесов пока нет. Начните с",
  "biz.empty.cta": "добавления одного",

  "footer.tagline": "автономный маркетинг",

  "banner.title": "Демо-режим.",
  "banner.body":
    "Бэкенд не подключён. Установите за 2 минуты для полного автономного цикла.",
  "banner.cta": "Установить →",
};

const DICTS: Record<Locale, Dict> = { en, he, ru };

export function t(locale: Locale, key: string): string {
  return DICTS[locale][key] ?? DICTS[DEFAULT_LOCALE][key] ?? key;
}

// Client-side reader (read-only — switching is done by the LangSwitcher component).
export function readLocaleClient(): Locale {
  if (typeof document === "undefined") return DEFAULT_LOCALE;
  const m = document.cookie.match(new RegExp(`(?:^|; )${LANG_COOKIE}=([^;]+)`));
  const v = m?.[1];
  if (v && (LOCALES as readonly string[]).includes(v)) return v as Locale;
  return DEFAULT_LOCALE;
}
