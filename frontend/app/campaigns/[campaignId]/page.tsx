import Link from "next/link";
import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import { OptimizeButton } from "./optimize-button";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

export const dynamic = "force-dynamic";

export default async function CampaignPage({
  params,
}: {
  params: Promise<{ campaignId: string }>;
}) {
  const { campaignId } = await params;
  const [campaign, locale] = await Promise.all([
    api.getCampaign(campaignId).catch(() => null),
    getLocale(),
  ]);
  if (!campaign) notFound();

  const [variants, metrics] = await Promise.all([
    api.listVariants(campaignId).catch(() => []),
    api.listMetrics(campaignId).catch(() => []),
  ]);
  const tx = (k: string) => t(locale, k);

  const metricsByVariant = new Map<string, typeof metrics>();
  for (const m of metrics) {
    const arr = metricsByVariant.get(m.variant_id) || [];
    arr.push(m);
    metricsByVariant.set(m.variant_id, arr);
  }

  const totals = metrics.reduce(
    (acc, m) => ({
      impressions: acc.impressions + m.impressions,
      clicks: acc.clicks + m.clicks,
      conversions: acc.conversions + m.conversions,
      spend: acc.spend + m.spend,
      revenue: acc.revenue + m.revenue,
    }),
    { impressions: 0, clicks: 0, conversions: 0, spend: 0, revenue: 0 },
  );

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <Link
            href={`/dashboard/${campaign.business_id}`}
            className="text-sm text-slate-400 hover:text-slate-200"
          >
            {tx("camp.back")}
          </Link>
          <h1 className="text-3xl font-bold mt-1">{campaign.name}</h1>
          <div className="flex items-center gap-3 mt-2 text-sm text-slate-400">
            <span className={`badge ${campaign.status === "live" ? "badge-success" : "badge-muted"}`}>
              {campaign.status}
            </span>
            <span>{campaign.channel}</span>
            <span>· {campaign.objective}</span>
          </div>
        </div>
        <OptimizeButton campaignId={campaignId} locale={locale} />
      </div>

      <section className="grid md:grid-cols-5 gap-4">
        <Stat label={tx("camp.stat.imp")} value={totals.impressions.toLocaleString(locale)} />
        <Stat label={tx("camp.stat.clicks")} value={totals.clicks.toLocaleString(locale)} />
        <Stat label={tx("camp.stat.conv")} value={totals.conversions.toLocaleString(locale)} />
        <Stat label={tx("camp.stat.spend")} value={`$${totals.spend.toFixed(2)}`} />
        <Stat label={tx("camp.stat.rev")} value={`$${totals.revenue.toFixed(2)}`} />
      </section>

      <section>
        <h2 className="font-semibold mb-3">{tx("camp.variants.title")} ({variants.length})</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {variants.map((v) => {
            const vm = (metricsByVariant.get(v.id) || [])[0];
            return (
              <div key={v.id} className="card">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className={`badge ${statusBadge(v.status)}`}>{v.status}</span>
                  {v.meta?.angle && <span className="text-xs text-slate-500">{v.meta.angle}</span>}
                </div>
                <div className="font-semibold mb-1">{v.headline}</div>
                <p className="text-sm text-slate-300 whitespace-pre-wrap">{v.body}</p>
                {v.cta && (
                  <div className="mt-3 text-xs">
                    <span className="label !mb-0 me-2">{tx("camp.var.cta")}</span>
                    <span className="text-accent-400">{v.cta}</span>
                  </div>
                )}
                {v.visual_prompt && (
                  <div className="mt-3 text-xs text-slate-500">
                    <span className="label !mb-0 me-2">{tx("camp.var.visual")}</span>
                    {v.visual_prompt}
                  </div>
                )}
                {vm && (
                  <div className="mt-4 pt-3 border-t border-ink-700 grid grid-cols-4 gap-2 text-xs">
                    <MiniStat label={tx("camp.mini.imp")} v={vm.impressions} />
                    <MiniStat label={tx("camp.mini.clk")} v={vm.clicks} />
                    <MiniStat label={tx("camp.mini.conv")} v={vm.conversions} />
                    <MiniStat label={tx("camp.mini.roas")} v={vm.spend ? (vm.revenue / vm.spend).toFixed(1) : "—"} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function statusBadge(s: string) {
  switch (s) {
    case "live":
      return "badge-success";
    case "killed":
      return "badge-danger";
    case "approved":
      return "badge-accent";
    case "rejected":
      return "badge-danger";
    default:
      return "badge-muted";
  }
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card">
      <div className="text-xs uppercase tracking-wider text-slate-500">{label}</div>
      <div className="text-xl font-semibold mt-1">{value}</div>
    </div>
  );
}

function MiniStat({ label, v }: { label: string; v: string | number }) {
  return (
    <div>
      <div className="text-[10px] uppercase text-slate-500">{label}</div>
      <div className="text-sm text-slate-200">{v}</div>
    </div>
  );
}
