import Link from "next/link";
import { notFound } from "next/navigation";
import { api, type ContentVariant } from "@/lib/api";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

export const dynamic = "force-dynamic";

const KIND_KEYS = [
  { value: "", key: "content.kind.all" },
  { value: "post", key: "content.kind.post" },
  { value: "ad", key: "content.kind.ad" },
  { value: "article", key: "content.kind.article" },
  { value: "email", key: "content.kind.email" },
];

export default async function ContentPage({
  params,
  searchParams,
}: {
  params: Promise<{ businessId: string }>;
  searchParams: Promise<{ kind?: string }>;
}) {
  const { businessId } = await params;
  const { kind } = await searchParams;
  const [biz, locale] = await Promise.all([
    api.getBusiness(businessId).catch(() => null),
    getLocale(),
  ]);
  if (!biz) notFound();
  const content = await api.listBusinessContent(businessId, kind).catch(() => []);
  const tx = (k: string) => t(locale, k);

  return (
    <div className="space-y-6">
      <div>
        <Link href={`/dashboard/${businessId}`} className="text-sm text-slate-400 hover:text-slate-200">
          ← {biz.name}
        </Link>
        <h1 className="text-3xl font-bold mt-1">{tx("content.title")}</h1>
        <p className="text-slate-400 mt-1">{tx("content.subtitle")}</p>
      </div>

      <div className="flex items-center gap-1">
        {KIND_KEYS.map((k) => (
          <Link
            key={k.value}
            href={`/dashboard/${businessId}/content${k.value ? `?kind=${k.value}` : ""}`}
            className={`btn ${(kind ?? "") === k.value ? "btn-primary" : "btn-ghost"}`}
          >
            {tx(k.key)}
          </Link>
        ))}
      </div>

      {content.length === 0 ? (
        <div className="card text-center text-slate-400 py-12">{tx("content.empty")}</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {content.map((v) => (
            <ContentCard key={v.id} v={v} ctaLabel={tx("content.cta")} />
          ))}
        </div>
      )}
    </div>
  );
}

function ContentCard({ v, ctaLabel }: { v: ContentVariant; ctaLabel: string }) {
  const isArticle = v.kind === "article";
  const isEmail = v.kind === "email";
  return (
    <Link href={`/campaigns/${v.campaign_id}`} className="card card-hover block overflow-hidden">
      {v.media_url && (
        <div className="-m-6 mb-4 bg-ink-900">
          <img src={v.media_url} alt={v.headline} className="w-full max-h-64 object-cover" />
        </div>
      )}
      <div className="flex items-center gap-2 mb-2">
        <span className="badge badge-accent">{v.kind}</span>
        <span
          className={`badge ${
            v.status === "live"
              ? "badge-success"
              : v.status === "killed"
                ? "badge-danger"
                : "badge-muted"
          }`}
        >
          {v.status}
        </span>
      </div>
      <div className="font-semibold mb-1 line-clamp-2">{v.headline}</div>
      <div className="text-sm text-slate-300 line-clamp-3 whitespace-pre-wrap">
        {isArticle ? v.body : isEmail ? (v.meta?.preview || v.body) : v.body}
      </div>
      {v.cta && (
        <div className="mt-3 text-xs">
          <span className="text-slate-500">{ctaLabel} · </span>
          <span className="text-accent-400">{v.cta}</span>
        </div>
      )}
    </Link>
  );
}
