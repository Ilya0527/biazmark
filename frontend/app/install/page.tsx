import InstallClient from "./client";
import { getLocale } from "@/lib/i18n-server";

export default async function InstallPage() {
  const locale = await getLocale();
  return <InstallClient locale={locale} />;
}
