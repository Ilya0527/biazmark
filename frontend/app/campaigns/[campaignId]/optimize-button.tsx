"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api";
import { t, type Locale, DEFAULT_LOCALE } from "@/lib/i18n";

export function OptimizeButton({
  campaignId,
  locale = DEFAULT_LOCALE,
}: {
  campaignId: string;
  locale?: Locale;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const tx = (k: string) => t(locale, k);

  async function onOptimize() {
    setBusy(true);
    setMessage(null);
    try {
      const ev = await api.optimizeCampaign(campaignId);
      setMessage(ev?.reason || tx("camp.opt.done"));
      router.refresh();
    } catch (e: any) {
      setMessage(e?.message || "failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button className="btn-primary" disabled={busy} onClick={onOptimize}>
        {busy ? tx("camp.opt.running") : tx("camp.opt.run")}
      </button>
      {message && <div className="text-xs text-slate-400 max-w-xs text-end">{message}</div>}
    </div>
  );
}
