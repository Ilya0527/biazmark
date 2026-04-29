"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api, type Tier } from "@/lib/api";
import Reveal from "@/components/Reveal";
import { t, type Locale } from "@/lib/i18n";

export default function OnboardingForm({ locale }: { locale: Locale }) {
  const router = useRouter();
  const tx = (k: string) => t(locale, k);

  const TIERS: { value: Tier; label: string; descKey: string; accent: string }[] = [
    { value: "free", label: "Free", descKey: "onboard.tier.free", accent: "from-slate-500 to-slate-700" },
    { value: "basic", label: "Basic", descKey: "onboard.tier.basic", accent: "from-amber-400 to-rose-500" },
    { value: "pro", label: "Pro", descKey: "onboard.tier.pro", accent: "from-indigo-500 to-purple-600" },
    { value: "enterprise", label: "Enterprise", descKey: "onboard.tier.enterprise", accent: "from-emerald-500 to-cyan-600" },
  ];

  const [form, setForm] = useState({
    name: "",
    description: "",
    website: "",
    industry: "",
    target_audience: "",
    goals: "",
    tier: "basic" as Tier,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upd = (k: keyof typeof form) => (e: React.ChangeEvent<any>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const b = await api.createBusiness(form);
      router.push(`/dashboard/${b.id}`);
    } catch (err: any) {
      setError(err?.message || tx("onboard.error"));
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto relative">
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-10 -right-20 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

      <Reveal dir="up">
        <h1 className="text-4xl font-bold mb-2">
          {tx("onboard.title.1")} <span className="text-gradient">{tx("onboard.title.2")}</span>
        </h1>
        <p className="text-muted mb-8">{tx("onboard.subtitle")}</p>
      </Reveal>

      <form onSubmit={onSubmit} className="space-y-5">
        <Reveal dir="up" delay={50}>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">{tx("onboard.name")}</label>
              <input required className="input" value={form.name} onChange={upd("name")} placeholder={tx("onboard.name.ph")} />
            </div>
            <div>
              <label className="label">{tx("onboard.website")}</label>
              <input className="input" value={form.website} onChange={upd("website")} placeholder={tx("onboard.website.ph")} />
            </div>
          </div>
        </Reveal>

        <Reveal dir="up" delay={100}>
          <div>
            <label className="label">{tx("onboard.desc")}</label>
            <textarea className="textarea" value={form.description} onChange={upd("description")}
              placeholder={tx("onboard.desc.ph")} />
          </div>
        </Reveal>

        <Reveal dir="up" delay={150}>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">{tx("onboard.industry")}</label>
              <input className="input" value={form.industry} onChange={upd("industry")} placeholder={tx("onboard.industry.ph")} />
            </div>
            <div>
              <label className="label">{tx("onboard.goals")}</label>
              <input className="input" value={form.goals} onChange={upd("goals")} placeholder={tx("onboard.goals.ph")} />
            </div>
          </div>
        </Reveal>

        <Reveal dir="up" delay={200}>
          <div>
            <label className="label">{tx("onboard.audience")}</label>
            <textarea className="textarea" value={form.target_audience} onChange={upd("target_audience")}
              placeholder={tx("onboard.audience.ph")} />
          </div>
        </Reveal>

        <Reveal dir="up" delay={250}>
          <div>
            <label className="label">{tx("onboard.tier")}</label>
            <div className="grid md:grid-cols-2 gap-3">
              {TIERS.map((tier) => (
                <label
                  key={tier.value}
                  className={`card cursor-pointer relative overflow-hidden transition-all ${
                    form.tier === tier.value ? "!border-accent-500 ring-2 ring-coral/30" : ""
                  }`}
                >
                  {form.tier === tier.value && (
                    <div className={`absolute inset-0 bg-gradient-to-br ${tier.accent} opacity-[0.08] pointer-events-none`} />
                  )}
                  <input
                    type="radio"
                    name="tier"
                    value={tier.value}
                    checked={form.tier === tier.value}
                    onChange={() => setForm((f) => ({ ...f, tier: tier.value }))}
                    className="sr-only"
                  />
                  <div className="relative">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full bg-gradient-to-br ${tier.accent}`} />
                      <span className="font-semibold">{tier.label}</span>
                    </div>
                    <div className="text-sm text-muted mt-1">{tx(tier.descKey)}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </Reveal>

        {error && (
          <Reveal dir="up">
            <div className="card !border-danger/40 text-danger">{error}</div>
          </Reveal>
        )}

        <Reveal dir="up" delay={300}>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={submitting} className="btn-primary px-6 py-3">
              {submitting ? tx("onboard.creating") : tx("onboard.create")}
            </button>
            <button type="button" onClick={() => router.back()} className="btn-ghost">
              {tx("onboard.cancel")}
            </button>
          </div>
        </Reveal>
      </form>
    </div>
  );
}
