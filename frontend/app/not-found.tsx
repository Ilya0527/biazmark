import Link from "next/link";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

export default async function NotFound() {
  const locale = await getLocale();
  return (
    <div className="text-center py-24">
      <div className="text-5xl font-bold mb-2">404</div>
      <p className="text-muted mb-6">{t(locale, "nf.body")}</p>
      <Link href="/" className="btn-primary">{t(locale, "nf.back")}</Link>
    </div>
  );
}
