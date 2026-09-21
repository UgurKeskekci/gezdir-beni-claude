import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { isLocale } from "@/config/i18n";
import { CheckoutForm } from "@/features/reservations/components/checkout-form";
import { getDepartures, getTourBySlug } from "@/features/tours";
import { getDictionary } from "@/i18n/get-dictionary";

type BookPageProps = {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ departure?: string }>;
};

/** Checkout must always see live availability. */
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: BookPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const dictionary = await getDictionary(locale);
  return {
    title: dictionary.booking.title,
    // A checkout page has nothing to offer a search engine.
    robots: { index: false, follow: false },
  };
}

export default async function BookPage({
  params,
  searchParams,
}: BookPageProps) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const [dictionary, tour, departures, query] = await Promise.all([
    getDictionary(locale),
    getTourBySlug(slug, locale),
    getDepartures(slug),
    searchParams,
  ]);
  if (!tour) notFound();

  return (
    <Container size="wide" className="py-14 sm:py-20">
      <div className="max-w-2xl">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          {dictionary.booking.title}
        </h1>
        <p className="text-muted-foreground mt-3">
          {tour.title} · {dictionary.booking.subtitle}
        </p>
      </div>

      <div className="mt-12">
        <CheckoutForm
          tour={tour}
          departures={departures}
          locale={locale}
          dictionary={dictionary}
          initialDepartureId={query.departure}
        />
      </div>
    </Container>
  );
}
