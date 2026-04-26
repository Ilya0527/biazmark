// Server-only locale helper. Imports next/headers, so DON'T import this from
// a client component — webpack will fail. Use `lib/i18n.ts` for the dict + t().

import { cookies } from "next/headers";
import { LOCALES, DEFAULT_LOCALE, LANG_COOKIE, type Locale } from "@/lib/i18n";

export async function getLocale(): Promise<Locale> {
  try {
    const c = await cookies();
    const v = c.get(LANG_COOKIE)?.value;
    if (v && (LOCALES as readonly string[]).includes(v)) return v as Locale;
  } catch {
    // Outside request scope (e.g. some build-time render).
  }
  return DEFAULT_LOCALE;
}
