import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { isLocale, locales } from "@/config/i18n";
import { ReservationLookup } from "@/features/reservations";
import { getDictionary } from "@/i18n/get-dictionary";

type LookupPageProps = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LookupPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const dictionary = await getDictionary(locale);
  return {
    title: dictionary.lookup.eyebrow,
    description: dictionary.lookup.description,
    alternates: {
      canonical: `/${locale}/reservations`,
      languages: Object.fromEntries(
        locales.map((item) => [item, `/${item}/reservations`]),
      ),
    },
  };
}

export default async function LookupPage({ params }: LookupPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dictionary = await getDictionary(locale);

  return (
    <Container className="py-16 sm:py-24">
      <div className="mx-auto max-w-2xl">
        <SectionHeading
          as="h1"
          eyebrow={dictionary.lookup.eyebrow}
          title={dictionary.lookup.title}
          accent={dictionary.lookup.titleAccent}
          description={dictionary.lookup.description}
        />
        <ReservationLookup
          locale={locale}
          dictionary={dictionary}
          className="card-soft mt-10 rounded-3xl p-6 sm:p-8"
        />
      </div>
    </Container>
  );
}
