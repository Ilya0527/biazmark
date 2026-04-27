"use client";

import { useEffect, useState } from "react";
import FloatingOrbs from "@/components/FloatingOrbs";
import Reveal from "@/components/Reveal";
import CopyButton from "@/components/CopyButton";
import IconBadge from "@/components/IconBadge";
import { t, readLocaleClient, type Locale, DEFAULT_LOCALE } from "@/lib/i18n";

type Platform = "windows" | "mac" | "linux" | "android" | "docker" | "vercel";

const PLATFORMS: Platform[] = ["windows", "mac", "linux", "android", "docker", "vercel"];

// Static commands (not translated — they are code)
const CMDS: Record<Platform, string> = {
  windows: `iwr -useb https://biazmark.vercel.app/install.ps1 | iex`,
  mac: `curl -fsSL https://biazmark.vercel.app/install.sh | bash`,
  linux: `curl -fsSL https://biazmark.vercel.app/install.sh | bash`,
  android: `https://biazmark.vercel.app/Biazmark.apk`,
  docker: `git clone https://github.com/Ilya0527/biazmark.git
cd biazmark
cp .env.example .env
# edit .env — at least set ANTHROPIC_API_KEY
docker compose up -d`,
  vercel: `# 1. Frontend → Vercel
vercel --cwd frontend
# 2. Backend → Render (or Fly / Railway)
cd backend && # see DEPLOY.md
# 3. In Vercel project settings:
#    BIAZMARK_BACKEND_URL = <your backend URL>`,
};

export default function InstallPage() {
  const [active, setActive] = useState<Platform>("windows");
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    setLocale(readLocaleClient());
    setActive(detectPlatform());
  }, []);

  const tx = (k: string) => t(locale, k);
  const cmd = CMDS[active];
  const oneliner = cmd.split("\n")[0];

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="relative text-center py-12 rounded-3xl overflow-hidden">
        <div className="aurora aurora-1" />
        <div className="aurora aurora-2" />
        <FloatingOrbs count={6} seed={2} />
        <div className="relative z-10">
          <Reveal dir="up">
            <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-slate-300 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {tx("install.badge")}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              {tx("install.title.1")} <span className="text-gradient">{tx("install.title.2")}</span>
            </h1>
            <p className="text-slate-400 max-w-xl mx-auto">{tx("install.subtitle")}</p>
          </Reveal>
        </div>
      </section>

      {/* Platform tabs */}
      <section>
        <div className="flex flex-wrap gap-2 justify-center mb-5">
          {PLATFORMS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setActive(p)}
              className={`btn ${active === p ? "btn-primary" : "btn-secondary"}`}
            >
              {tx(`install.${p}`)}
            </button>
          ))}
        </div>

        <Reveal dir="up" key={active}>
          <div className="card max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <IconBadge kind="code" color="indigo" size={32} />
                <div>
                  <div className="font-semibold">{tx(`install.${active}`)}</div>
                  <div className="text-xs text-slate-400">{tx(`install.${active}.desc`)}</div>
                </div>
              </div>
              <CopyButton text={cmd} label={tx("install.copy")} variant="primary" />
            </div>

            <div className="text-xs text-slate-500 mb-3">{tx(`install.${active}.hint`)}</div>

            <div className="relative group" dir="ltr">
              <pre className="bg-ink-900 border border-ink-700 rounded-xl p-4 overflow-x-auto text-sm font-mono text-slate-200">
                <code>{cmd}</code>
              </pre>
              <div className="absolute top-2 right-2">
                <CopyButton text={cmd} label="" variant="minimal" />
              </div>
            </div>

            {/* Quick actions */}
            <div className="flex flex-wrap gap-2 mt-4">
              {active === "windows" && (
                <>
                  <OpenTerminalButton cmd={oneliner} platform="windows" tx={tx} />
                  <a href="/install.bat" download="biazmark-install.bat" className="btn-secondary">
                    <DownloadIcon /> {tx("install.dl.bat")}
                  </a>
                  <a href="/install.ps1" download="biazmark-install.ps1" className="btn-ghost">
                    {tx("install.dl.ps1")}
                  </a>
                </>
              )}
              {(active === "mac" || active === "linux") && (
                <>
                  <OpenTerminalButton cmd={oneliner} platform={active} tx={tx} />
                  <a href="/install.sh" download="biazmark-install.sh" className="btn-secondary">
                    <DownloadIcon /> {tx("install.dl.sh")}
                  </a>
                </>
              )}
              {active === "android" && (
                <>
                  <a href="/Biazmark.apk" download="Biazmark.apk" className="btn-primary">
                    <DownloadIcon /> {tx("install.dl.apk")}
                  </a>
                  <a href="/Biazmark.apk" className="btn-secondary" target="_blank" rel="noreferrer">
                    {tx("install.dl.direct")}
                  </a>
                </>
              )}
              {active === "docker" && (
                <a
                  href="https://github.com/Ilya0527/biazmark"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary"
                >
                  <GitHubIcon /> {tx("install.gh.view")}
                </a>
              )}
              {active === "vercel" && (
                <a
                  href="https://vercel.com/new/clone?repository-url=https://github.com/Ilya0527/biazmark&root-directory=frontend"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary"
                >
                  {tx("install.deploy")}
                </a>
              )}
            </div>
          </div>
        </Reveal>
      </section>

      {/* What happens */}
      <section className="max-w-3xl mx-auto">
        <Reveal dir="up">
          <h2 className="text-xl font-semibold mb-4">{tx("install.steps.title")}</h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-3">
          {[1, 2, 3].map((n, i) => (
            <Reveal key={n} dir="up" delay={i * 100}>
              <div className="card">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-semibold mb-3"
                  style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
                >
                  {n}
                </div>
                <div className="font-semibold">{tx(`install.step.${n}.t`)}</div>
                <div className="text-sm text-slate-400 mt-1">{tx(`install.step.${n}.d`)}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Troubleshooting */}
      <section className="max-w-3xl mx-auto">
        <Reveal dir="up">
          <h2 className="text-xl font-semibold mb-4">{tx("install.tr.title")}</h2>
        </Reveal>
        <div className="card space-y-4 text-sm">
          {[1, 2, 3].map((n) => (
            <details key={n}>
              <summary className="cursor-pointer font-medium text-slate-200">
                {tx(`install.tr.${n}.q`)}
              </summary>
              <div className="text-slate-400 mt-2 ps-4">{tx(`install.tr.${n}.a`)}</div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "windows";
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("mac")) return "mac";
  if (ua.includes("linux") && !ua.includes("android")) return "linux";
  return "windows";
}

function OpenTerminalButton({
  cmd,
  platform,
  tx,
}: {
  cmd: string;
  platform: Platform;
  tx: (k: string) => string;
}) {
  const [status, setStatus] = useState<"idle" | "opened" | "copied">("idle");

  async function onClick() {
    try {
      await navigator.clipboard.writeText(cmd);
      setStatus("copied");
    } catch {}
    try {
      if (platform === "windows") {
        window.location.href =
          `ms-shell:::{871C5380-42A0-1069-A2EA-08002B30309D}\\Windows PowerShell`;
      }
    } catch {}
    setTimeout(() => setStatus("idle"), 2500);
  }

  return (
    <button type="button" onClick={onClick} className="btn-secondary">
      <TerminalIcon />
      {status === "copied" ? tx("install.term.copied") : status === "opened" ? tx("install.term.opened") : tx("install.term")}
    </button>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function TerminalIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.42c.58.11.79-.25.79-.56v-2c-3.22.7-3.9-1.54-3.9-1.54-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.72 1.26 3.38.96.1-.75.41-1.26.74-1.55-2.57-.29-5.28-1.28-5.28-5.7 0-1.26.45-2.29 1.19-3.1-.12-.3-.52-1.48.11-3.07 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.77.12 3.07.74.81 1.19 1.84 1.19 3.1 0 4.44-2.72 5.4-5.3 5.69.42.36.8 1.08.8 2.18v3.23c0 .31.21.68.8.56A11.5 11.5 0 0 0 12 .5z" />
    </svg>
  );
}
