import "./globals.css";
import type { Metadata, Viewport } from "next";
import Link from "next/link";
import AmbientBackground from "@/components/AmbientBackground";
import BackendBanner from "@/components/BackendBanner";
import LangSwitcher from "@/components/LangSwitcher";
import Cursor from "@/components/Cursor";
import SmoothScroll from "@/components/SmoothScroll";
import { t, RTL } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

const SITE_URL = "https://autocmo.app";
const SITE_NAME = "AutoCMO";
const TITLE = "AutoCMO — Your AI Chief Marketing Officer";
const DESCRIPTION =
  "Brief in, campaigns out. An autonomous AI CMO that researches the market, builds strategy, writes content, publishes to every platform, and self-improves — 24/7.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s · AutoCMO" },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "AI CMO",
    "autonomous marketing",
    "marketing automation",
    "AI marketing",
    "Chief Marketing Officer",
    "AI agency",
    "content generation",
    "ad automation",
  ],
  authors: [{ name: "AutoCMO" }],
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      en: `${SITE_URL}/`,
      he: `${SITE_URL}/`,
      ru: `${SITE_URL}/`,
    },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
    alternateLocale: ["he_IL", "ru_RU"],
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "AutoCMO — Marketing that runs itself",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0d12",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
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
        <SmoothScroll />
        <Cursor />
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
            <div>
              AutoCMO · {t(locale, "footer.tagline")} ·{" "}
              <Link href="/docs" className="hover:text-slate-300">API</Link>
              {" · "}
              <Link href="/privacy" className="hover:text-slate-300">Privacy</Link>
              {" · "}
              <Link href="/terms" className="hover:text-slate-300">Terms</Link>
              {" · "}
              <a
                href="https://github.com/Ilya0527/biazmark"
                target="_blank"
                rel="noreferrer"
                className="hover:text-slate-300"
              >
                GitHub
              </a>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
