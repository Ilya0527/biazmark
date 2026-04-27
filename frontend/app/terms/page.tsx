import type { Metadata } from "next";
import { getLocale } from "@/lib/i18n-server";
import { type Locale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Terms of Service",
  alternates: { canonical: "https://autocmo.app/terms" },
};

const COPY: Record<Locale, { title: string; updated: string; sections: { h: string; p: string }[] }> = {
  en: {
    title: "Terms of Service",
    updated: "Last updated: April 2026",
    sections: [
      { h: "1. The service",
        p: "AutoCMO is an autonomous marketing pipeline: you describe a business, we run research, write strategy, generate content, publish to platforms you've connected, and optimize over time. The output is AI-generated and you remain responsible for what gets published from your accounts." },
      { h: "2. Your responsibilities",
        p: "You must own or be authorised to use any platforms you connect. You are responsible for the legal compliance of campaigns published from your accounts (advertising laws, FTC disclosures, GDPR, platform ToS, etc). Don't use AutoCMO to generate hateful, illegal, or deceptive content." },
      { h: "3. AI-generated content",
        p: "Content is produced by large language models and image models. It can be wrong, off-brand, or unsuitable. You should review before publishing — the dashboard lets you preview, edit, approve, or reject every variant before it goes live." },
      { h: "4. Availability",
        p: "We aim for high uptime but the service is provided as-is, without warranties. The free tier sleeps after 15 minutes of inactivity (Render's free plan)." },
      { h: "5. Pricing",
        p: "The hosted service is currently free. LLM and image API costs are billed by your configured providers (Anthropic, OpenAI, Replicate, Stability) directly." },
      { h: "6. Termination",
        p: "You can stop using the service and delete your data at any time. We can suspend accounts that abuse the service or violate these terms." },
      { h: "7. Liability",
        p: "To the maximum extent permitted by law, we are not liable for indirect or consequential damages arising from use of the service. Our total liability is capped at the amount you've paid us in the last 12 months." },
      { h: "8. Changes",
        p: "We'll update these terms when needed and post the new date at the top." },
    ],
  },
  he: {
    title: "תנאי שימוש",
    updated: "עודכן לאחרונה: אפריל 2026",
    sections: [
      { h: "1. השירות",
        p: "AutoCMO הוא צינור שיווק אוטונומי: אתה מתאר עסק, אנחנו מבצעים מחקר, כותבים אסטרטגיה, מייצרים תוכן, מפרסמים בפלטפורמות שחיברת ומבצעים אופטימיזציה לאורך זמן. הפלט מיוצר על ידי AI ואתה נשאר אחראי על מה שמתפרסם מהחשבונות שלך." },
      { h: "2. האחריות שלך",
        p: "עליך להחזיק או להיות מורשה להשתמש בכל פלטפורמה שאתה מחבר. אתה אחראי על הציות החוקי של קמפיינים שמפורסמים מהחשבונות שלך (חוקי פרסום, GDPR, ToS של פלטפורמות וכד'). אל תשתמש ב-AutoCMO לייצור תוכן שנאה, בלתי חוקי או מטעה." },
      { h: "3. תוכן שנוצר על ידי AI",
        p: "תוכן מיוצר על ידי מודלי שפה ותמונות. הוא יכול להיות שגוי, לא תואם למותג או לא מתאים. עליך לסקור לפני פרסום — הדאשבורד מאפשר תצוגה מקדימה, עריכה, אישור או דחייה של כל וריאציה לפני שהיא יוצאת." },
      { h: "4. זמינות",
        p: "אנחנו שואפים לזמינות גבוהה אך השירות ניתן AS-IS, ללא אחריות. ה-tier החינמי נכנס למצב שינה אחרי 15 דקות של חוסר פעילות (תוכנית חינמית של Render)." },
      { h: "5. תמחור",
        p: "השירות המארח חינמי כרגע. עלויות API של LLM ותמונות מחויבות על ידי הספקים שהגדרת (Anthropic, OpenAI, Replicate, Stability) ישירות." },
      { h: "6. סיום",
        p: "אתה יכול להפסיק להשתמש בשירות ולמחוק את הנתונים שלך בכל עת. אנחנו רשאים להשעות חשבונות שמנצלים לרעה את השירות או מפרים את התנאים." },
      { h: "7. אחריות",
        p: "במידה המקסימלית המותרת בחוק, איננו אחראים לנזקים עקיפים או תוצאתיים. האחריות הכוללת שלנו מוגבלת לסכום ששילמת לנו ב-12 החודשים האחרונים." },
      { h: "8. שינויים",
        p: "נעדכן תנאים אלה לפי הצורך ונעדכן את התאריך בראש הדף." },
    ],
  },
  ru: {
    title: "Условия использования",
    updated: "Последнее обновление: апрель 2026",
    sections: [
      { h: "1. Сервис",
        p: "AutoCMO — автономный маркетинговый конвейер: вы описываете бизнес, мы делаем исследование, пишем стратегию, создаём контент, публикуем на подключённых платформах и оптимизируем со временем. Контент создаётся ИИ; ответственность за то, что публикуется с ваших аккаунтов, остаётся на вас." },
      { h: "2. Ваши обязанности",
        p: "Вы должны владеть или быть авторизованным для использования подключаемых платформ. Вы отвечаете за юридическое соответствие публикуемых кампаний (рекламное право, GDPR, правила платформ и т.д.). Не используйте AutoCMO для генерации ненавистнического, незаконного или вводящего в заблуждение контента." },
      { h: "3. Контент, созданный ИИ",
        p: "Контент создаётся языковыми и графическими моделями. Он может быть неточным, не соответствовать бренду или быть неподходящим. Пересматривайте перед публикацией — дашборд позволяет предварительно просмотреть, редактировать, одобрить или отклонить каждый вариант." },
      { h: "4. Доступность",
        p: "Мы стремимся к высокому uptime, но сервис предоставляется AS-IS, без гарантий. Бесплатный план уходит в сон после 15 минут простоя (план Render free)." },
      { h: "5. Цены",
        p: "Хостинг сейчас бесплатный. Расходы на API LLM и изображений выставляются вашими настроенными провайдерами (Anthropic, OpenAI, Replicate, Stability) напрямую." },
      { h: "6. Прекращение",
        p: "Вы можете прекратить использование и удалить данные в любой момент. Мы вправе приостановить аккаунты, злоупотребляющие сервисом или нарушающие эти условия." },
      { h: "7. Ответственность",
        p: "В максимально допустимой законом мере мы не несём ответственности за косвенный или последующий ущерб. Общая ответственность ограничена суммой, уплаченной нам за последние 12 месяцев." },
      { h: "8. Изменения",
        p: "Мы обновим эти условия по мере необходимости и поставим новую дату вверху." },
    ],
  },
};

export default async function TermsPage() {
  const locale = await getLocale();
  const c = COPY[locale];

  return (
    <article className="prose prose-invert max-w-3xl mx-auto py-8">
      <h1 className="text-4xl font-bold mb-2">{c.title}</h1>
      <p className="text-sm text-slate-500 mb-6">{c.updated}</p>
      {c.sections.map((s) => (
        <section key={s.h} className="mt-8">
          <h2 className="text-xl font-semibold mb-2">{s.h}</h2>
          <p className="text-slate-300 leading-relaxed">{s.p}</p>
        </section>
      ))}
    </article>
  );
}
