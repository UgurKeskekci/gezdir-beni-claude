import { notFound } from "next/navigation";

import { isLocale } from "@/config/i18n";
import { AdminReservationDetail } from "@/features/admin";
import { getDictionary } from "@/i18n/get-dictionary";

type AdminReservationPageProps = {
  params: Promise<{ locale: string; reference: string }>;
};

export default async function AdminReservationPage({
  params,
}: AdminReservationPageProps) {
  const { locale, reference } = await params;
  if (!isLocale(locale)) notFound();

  const dictionary = await getDictionary(locale);

  return (
    <AdminReservationDetail
      locale={locale}
      dictionary={dictionary}
      reference={decodeURIComponent(reference).toUpperCase()}
    />
  );
}
