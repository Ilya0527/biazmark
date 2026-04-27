import Link from "next/link";
import { api } from "@/lib/api";
import { notFound } from "next/navigation";
import { StrategyActions } from "./strategy-actions";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  const { businessId } = await params;
  const biz = await api.getBusiness(businessId).catch(() => null);
  if (!biz) notFound();

  const [research, strategies, campaigns, optimizations, locale] = await Promise.all([
    api.listResearch(businessId).catch(() => []),
    api.listStrategies(businessId).catch(() => []),
    api.listCampaigns(businessId).catch(() => []),
    api.listOptimizations(businessId).catch(() => []),
    getLocale(),
  ]);
  const tx = (k: string) => t(locale, k);
  const latestResearch = research[0];
  const latestStrategy = strategies[0];

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <Link href="/" className="text-sm text-slate-400 hover:text-slate-200">
            {tx("dash.back")}
          </Link>
          <h1 className="text-3xl font-bold mt-1">{biz.name}</h1>
          <div className="flex items-center gap-3 mt-2 text-sm text-slate-400">
            <span className="badge badge-accent capitalize">{biz.tier}</span>
            {biz.industry && <span>{biz.industry}</span>}
            {biz.website && <span>· {biz.website}</span>}
          </div>
        </div>
        <StrategyActions businessId={businessId} locale={locale} />
      </div>

      <nav className="flex items-center gap-1 border-b border-ink-700 -mb-2">
        <Link href={`/dashboard/${businessId}`} className="btn-ghost border-b-2 border-accent-500 rounded-none">
          {tx("dash.tab.overview")}
        </Link>
        <Link href={`/dashboard/${businessId}/content`} className="btn-ghost rounded-none">
          {tx("dash.tab.content")}
        </Link>
        <Link href={`/dashboard/${businessId}/media`} className="btn-ghost rounded-none">
          {tx("dash.tab.media")}
        </Link>
        <Link href={`/dashboard/${businessId}/connections`} className="btn-ghost rounded-none">
          {tx("dash.tab.connections")}
        </Link>
      </nav>

      <section className="grid md:grid-cols-4 gap-4">
        <Stat label={tx("dash.stat.research")} value={research.length} />
        <Stat label={tx("dash.stat.strategies")} value={strategies.length} />
        <Stat label={tx("dash.stat.campaigns")} value={campaigns.length} />
        <Stat label={tx("dash.stat.optimizations")} value={optimizations.length} />
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">{tx("dash.research.title")}</h2>
            {latestResearch && (
              <span className="text-xs text-slate-500">
                {new Date(latestResearch.created_at).toLocaleString(locale)}
              </span>
            )}
          </div>
          {!latestResearch ? (
            <div className="text-slate-400 text-sm">{tx("dash.research.empty")}</div>
          ) : (
            <div className="space-y-3 text-sm">
              <p className="text-slate-300">{latestResearch.summary}</p>
              {latestResearch.competitors?.length > 0 && (
                <div>
                  <div className="label">{tx("dash.research.competitors")}</div>
                  <ul className="space-y-1">
                    {latestResearch.competitors.slice(0, 4).map((c: any, i: number) => (
                      <li key={i} className="text-slate-300">
                        <span className="font-medium">{c.name}</span>
                        {c.positioning && <span className="text-slate-400"> — {c.positioning}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {latestResearch.trends?.length > 0 && (
                <div>
                  <div className="label">{tx("dash.research.trends")}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {latestResearch.trends.slice(0, 6).map((tr: any, i: number) => (
                      <span
                        key={i}
                        className={`badge ${
                          tr.direction === "rising"
                            ? "badge-success"
                            : tr.direction === "declining"
                              ? "badge-danger"
                              : "badge-muted"
                        }`}
                      >
                        {tr.label} {tr.direction === "rising" ? "↑" : tr.direction === "declining" ? "↓" : "→"}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">{tx("dash.strategy.title")}</h2>
            {latestStrategy && (
              <span className="text-xs text-slate-500">v{latestStrategy.version}</span>
            )}
          </div>
          {!latestStrategy ? (
            <div className="text-slate-400 text-sm">{tx("dash.strategy.empty")}</div>
          ) : (
            <div className="space-y-3 text-sm">
              <div>
                <div className="label">{tx("dash.strategy.positioning")}</div>
                <p className="text-slate-200">{latestStrategy.positioning}</p>
              </div>
              <div>
                <div className="label">{tx("dash.strategy.value")}</div>
                <p className="text-slate-300">{latestStrategy.value_prop}</p>
              </div>
              {latestStrategy.channels?.length > 0 && (
                <div>
                  <div className="label">{tx("dash.strategy.channels")}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {latestStrategy.channels.map((c: any, i: number) => (
                      <span key={i} className="badge badge-accent">{c.platform} · {c.objective}</span>
                    ))}
                  </div>
                </div>
              )}
              {latestStrategy.messaging_pillars?.length > 0 && (
                <div>
                  <div className="label">{tx("dash.strategy.pillars")}</div>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                    {latestStrategy.messaging_pillars.slice(0, 4).map((p: any, i: number) => (
                      <li key={i}>
                        <span className="font-medium">{p.name}</span>
                        {p.angle && <span className="text-slate-400"> — {p.angle}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <section>
        <h2 className="font-semibold mb-3">{tx("dash.camp.title")}</h2>
        {campaigns.length === 0 ? (
          <div className="card text-slate-400 text-sm">{tx("dash.camp.empty")}</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-3">
            {campaigns.map((c) => (
              <Link key={c.id} href={`/campaigns/${c.id}`} className="card card-hover block">
                <div className="flex items-center justify-between">
                  <div className="font-medium truncate">{c.name}</div>
                  <span className={`badge ${c.status === "live" ? "badge-success" : "badge-muted"}`}>
                    {c.status}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  {c.channel} · {c.objective}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {optimizations.length > 0 && (
        <section>
          <h2 className="font-semibold mb-3">{tx("dash.opt.title")}</h2>
          <div className="card divide-y divide-ink-700">
            {optimizations.slice(0, 6).map((e) => (
              <div key={e.id} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-200">{e.reason || e.kind}</span>
                  <span className="text-xs text-slate-500">
                    {new Date(e.created_at).toLocaleString(locale)}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {(e.payload?.applied || []).length} {tx("dash.opt.changes")}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="card">
      <div className="text-xs uppercase tracking-wider text-slate-500">{label}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </div>
  );
}
