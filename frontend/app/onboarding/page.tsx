import OnboardingForm from "./form";
import { getLocale } from "@/lib/i18n-server";

export default async function OnboardingPage() {
  const locale = await getLocale();
  return <OnboardingForm locale={locale} />;
}
