import { notFound } from "next/navigation";

import { isLocale } from "@/config/i18n";
import { AdminDashboard } from "@/features/admin";
import { getDictionary } from "@/i18n/get-dictionary";

type AdminPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminPage({ params }: AdminPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dictionary = await getDictionary(locale);
  return <AdminDashboard locale={locale} dictionary={dictionary} />;
}
