// Three-language i18n — English / Hebrew / Russian.
//
// Pure module — no next/headers, no DOM. Safe to import from both
// client and server components. Cookie-reading helper lives in
// `lib/i18n-server.ts` because it pulls in next/headers.
//
// Usage:
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
  // ===== nav + footer + banner =====
  "nav.businesses": "Businesses",
  "nav.install": "Install",
  "nav.new": "New business",
  "footer.tagline": "autonomous marketing",
  "banner.title": "Demo mode.",
  "banner.body":
    "The backend isn't wired up here. Install in 2 minutes to get the full autonomous loop.",
  "banner.cta": "Install →",

  // ===== home =====
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

  // ===== onboarding =====
  "onboard.title.1": "Onboard a",
  "onboard.title.2": "business",
  "onboard.subtitle":
    "The more detail you share, the better the first research + strategy pass. You can edit everything later.",
  "onboard.name": "Name *",
  "onboard.name.ph": "e.g. Acme Coffee",
  "onboard.website": "Website",
  "onboard.website.ph": "acme.com",
  "onboard.desc": "Description",
  "onboard.desc.ph": "What does this business / app / idea do? What makes it different?",
  "onboard.industry": "Industry / niche",
  "onboard.industry.ph": "specialty coffee, B2B SaaS, …",
  "onboard.goals": "Goals",
  "onboard.goals.ph": "awareness, leads, signups, retention",
  "onboard.audience": "Target audience",
  "onboard.audience.ph": "Who are they? Where do they hang out? What do they care about?",
  "onboard.tier": "Tier",
  "onboard.tier.free": "Local LLM · preview only · manual approve",
  "onboard.tier.basic": "Claude Haiku · 1 platform live · daily loop",
  "onboard.tier.pro": "Claude Sonnet · 5 platforms · hourly loop",
  "onboard.tier.enterprise": "Claude Opus · all platforms · autonomous agents",
  "onboard.creating": "Creating…",
  "onboard.create": "Create & start research →",
  "onboard.cancel": "Cancel",
  "onboard.error": "Failed to create business",

  // ===== install =====
  "install.badge": "One-click install",
  "install.title.1": "Get running in",
  "install.title.2": "under 2 minutes",
  "install.subtitle":
    "Copy one line into your terminal, or download the installer and double-click. That's it.",
  "install.windows": "Windows",
  "install.windows.desc": "PowerShell one-liner",
  "install.windows.hint":
    "Opens PowerShell, downloads the installer, and runs it. Installs Git + Docker via winget if missing.",
  "install.mac": "macOS",
  "install.mac.desc": "Terminal one-liner",
  "install.mac.hint": "Paste into Terminal. Requires Docker Desktop running.",
  "install.linux": "Linux",
  "install.linux.desc": "bash one-liner",
  "install.linux.hint": "Requires docker + docker-compose-plugin.",
  "install.android": "Android",
  "install.android.desc": "Signed APK — install directly",
  "install.android.hint":
    "Download, then open the file on your phone. Enable 'Install from unknown sources' for your browser when prompted. 3 MB.",
  "install.docker": "Docker",
  "install.docker.desc": "Manual compose",
  "install.docker.hint": "Full control. Edit .env before bringing the stack up.",
  "install.vercel": "Vercel + Railway",
  "install.vercel.desc": "Production deploy",
  "install.vercel.hint":
    "Zero-ops production setup. Vercel runs the UI, Railway runs the Python backend + worker.",
  "install.copy": "Copy",
  "install.term": "Copy + open terminal",
  "install.term.copied": "Copied — paste in terminal",
  "install.term.opened": "Terminal opened",
  "install.dl.bat": "Download .bat (double-click)",
  "install.dl.ps1": ".ps1 script",
  "install.dl.sh": "Download .sh",
  "install.dl.apk": "Download APK (3 MB)",
  "install.dl.direct": "Install directly",
  "install.gh.view": "View on GitHub",
  "install.deploy": "Deploy to Vercel →",
  "install.steps.title": "What happens",
  "install.step.1.t": "Download + deps",
  "install.step.1.d": "Clones repo, installs Docker + Git via winget if needed",
  "install.step.2.t": "Configure",
  "install.step.2.d": "Creates .env from template; prompts for your Anthropic API key",
  "install.step.3.t": "Launch",
  "install.step.3.d":
    "Brings up Postgres + Redis + backend + worker + UI, opens the dashboard",
  "install.tr.title": "Troubleshooting",
  "install.tr.1.q": "The .ps1 file opens in Notepad instead of running",
  "install.tr.1.a":
    "That's Windows' default: .ps1 files aren't executed on double-click for security. Two fixes: use the one-liner above (it pipes the script straight into PowerShell), or download install.bat — that's a real launcher.",
  "install.tr.2.q": "\"execution of scripts is disabled on this system\"",
  "install.tr.2.a":
    "The one-liner bypasses execution policy. If you downloaded the .ps1, right-click → Run with PowerShell, or run: powershell -ExecutionPolicy Bypass -File install.ps1",
  "install.tr.3.q": "Docker says \"Cannot connect to the Docker daemon\"",
  "install.tr.3.a":
    "Docker Desktop isn't running. Start it from the Start menu (Windows) or Applications (Mac), wait until the whale icon goes green, then re-run.",

  // ===== dashboard (business) =====
  "dash.back": "← Businesses",
  "dash.tab.overview": "Overview",
  "dash.tab.content": "Content",
  "dash.tab.media": "Media",
  "dash.tab.connections": "Connections",
  "dash.stat.research": "Research passes",
  "dash.stat.strategies": "Strategies",
  "dash.stat.campaigns": "Campaigns",
  "dash.stat.optimizations": "Optimizations",
  "dash.research.title": "Latest research",
  "dash.research.empty":
    "No research yet — it runs automatically after onboarding. Refresh in a moment.",
  "dash.research.competitors": "Competitors",
  "dash.research.trends": "Trends",
  "dash.strategy.title": "Latest strategy",
  "dash.strategy.empty": "No strategy yet. Generate one once research is ready.",
  "dash.strategy.positioning": "Positioning",
  "dash.strategy.value": "Value prop",
  "dash.strategy.channels": "Channels",
  "dash.strategy.pillars": "Messaging pillars",
  "dash.camp.title": "Campaigns",
  "dash.camp.empty": "No campaigns yet. Publish a strategy to create campaigns.",
  "dash.opt.title": "Recent optimizations",
  "dash.opt.changes": "changes applied",
  "dash.act.research": "Run research",
  "dash.act.researching": "Researching…",
  "dash.act.strategy": "Generate strategy",
  "dash.act.generating": "Generating…",
  "dash.act.publish": "Publish latest strategy",
  "dash.act.publishing": "Publishing…",
  "dash.act.no_strategy": "No strategy yet — generate one first.",

  // ===== content =====
  "content.title": "All content",
  "content.subtitle":
    "Every variant Biazmark has generated for this business, across channels and campaigns.",
  "content.kind.all": "All",
  "content.kind.post": "Posts",
  "content.kind.ad": "Ads",
  "content.kind.article": "Articles",
  "content.kind.email": "Emails",
  "content.empty": "No content yet. Generate a strategy and publish it to produce variants.",
  "content.cta": "CTA",

  // ===== media =====
  "media.title": "Media gallery",
  "media.subtitle": "Every image + video Biazmark has generated for this business.",
  "media.empty": "No media yet. Media is generated alongside each content variant.",

  // ===== connections =====
  "conn.title": "Connections",
  "conn.subtitle":
    "Connect each platform once — Biazmark will post, run ads, and pull metrics on its own.",
  "conn.platforms": "Platforms",
  "conn.status.connected": "connected",
  "conn.status.notconn": "not connected",
  "conn.status.appcreds": "app credentials needed",
  "conn.status.envcreds": "env credentials",
  "conn.oauth.hint": "to your .env to enable OAuth.",
  "conn.acc.details": "Account details",
  "conn.media.title": "Media generation providers",
  "conn.media.video": "images + video",
  "conn.media.images": "images only",
  "conn.media.ready": "ready",
  "conn.media.add": "add API key to .env",
  "conn.media.note":
    "The first configured provider is used. Placeholder is always available so the pipeline never blocks — swap it out by adding an OpenAI / Replicate / Stability key.",
  "conn.btn.connect": "Connect",
  "conn.btn.connecting": "Connecting…",
  "conn.btn.disconnect": "Disconnect",

  // ===== campaign detail =====
  "camp.back": "← Dashboard",
  "camp.stat.imp": "Impressions",
  "camp.stat.clicks": "Clicks",
  "camp.stat.conv": "Conversions",
  "camp.stat.spend": "Spend",
  "camp.stat.rev": "Revenue",
  "camp.variants.title": "Content variants",
  "camp.var.cta": "CTA",
  "camp.var.visual": "Visual",
  "camp.mini.imp": "Imp",
  "camp.mini.clk": "Clk",
  "camp.mini.conv": "Conv",
  "camp.mini.roas": "ROAS",
  "camp.opt.run": "Run optimize cycle",
  "camp.opt.running": "Analysing…",
  "camp.opt.done": "Optimization cycle complete",

  // ===== 404 =====
  "nf.body": "Not found.",
  "nf.back": "← Home",
};

const he: Dict = {
  // ===== nav + footer + banner =====
  "nav.businesses": "עסקים",
  "nav.install": "התקנה",
  "nav.new": "עסק חדש",
  "footer.tagline": "שיווק אוטונומי",
  "banner.title": "מצב דמו.",
  "banner.body": "ה-backend לא מחובר כאן. התקן ב-2 דקות לקבלת הלופ האוטונומי המלא.",
  "banner.cta": "התקן ←",

  // ===== home =====
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

  // ===== onboarding =====
  "onboard.title.1": "הוסף",
  "onboard.title.2": "עסק",
  "onboard.subtitle":
    "ככל שתספר יותר פרטים, המחקר והאסטרטגיה הראשונים יהיו מדויקים יותר. אפשר לערוך הכל אחר כך.",
  "onboard.name": "שם *",
  "onboard.name.ph": "לדוגמה: Acme Coffee",
  "onboard.website": "אתר",
  "onboard.website.ph": "acme.com",
  "onboard.desc": "תיאור",
  "onboard.desc.ph": "מה העסק / האפליקציה / הרעיון עושים? במה זה שונה?",
  "onboard.industry": "תעשייה / נישה",
  "onboard.industry.ph": "קפה ספיישלטי, B2B SaaS, …",
  "onboard.goals": "מטרות",
  "onboard.goals.ph": "מודעות, לידים, הרשמות, שימור",
  "onboard.audience": "קהל יעד",
  "onboard.audience.ph": "מי הם? איפה הם נמצאים? מה חשוב להם?",
  "onboard.tier": "מסלול",
  "onboard.tier.free": "LLM מקומי · רק תצוגה · אישור ידני",
  "onboard.tier.basic": "Claude Haiku · פלטפורמה אחת חיה · לופ יומי",
  "onboard.tier.pro": "Claude Sonnet · 5 פלטפורמות · לופ שעתי",
  "onboard.tier.enterprise": "Claude Opus · כל הפלטפורמות · סוכנים אוטונומיים",
  "onboard.creating": "יוצר…",
  "onboard.create": "צור והתחל מחקר ←",
  "onboard.cancel": "ביטול",
  "onboard.error": "יצירת העסק נכשלה",

  // ===== install =====
  "install.badge": "התקנה בקליק אחד",
  "install.title.1": "מתחילים תוך",
  "install.title.2": "פחות מ-2 דקות",
  "install.subtitle":
    "תעתיק שורה אחת לטרמינל, או תוריד את ה-installer ולחץ עליו פעמיים. זהו.",
  "install.windows": "Windows",
  "install.windows.desc": "שורה אחת ב-PowerShell",
  "install.windows.hint":
    "פותח PowerShell, מוריד את ה-installer ומריץ אותו. מתקין Git + Docker דרך winget אם חסר.",
  "install.mac": "macOS",
  "install.mac.desc": "שורה אחת בטרמינל",
  "install.mac.hint": "תדביק לטרמינל. דורש Docker Desktop פעיל.",
  "install.linux": "Linux",
  "install.linux.desc": "שורה אחת ב-bash",
  "install.linux.hint": "דורש docker + docker-compose-plugin.",
  "install.android": "Android",
  "install.android.desc": "APK חתום — התקנה ישירה",
  "install.android.hint":
    "תוריד, ואז פתח את הקובץ בטלפון. הפעל 'התקנה ממקורות לא מזוהים' לדפדפן כשנשאלת. 3 MB.",
  "install.docker": "Docker",
  "install.docker.desc": "compose ידני",
  "install.docker.hint": "שליטה מלאה. תערוך את .env לפני שתעלה את הסטאק.",
  "install.vercel": "Vercel + Railway",
  "install.vercel.desc": "דפלוי לפרודקשן",
  "install.vercel.hint":
    "פרודקשן ללא תחזוקה. Vercel מריץ את ה-UI, Railway מריץ את ה-backend + worker.",
  "install.copy": "העתק",
  "install.term": "העתק + פתח טרמינל",
  "install.term.copied": "הועתק — תדביק בטרמינל",
  "install.term.opened": "טרמינל נפתח",
  "install.dl.bat": "הורד .bat (לחיצה כפולה)",
  "install.dl.ps1": "סקריפט .ps1",
  "install.dl.sh": "הורד .sh",
  "install.dl.apk": "הורד APK (3 MB)",
  "install.dl.direct": "התקן ישירות",
  "install.gh.view": "ראה ב-GitHub",
  "install.deploy": "דפלוי ל-Vercel ←",
  "install.steps.title": "מה קורה",
  "install.step.1.t": "הורדה + dependencies",
  "install.step.1.d": "משכפל ריפו, מתקין Docker + Git דרך winget אם צריך",
  "install.step.2.t": "הגדרה",
  "install.step.2.d": "יוצר .env מתבנית; שואל על מפתח Anthropic שלך",
  "install.step.3.t": "הפעלה",
  "install.step.3.d": "מעלה Postgres + Redis + backend + worker + UI, פותח את הדאשבורד",
  "install.tr.title": "פתרון בעיות",
  "install.tr.1.q": "קובץ ה-.ps1 נפתח ב-Notepad במקום לרוץ",
  "install.tr.1.a":
    "ברירת המחדל של Windows: קבצי .ps1 לא רצים בלחיצה כפולה מטעמי אבטחה. שני פתרונות: השתמש בשורה הקצרה למעלה (היא מזרימה את הסקריפט ישירות ל-PowerShell), או הורד את install.bat — זה launcher אמיתי.",
  "install.tr.2.q": "\"execution of scripts is disabled on this system\"",
  "install.tr.2.a":
    "השורה הקצרה עוקפת את execution policy. אם הורדת .ps1, קליק ימני ← Run with PowerShell, או הרץ: powershell -ExecutionPolicy Bypass -File install.ps1",
  "install.tr.3.q": "Docker אומר \"Cannot connect to the Docker daemon\"",
  "install.tr.3.a":
    "Docker Desktop לא רץ. הפעל אותו מ-Start menu (Windows) או Applications (Mac), חכה שצלמית הלוויתן תהפוך לירוקה, ואז הרץ שוב.",

  // ===== dashboard =====
  "dash.back": "← עסקים",
  "dash.tab.overview": "סקירה",
  "dash.tab.content": "תוכן",
  "dash.tab.media": "מדיה",
  "dash.tab.connections": "חיבורים",
  "dash.stat.research": "מחקרים",
  "dash.stat.strategies": "אסטרטגיות",
  "dash.stat.campaigns": "קמפיינים",
  "dash.stat.optimizations": "אופטימיזציות",
  "dash.research.title": "מחקר אחרון",
  "dash.research.empty":
    "אין מחקר עדיין — הוא רץ אוטומטית אחרי הוספת העסק. רענן בעוד רגע.",
  "dash.research.competitors": "מתחרים",
  "dash.research.trends": "מגמות",
  "dash.strategy.title": "אסטרטגיה אחרונה",
  "dash.strategy.empty": "אין אסטרטגיה עדיין. צור אחת ברגע שהמחקר מוכן.",
  "dash.strategy.positioning": "מיצוב",
  "dash.strategy.value": "Value prop",
  "dash.strategy.channels": "ערוצים",
  "dash.strategy.pillars": "Messaging pillars",
  "dash.camp.title": "קמפיינים",
  "dash.camp.empty": "אין קמפיינים עדיין. פרסם אסטרטגיה כדי ליצור קמפיינים.",
  "dash.opt.title": "אופטימיזציות אחרונות",
  "dash.opt.changes": "שינויים יושמו",
  "dash.act.research": "הרץ מחקר",
  "dash.act.researching": "חוקר…",
  "dash.act.strategy": "צור אסטרטגיה",
  "dash.act.generating": "מייצר…",
  "dash.act.publish": "פרסם אסטרטגיה אחרונה",
  "dash.act.publishing": "מפרסם…",
  "dash.act.no_strategy": "אין אסטרטגיה — צור אחת קודם.",

  // ===== content =====
  "content.title": "כל התוכן",
  "content.subtitle": "כל וריאציה ש-Biazmark ייצר עבור העסק הזה, על פני כל הערוצים והקמפיינים.",
  "content.kind.all": "הכל",
  "content.kind.post": "פוסטים",
  "content.kind.ad": "מודעות",
  "content.kind.article": "כתבות",
  "content.kind.email": "אימיילים",
  "content.empty": "אין תוכן עדיין. צור אסטרטגיה ופרסם אותה כדי להפיק וריאציות.",
  "content.cta": "CTA",

  // ===== media =====
  "media.title": "גלריית מדיה",
  "media.subtitle": "כל תמונה ווידאו ש-Biazmark ייצר עבור העסק הזה.",
  "media.empty": "אין מדיה עדיין. מדיה נוצרת לצד כל וריאציית תוכן.",

  // ===== connections =====
  "conn.title": "חיבורים",
  "conn.subtitle":
    "חבר כל פלטפורמה פעם אחת — Biazmark יפרסם, יריץ מודעות וימשוך מטריקות בעצמו.",
  "conn.platforms": "פלטפורמות",
  "conn.status.connected": "מחובר",
  "conn.status.notconn": "לא מחובר",
  "conn.status.appcreds": "צריך פרטי אפליקציה",
  "conn.status.envcreds": "פרטים מ-env",
  "conn.oauth.hint": "ל-.env שלך כדי להפעיל OAuth.",
  "conn.acc.details": "פרטי חשבון",
  "conn.media.title": "ספקי יצירת מדיה",
  "conn.media.video": "תמונות + וידאו",
  "conn.media.images": "תמונות בלבד",
  "conn.media.ready": "מוכן",
  "conn.media.add": "הוסף API key ל-.env",
  "conn.media.note":
    "הספק הראשון שמוגדר נמצא בשימוש. ה-Placeholder תמיד זמין כדי שהפייפליין לעולם לא ייתקע — תחליף אותו בהוספת מפתח OpenAI / Replicate / Stability.",
  "conn.btn.connect": "התחבר",
  "conn.btn.connecting": "מתחבר…",
  "conn.btn.disconnect": "התנתק",

  // ===== campaign =====
  "camp.back": "← דאשבורד",
  "camp.stat.imp": "חשיפות",
  "camp.stat.clicks": "קליקים",
  "camp.stat.conv": "המרות",
  "camp.stat.spend": "הוצאה",
  "camp.stat.rev": "הכנסה",
  "camp.variants.title": "וריאציות תוכן",
  "camp.var.cta": "CTA",
  "camp.var.visual": "ויזואל",
  "camp.mini.imp": "חשי",
  "camp.mini.clk": "קלי",
  "camp.mini.conv": "המר",
  "camp.mini.roas": "ROAS",
  "camp.opt.run": "הרץ מחזור אופטימיזציה",
  "camp.opt.running": "מנתח…",
  "camp.opt.done": "מחזור האופטימיזציה הושלם",

  // ===== 404 =====
  "nf.body": "לא נמצא.",
  "nf.back": "← בית",
};

const ru: Dict = {
  // ===== nav + footer + banner =====
  "nav.businesses": "Бизнесы",
  "nav.install": "Установка",
  "nav.new": "Новый бизнес",
  "footer.tagline": "автономный маркетинг",
  "banner.title": "Демо-режим.",
  "banner.body":
    "Бэкенд не подключён. Установите за 2 минуты для полного автономного цикла.",
  "banner.cta": "Установить →",

  // ===== home =====
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

  // ===== onboarding =====
  "onboard.title.1": "Добавить",
  "onboard.title.2": "бизнес",
  "onboard.subtitle":
    "Чем больше деталей вы укажете, тем точнее будут первое исследование и стратегия. Всё можно отредактировать потом.",
  "onboard.name": "Название *",
  "onboard.name.ph": "например, Acme Coffee",
  "onboard.website": "Сайт",
  "onboard.website.ph": "acme.com",
  "onboard.desc": "Описание",
  "onboard.desc.ph": "Чем занимается этот бизнес / приложение / идея? Чем он отличается?",
  "onboard.industry": "Индустрия / ниша",
  "onboard.industry.ph": "specialty coffee, B2B SaaS, …",
  "onboard.goals": "Цели",
  "onboard.goals.ph": "узнаваемость, лиды, регистрации, удержание",
  "onboard.audience": "Целевая аудитория",
  "onboard.audience.ph": "Кто они? Где обитают? Что им важно?",
  "onboard.tier": "Тариф",
  "onboard.tier.free": "Локальный LLM · только превью · ручное одобрение",
  "onboard.tier.basic": "Claude Haiku · 1 платформа в эфире · ежедневный цикл",
  "onboard.tier.pro": "Claude Sonnet · 5 платформ · часовой цикл",
  "onboard.tier.enterprise": "Claude Opus · все платформы · автономные агенты",
  "onboard.creating": "Создание…",
  "onboard.create": "Создать и запустить исследование →",
  "onboard.cancel": "Отмена",
  "onboard.error": "Не удалось создать бизнес",

  // ===== install =====
  "install.badge": "Установка в один клик",
  "install.title.1": "Запуск за",
  "install.title.2": "менее чем 2 минуты",
  "install.subtitle":
    "Скопируйте одну строку в терминал или скачайте установщик и кликните дважды. Всё.",
  "install.windows": "Windows",
  "install.windows.desc": "Однострочник для PowerShell",
  "install.windows.hint":
    "Открывает PowerShell, скачивает установщик и запускает его. Поставит Git + Docker через winget, если их нет.",
  "install.mac": "macOS",
  "install.mac.desc": "Однострочник для терминала",
  "install.mac.hint": "Вставьте в терминал. Требуется запущенный Docker Desktop.",
  "install.linux": "Linux",
  "install.linux.desc": "Однострочник для bash",
  "install.linux.hint": "Требуется docker + docker-compose-plugin.",
  "install.android": "Android",
  "install.android.desc": "Подписанный APK — установка напрямую",
  "install.android.hint":
    "Скачайте, затем откройте файл на телефоне. Включите 'Установка из неизвестных источников' для браузера. 3 МБ.",
  "install.docker": "Docker",
  "install.docker.desc": "Ручной compose",
  "install.docker.hint": "Полный контроль. Отредактируйте .env перед запуском.",
  "install.vercel": "Vercel + Railway",
  "install.vercel.desc": "Деплой в продакшн",
  "install.vercel.hint":
    "Продакшн без обслуживания. Vercel отвечает за UI, Railway — за Python-бэкенд + worker.",
  "install.copy": "Копировать",
  "install.term": "Скопировать + открыть терминал",
  "install.term.copied": "Скопировано — вставьте в терминал",
  "install.term.opened": "Терминал открыт",
  "install.dl.bat": "Скачать .bat (двойной клик)",
  "install.dl.ps1": "Скрипт .ps1",
  "install.dl.sh": "Скачать .sh",
  "install.dl.apk": "Скачать APK (3 МБ)",
  "install.dl.direct": "Установить напрямую",
  "install.gh.view": "Смотреть на GitHub",
  "install.deploy": "Деплой на Vercel →",
  "install.steps.title": "Что произойдёт",
  "install.step.1.t": "Скачивание + зависимости",
  "install.step.1.d": "Клонирует репозиторий, ставит Docker + Git через winget при необходимости",
  "install.step.2.t": "Конфигурация",
  "install.step.2.d": "Создаёт .env из шаблона; запросит ваш ключ Anthropic API",
  "install.step.3.t": "Запуск",
  "install.step.3.d":
    "Поднимает Postgres + Redis + backend + worker + UI, открывает дашборд",
  "install.tr.title": "Решение проблем",
  "install.tr.1.q": "Файл .ps1 открывается в Блокноте вместо запуска",
  "install.tr.1.a":
    "По умолчанию Windows не запускает .ps1 двойным кликом из соображений безопасности. Два решения: используйте однострочник выше (он отправляет скрипт прямо в PowerShell) или скачайте install.bat — это полноценный лаунчер.",
  "install.tr.2.q": "\"execution of scripts is disabled on this system\"",
  "install.tr.2.a":
    "Однострочник обходит execution policy. Если скачали .ps1: правый клик → Run with PowerShell, или: powershell -ExecutionPolicy Bypass -File install.ps1",
  "install.tr.3.q": "Docker пишет \"Cannot connect to the Docker daemon\"",
  "install.tr.3.a":
    "Docker Desktop не запущен. Запустите его из меню Пуск (Windows) или Applications (Mac), дождитесь, пока значок кита станет зелёным, и попробуйте снова.",

  // ===== dashboard =====
  "dash.back": "← Бизнесы",
  "dash.tab.overview": "Обзор",
  "dash.tab.content": "Контент",
  "dash.tab.media": "Медиа",
  "dash.tab.connections": "Подключения",
  "dash.stat.research": "Исследований",
  "dash.stat.strategies": "Стратегий",
  "dash.stat.campaigns": "Кампаний",
  "dash.stat.optimizations": "Оптимизаций",
  "dash.research.title": "Последнее исследование",
  "dash.research.empty":
    "Исследования ещё нет — оно запускается автоматически после онбординга. Обновите через мгновение.",
  "dash.research.competitors": "Конкуренты",
  "dash.research.trends": "Тренды",
  "dash.strategy.title": "Последняя стратегия",
  "dash.strategy.empty": "Стратегии ещё нет. Создайте, как только будет готово исследование.",
  "dash.strategy.positioning": "Позиционирование",
  "dash.strategy.value": "Value prop",
  "dash.strategy.channels": "Каналы",
  "dash.strategy.pillars": "Messaging pillars",
  "dash.camp.title": "Кампании",
  "dash.camp.empty": "Кампаний ещё нет. Опубликуйте стратегию, чтобы создать кампании.",
  "dash.opt.title": "Недавние оптимизации",
  "dash.opt.changes": "изменений применено",
  "dash.act.research": "Запустить исследование",
  "dash.act.researching": "Исследование…",
  "dash.act.strategy": "Создать стратегию",
  "dash.act.generating": "Генерация…",
  "dash.act.publish": "Опубликовать последнюю стратегию",
  "dash.act.publishing": "Публикация…",
  "dash.act.no_strategy": "Стратегии ещё нет — создайте сначала.",

  // ===== content =====
  "content.title": "Весь контент",
  "content.subtitle":
    "Каждый вариант, который Biazmark создал для этого бизнеса — по всем каналам и кампаниям.",
  "content.kind.all": "Все",
  "content.kind.post": "Посты",
  "content.kind.ad": "Реклама",
  "content.kind.article": "Статьи",
  "content.kind.email": "Письма",
  "content.empty":
    "Контента ещё нет. Создайте стратегию и опубликуйте её, чтобы получить варианты.",
  "content.cta": "CTA",

  // ===== media =====
  "media.title": "Галерея медиа",
  "media.subtitle": "Все изображения и видео, созданные Biazmark для этого бизнеса.",
  "media.empty": "Медиа ещё нет. Они создаются вместе с каждым вариантом контента.",

  // ===== connections =====
  "conn.title": "Подключения",
  "conn.subtitle":
    "Подключите каждую платформу один раз — Biazmark будет публиковать, запускать рекламу и собирать метрики сам.",
  "conn.platforms": "Платформы",
  "conn.status.connected": "подключено",
  "conn.status.notconn": "не подключено",
  "conn.status.appcreds": "нужны учётки приложения",
  "conn.status.envcreds": "учётки из env",
  "conn.oauth.hint": "в ваш .env, чтобы включить OAuth.",
  "conn.acc.details": "Детали аккаунта",
  "conn.media.title": "Провайдеры генерации медиа",
  "conn.media.video": "изображения + видео",
  "conn.media.images": "только изображения",
  "conn.media.ready": "готов",
  "conn.media.add": "добавьте API-ключ в .env",
  "conn.media.note":
    "Используется первый настроенный провайдер. Placeholder доступен всегда, чтобы пайплайн никогда не вставал — замените, добавив ключ OpenAI / Replicate / Stability.",
  "conn.btn.connect": "Подключить",
  "conn.btn.connecting": "Подключение…",
  "conn.btn.disconnect": "Отключить",

  // ===== campaign =====
  "camp.back": "← Дашборд",
  "camp.stat.imp": "Показы",
  "camp.stat.clicks": "Клики",
  "camp.stat.conv": "Конверсии",
  "camp.stat.spend": "Расход",
  "camp.stat.rev": "Доход",
  "camp.variants.title": "Варианты контента",
  "camp.var.cta": "CTA",
  "camp.var.visual": "Визуал",
  "camp.mini.imp": "Пок",
  "camp.mini.clk": "Клк",
  "camp.mini.conv": "Кнв",
  "camp.mini.roas": "ROAS",
  "camp.opt.run": "Запустить цикл оптимизации",
  "camp.opt.running": "Анализ…",
  "camp.opt.done": "Цикл оптимизации завершён",

  // ===== 404 =====
  "nf.body": "Не найдено.",
  "nf.back": "← На главную",
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
