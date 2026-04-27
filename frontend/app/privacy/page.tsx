import type { Metadata } from "next";
import { getLocale } from "@/lib/i18n-server";
import { type Locale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Privacy Policy",
  alternates: { canonical: "https://autocmo.app/privacy" },
};

const COPY: Record<Locale, { title: string; updated: string; intro: string; sections: { h: string; p: string }[] }> = {
  en: {
    title: "Privacy Policy",
    updated: "Last updated: April 2026",
    intro:
      "AutoCMO (\"we\", \"us\") provides an autonomous marketing service. This page explains what we collect, why, and how to control it. We aim for the minimum data needed to operate the service.",
    sections: [
      {
        h: "What we collect",
        p: "Account info you give us (business name, description, industry, audience). Content the service generates on your behalf. OAuth tokens for the platforms you connect (Meta, Google, LinkedIn, X, TikTok, Resend, WordPress) — encrypted with Fernet at rest. Operational metrics from those platforms (impressions, clicks, spend) so the optimization loop can do its job. Server logs (IP, user agent, request path) for security and debugging.",
      },
      {
        h: "How we use it",
        p: "Solely to operate AutoCMO for you: research your market, write content, publish on your behalf, analyze metrics, and improve future campaigns. We do not sell, rent, or share data with third parties for advertising. Generated content is processed by Anthropic (Claude) and, optionally, OpenAI / Replicate / Stability for media.",
      },
      {
        h: "Where it lives",
        p: "Render's managed Postgres in the EU/US (region of your instance). OAuth tokens are encrypted at rest. Generated media files live on the same disk volume. We don't ship raw data to any third party except the LLM/media providers you've configured.",
      },
      {
        h: "Your rights",
        p: "You can disconnect any platform from the Connections page (we revoke and delete the token immediately). You can delete a business and all its content via the API or by emailing us — we delete within 30 days. EU/UK residents have GDPR rights (access, rectification, erasure, portability) — same email.",
      },
      {
        h: "Cookies",
        p: "We set one cookie: `biazmark.lang` (your language preference, 1 year). No tracking, no analytics, no ad pixels.",
      },
      {
        h: "Changes",
        p: "We'll update this page when material things change and bump the date at the top.",
      },
      {
        h: "Contact",
        p: "Reach us by email — see the project repository on GitHub.",
      },
    ],
  },
  he: {
    title: "מדיניות פרטיות",
    updated: "עודכן לאחרונה: אפריל 2026",
    intro:
      "AutoCMO (\"אנחנו\") מספק שירות שיווק אוטונומי. הדף הזה מסביר מה אנחנו אוספים, למה, ואיך לשלוט בזה. אנחנו שואפים למינימום נתונים הדרוש להפעלת השירות.",
    sections: [
      {
        h: "מה אנחנו אוספים",
        p: "פרטי חשבון שאתה מספק (שם עסק, תיאור, תעשייה, קהל). תוכן שהשירות מייצר עבורך. טוקני OAuth לפלטפורמות שאתה מחבר (Meta, Google, LinkedIn, X, TikTok, Resend, WordPress) — מוצפנים ב-Fernet בעת המנוחה. מטריקות תפעוליות מהפלטפורמות (חשיפות, קליקים, הוצאה) כדי שלולאת האופטימיזציה תוכל לעבוד. לוגים של שרת (IP, user agent, נתיב בקשה) לצרכי אבטחה ודיבאג.",
      },
      {
        h: "איך אנחנו משתמשים בזה",
        p: "אך ורק להפעלת AutoCMO עבורך: מחקר השוק, כתיבת תוכן, פרסום בשמך, ניתוח מטריקות ושיפור קמפיינים עתידיים. איננו מוכרים, משכירים או חולקים נתונים עם צדדים שלישיים לצרכי פרסום. תוכן שנוצר מעובד על ידי Anthropic (Claude) ו(אופציונלית) OpenAI / Replicate / Stability עבור מדיה.",
      },
      {
        h: "איפה זה נשמר",
        p: "Postgres מנוהל של Render באירופה/ארה\"ב (האזור של המופע שלך). טוקני OAuth מוצפנים. קבצי מדיה שנוצרו נמצאים על אותו volume. איננו שולחים נתונים גולמיים לצד שלישי כלשהו, פרט לספקי ה-LLM/מדיה שהגדרת.",
      },
      {
        h: "הזכויות שלך",
        p: "אתה יכול לנתק כל פלטפורמה מדף החיבורים (אנחנו מבטלים ומוחקים את הטוקן מיידית). אתה יכול למחוק עסק ואת כל התוכן שלו דרך ה-API או באימייל אלינו — אנחנו מוחקים תוך 30 יום. תושבי אירופה/בריטניה זכאים לזכויות GDPR (גישה, תיקון, מחיקה, ניידות) — אותו אימייל.",
      },
      {
        h: "עוגיות",
        p: "אנחנו מציבים cookie אחד: `biazmark.lang` (העדפת השפה שלך, לשנה). אין מעקב, אין אנליטיקות, אין פיקסלי פרסום.",
      },
      {
        h: "שינויים",
        p: "נעדכן את הדף הזה כשדברים מהותיים משתנים ונעדכן את התאריך למעלה.",
      },
      {
        h: "צור קשר",
        p: "תוכל לפנות אלינו באימייל — ראה את ה-repository של הפרויקט ב-GitHub.",
      },
    ],
  },
  ru: {
    title: "Политика конфиденциальности",
    updated: "Последнее обновление: апрель 2026",
    intro:
      "AutoCMO (\"мы\") предоставляет услугу автономного маркетинга. На этой странице — что мы собираем, зачем и как этим управлять. Мы стремимся к минимуму данных, необходимых для работы сервиса.",
    sections: [
      {
        h: "Что мы собираем",
        p: "Информация об аккаунте, которую вы предоставляете (название бизнеса, описание, индустрия, аудитория). Контент, создаваемый сервисом для вас. OAuth-токены для подключаемых платформ (Meta, Google, LinkedIn, X, TikTok, Resend, WordPress) — шифруются Fernet в покое. Операционные метрики платформ (показы, клики, расход) — нужны циклу оптимизации. Серверные логи (IP, user agent, путь запроса) — для безопасности и отладки.",
      },
      {
        h: "Как мы это используем",
        p: "Исключительно для работы AutoCMO для вас: исследование рынка, написание контента, публикация от вашего имени, анализ метрик, улучшение будущих кампаний. Мы не продаём, не сдаём в аренду и не передаём данные третьим сторонам для рекламы. Сгенерированный контент обрабатывается Anthropic (Claude) и (опционально) OpenAI / Replicate / Stability для медиа.",
      },
      {
        h: "Где это хранится",
        p: "Управляемый Postgres от Render в ЕС/США (регион вашего инстанса). OAuth-токены шифруются. Сгенерированные медиа-файлы лежат на том же дисковом томе. Мы не передаём сырые данные третьим сторонам, кроме настроенных вами провайдеров LLM/медиа.",
      },
      {
        h: "Ваши права",
        p: "Можно отключить любую платформу со страницы «Подключения» (токен немедленно отзывается и удаляется). Можно удалить бизнес и весь его контент через API или email — удалим в течение 30 дней. Жители ЕС/Великобритании имеют права GDPR (доступ, исправление, удаление, переносимость) — тот же email.",
      },
      {
        h: "Cookies",
        p: "Мы ставим одну cookie: `biazmark.lang` (ваш выбор языка, 1 год). Никакого трекинга, аналитики или рекламных пикселей.",
      },
      {
        h: "Изменения",
        p: "Мы обновим эту страницу при существенных изменениях и поднимем дату вверху.",
      },
      {
        h: "Контакт",
        p: "Свяжитесь с нами по email — см. репозиторий проекта на GitHub.",
      },
    ],
  },
};

export default async function PrivacyPage() {
  const locale = await getLocale();
  const c = COPY[locale];

  return (
    <article className="prose prose-invert max-w-3xl mx-auto py-8">
      <h1 className="text-4xl font-bold mb-2">{c.title}</h1>
      <p className="text-sm text-slate-500 mb-6">{c.updated}</p>
      <p className="text-slate-300 leading-relaxed">{c.intro}</p>
      {c.sections.map((s) => (
        <section key={s.h} className="mt-8">
          <h2 className="text-xl font-semibold mb-2">{s.h}</h2>
          <p className="text-slate-300 leading-relaxed">{s.p}</p>
        </section>
      ))}
    </article>
  );
}
