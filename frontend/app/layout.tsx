import "./globals.css";
import type { Metadata, Viewport } from "next";
import Link from "next/link";
import AmbientBackground from "@/components/AmbientBackground";
import BackendBanner from "@/components/BackendBanner";
import LangSwitcher from "@/components/LangSwitcher";
import { t, RTL } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "AutoCMO — Autonomous Marketing CMO",
  description:
    "Brief in, campaigns out. An AI Chief Marketing Officer that researches, writes, publishes, and optimizes — 24/7.",
};

export const viewport: Viewport = {
  themeColor: "#0b0d12",
  colorScheme: "dark",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const dir = RTL[locale] ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir}>
      <body>
        <AmbientBackground variant="mesh" intensity={0.55} />
        <div className="relative min-h-screen flex flex-col">
          <BackendBanner locale={locale} />
          <header className="relative z-20 border-b border-ink-700/50 bg-ink-900/50 backdrop-blur-md sticky top-0">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2.5 font-semibold text-lg">
                <span
                  className="relative w-8 h-8 rounded-xl inline-block"
                  style={{
                    background: "linear-gradient(135deg, #6366f1, #a855f7, #ec4899)",
                    boxShadow: "0 6px 20px -5px rgba(139, 92, 246, 0.6)",
                  }}
                >
                  <span className="absolute inset-0 rounded-xl bg-white/10 blur-md" />
                </span>
                <span>AutoCMO</span>
              </Link>
              <nav className="flex items-center gap-1 text-sm">
                <Link href="/" className="btn-ghost">{t(locale, "nav.businesses")}</Link>
                <Link href="/install" className="btn-ghost">{t(locale, "nav.install")}</Link>
                <LangSwitcher initial={locale} />
                <Link href="/onboarding" className="btn-primary">
                  <span>{t(locale, "nav.new")}</span>
                  <span>{RTL[locale] ? "←" : "→"}</span>
                </Link>
              </nav>
            </div>
          </header>
          <main className="relative z-10 flex-1 max-w-6xl mx-auto w-full px-6 py-8">
            {children}
          </main>
          <footer className="relative z-10 border-t border-ink-700/50 py-6 mt-12 text-center text-xs text-slate-500">
            AutoCMO · {t(locale, "footer.tagline")} ·{" "}
            <a href="/docs" className="hover:text-slate-300">API</a>
          </footer>
        </div>
      </body>
    </html>
  );
}
