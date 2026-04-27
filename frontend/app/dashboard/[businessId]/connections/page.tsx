import Link from "next/link";
import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import { ConnectButton } from "./connect-button";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

export const dynamic = "force-dynamic";

export default async function ConnectionsPage({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  const { businessId } = await params;
  const [biz, locale] = await Promise.all([
    api.getBusiness(businessId).catch(() => null),
    getLocale(),
  ]);
  if (!biz) notFound();

  const [statuses, mediaProviders] = await Promise.all([
    api.connectorStatus(businessId).catch(() => []),
    api.mediaProviders().catch(() => []),
  ]);
  const tx = (k: string) => t(locale, k);

  return (
    <div className="space-y-8">
      <div>
        <Link href={`/dashboard/${businessId}`} className="text-sm text-slate-400 hover:text-slate-200">
          ← {biz.name}
        </Link>
        <h1 className="text-3xl font-bold mt-1">{tx("conn.title")}</h1>
        <p className="text-slate-400 mt-1">{tx("conn.subtitle")}</p>
      </div>

      <section>
        <h2 className="font-semibold mb-3">{tx("conn.platforms")}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {statuses.map((s) => (
            <div key={s.platform} className="card">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{s.display_name}</span>
                    {s.connected && <span className="badge badge-success">{tx("conn.status.connected")}</span>}
                    {!s.connected && s.oauth_supported && s.oauth_configured && (
                      <span className="badge badge-muted">{tx("conn.status.notconn")}</span>
                    )}
                    {s.oauth_supported && !s.oauth_configured && (
                      <span className="badge badge-warning">{tx("conn.status.appcreds")}</span>
                    )}
                    {!s.oauth_supported && !s.connected && (
                      <span className="badge badge-muted">{tx("conn.status.envcreds")}</span>
                    )}
                  </div>
                  {s.account_name && (
                    <div className="text-sm text-slate-400 mt-1">{s.account_name}</div>
                  )}
                  {s.oauth_supported && !s.oauth_configured && (
                    <div className="text-xs text-slate-500 mt-2">
                      <code className="text-accent-400">{s.platform.toUpperCase()}_APP_ID</code> /{" "}
                      <code className="text-accent-400">_APP_SECRET</code> {tx("conn.oauth.hint")}
                    </div>
                  )}
                </div>
                <ConnectButton
                  businessId={businessId}
                  platform={s.platform}
                  connected={s.connected}
                  oauthReady={s.oauth_supported && s.oauth_configured}
                  locale={locale}
                />
              </div>
              {s.connected && s.account_meta && Object.keys(s.account_meta).length > 0 && (
                <details className="mt-3 text-xs text-slate-400">
                  <summary className="cursor-pointer hover:text-slate-200">{tx("conn.acc.details")}</summary>
                  <pre className="mt-2 text-[11px] bg-ink-900 rounded p-2 overflow-x-auto">
                    {JSON.stringify(s.account_meta, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-semibold mb-3">{tx("conn.media.title")}</h2>
        <div className="card divide-y divide-ink-700">
          {mediaProviders.map((p) => (
            <div key={p.name} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between">
              <div>
                <div className="font-medium capitalize">{p.name}</div>
                <div className="text-xs text-slate-500">
                  {p.supports_video ? tx("conn.media.video") : tx("conn.media.images")}
                </div>
              </div>
              {p.configured ? (
                <span className="badge badge-success">{tx("conn.media.ready")}</span>
              ) : (
                <span className="badge badge-muted">{tx("conn.media.add")}</span>
              )}
            </div>
          ))}
          <div className="pt-3 text-xs text-slate-500">{tx("conn.media.note")}</div>
        </div>
      </section>
    </div>
  );
}
