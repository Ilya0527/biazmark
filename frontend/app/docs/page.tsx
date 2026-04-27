import type { Metadata } from "next";
import { getLocale } from "@/lib/i18n-server";
import { type Locale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "API",
  alternates: { canonical: "https://autocmo.app/docs" },
};

const COPY: Record<Locale, { title: string; intro: string; quickstart: string; sections: { h: string; lines: string[] }[] }> = {
  en: {
    title: "API",
    intro:
      "AutoCMO is API-first. The dashboard is just one client; you can drive every step from cURL, a script, or your own UI. The full OpenAPI spec lives at /openapi.json on the backend.",
    quickstart: "Quick start",
    sections: [
      { h: "Auth",
        lines: [
          "Every /api/* request must include the X-API-Key header.",
          "  curl -H 'X-API-Key: <your key>' https://api.autocmo.app/api/tier",
        ],
      },
      { h: "Create a business",
        lines: [
          "  POST /api/businesses",
          "  { \"name\": \"Acme Coffee\", \"description\": \"...\", \"industry\": \"food\", \"tier\": \"basic\" }",
          "Returns the created business; research is kicked off in the background.",
        ],
      },
      { h: "Run the loop",
        lines: [
          "  POST /api/businesses/{id}/research          → re-research",
          "  POST /api/businesses/{id}/strategies        → generate strategy",
          "  POST /api/strategies/{id}/publish           → spawn campaigns + variants",
          "  POST /api/campaigns/{id}/optimize           → kill losers, scale winners",
        ],
      },
      { h: "Read content",
        lines: [
          "  GET /api/businesses/{id}/content           → all variants",
          "  GET /api/businesses/{id}/media             → all generated images/videos",
          "  GET /api/campaigns/{id}/variants",
          "  GET /api/campaigns/{id}/metrics",
        ],
      },
      { h: "Connect a platform (OAuth)",
        lines: [
          "  POST /api/businesses/{id}/oauth/{platform}/start",
          "  → redirect the user to authorise_url",
          "  → on callback we store an encrypted token and the platform is live.",
        ],
      },
      { h: "Health",
        lines: [
          "  GET /healthz   → liveness",
          "  GET /readyz    → liveness + DB round-trip",
          "  GET /api/tier  → current tier + LLM model",
        ],
      },
      { h: "OpenAPI",
        lines: [
          "Full machine-readable spec:  https://api.autocmo.app/openapi.json",
          "Interactive docs:           https://api.autocmo.app/docs",
        ],
      },
    ],
  },
  he: {
    title: "API",
    intro:
      "AutoCMO הוא API-first. הדאשבורד הוא רק לקוח אחד; אפשר להפעיל כל צעד מ-cURL, סקריפט, או UI משלך. ה-OpenAPI המלא ב-/openapi.json של ה-backend.",
    quickstart: "התחלה מהירה",
    sections: [
      { h: "Auth",
        lines: [
          "כל בקשת /api/* חייבת לכלול את ה-header `X-API-Key`.",
          "  curl -H 'X-API-Key: <המפתח שלך>' https://api.autocmo.app/api/tier",
        ],
      },
      { h: "יצירת עסק",
        lines: [
          "  POST /api/businesses",
          "  { \"name\": \"Acme Coffee\", \"description\": \"...\", \"industry\": \"food\", \"tier\": \"basic\" }",
          "מחזיר את העסק שנוצר; המחקר מופעל ברקע.",
        ],
      },
      { h: "הפעלת הלופ",
        lines: [
          "  POST /api/businesses/{id}/research          → מחקר מחדש",
          "  POST /api/businesses/{id}/strategies        → יצירת אסטרטגיה",
          "  POST /api/strategies/{id}/publish           → פיצול קמפיינים + וריאציות",
          "  POST /api/campaigns/{id}/optimize           → סיום מפסידים, הגדלת מנצחים",
        ],
      },
      { h: "קריאת תוכן",
        lines: [
          "  GET /api/businesses/{id}/content           → כל הוריאציות",
          "  GET /api/businesses/{id}/media             → כל התמונות/וידאו שנוצרו",
          "  GET /api/campaigns/{id}/variants",
          "  GET /api/campaigns/{id}/metrics",
        ],
      },
      { h: "חיבור פלטפורמה (OAuth)",
        lines: [
          "  POST /api/businesses/{id}/oauth/{platform}/start",
          "  → הפנה את המשתמש ל-authorise_url",
          "  → ב-callback אנחנו שומרים טוקן מוצפן והפלטפורמה חיה.",
        ],
      },
      { h: "Health",
        lines: [
          "  GET /healthz   → liveness",
          "  GET /readyz    → liveness + DB round-trip",
          "  GET /api/tier  → tier נוכחי + LLM model",
        ],
      },
      { h: "OpenAPI",
        lines: [
          "מפרט מלא קריא-מכונה:  https://api.autocmo.app/openapi.json",
          "תיעוד אינטראקטיבי:    https://api.autocmo.app/docs",
        ],
      },
    ],
  },
  ru: {
    title: "API",
    intro:
      "AutoCMO — API-first. Дашборд — лишь один клиент; вы можете управлять каждым шагом из cURL, скрипта или собственного UI. Полная спецификация OpenAPI на /openapi.json бэкенда.",
    quickstart: "Быстрый старт",
    sections: [
      { h: "Аутентификация",
        lines: [
          "Каждый запрос к /api/* должен содержать заголовок X-API-Key.",
          "  curl -H 'X-API-Key: <ваш ключ>' https://api.autocmo.app/api/tier",
        ],
      },
      { h: "Создать бизнес",
        lines: [
          "  POST /api/businesses",
          "  { \"name\": \"Acme Coffee\", \"description\": \"...\", \"industry\": \"food\", \"tier\": \"basic\" }",
          "Возвращает созданный бизнес; исследование запускается в фоне.",
        ],
      },
      { h: "Запустить цикл",
        lines: [
          "  POST /api/businesses/{id}/research          → повторное исследование",
          "  POST /api/businesses/{id}/strategies        → создать стратегию",
          "  POST /api/strategies/{id}/publish           → породить кампании + варианты",
          "  POST /api/campaigns/{id}/optimize           → убрать слабых, усилить лидеров",
        ],
      },
      { h: "Чтение контента",
        lines: [
          "  GET /api/businesses/{id}/content           → все варианты",
          "  GET /api/businesses/{id}/media             → все изображения/видео",
          "  GET /api/campaigns/{id}/variants",
          "  GET /api/campaigns/{id}/metrics",
        ],
      },
      { h: "Подключить платформу (OAuth)",
        lines: [
          "  POST /api/businesses/{id}/oauth/{platform}/start",
          "  → перенаправьте пользователя на authorise_url",
          "  → на callback мы сохраняем зашифрованный токен и платформа активна.",
        ],
      },
      { h: "Health",
        lines: [
          "  GET /healthz   → liveness",
          "  GET /readyz    → liveness + DB round-trip",
          "  GET /api/tier  → текущий тариф + LLM model",
        ],
      },
      { h: "OpenAPI",
        lines: [
          "Полная машиночитаемая спецификация: https://api.autocmo.app/openapi.json",
          "Интерактивные доки:                  https://api.autocmo.app/docs",
        ],
      },
    ],
  },
};

export default async function DocsPage() {
  const locale = await getLocale();
  const c = COPY[locale];

  return (
    <article className="max-w-3xl mx-auto py-8">
      <h1 className="text-4xl font-bold mb-3">{c.title}</h1>
      <p className="text-slate-300 leading-relaxed mb-8">{c.intro}</p>
      <h2 className="text-xl font-semibold mb-4">{c.quickstart}</h2>
      {c.sections.map((s) => (
        <section key={s.h} className="card mb-3">
          <h3 className="font-semibold mb-2">{s.h}</h3>
          <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed" dir="ltr">
            {s.lines.join("\n")}
          </pre>
        </section>
      ))}
      <p className="text-xs text-slate-500 mt-8">
        Need an API key? Run the service yourself (see <a href="/install" className="underline">/install</a>) — or contact us via the GitHub repo.
      </p>
    </article>
  );
}
