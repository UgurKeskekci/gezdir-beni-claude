import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { isLocale, locales } from "@/config/i18n";
import {
  getDepartures,
  getRelatedTours,
  getTourBySlug,
  TourDetail,
} from "@/features/tours";
import { getDictionary } from "@/i18n/get-dictionary";

type TourPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

/** Availability changes per booking, so this page is never cached as a whole. */
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: TourPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};

  const tour = await getTourBySlug(slug, locale);
  if (!tour) return {};

  return {
    title: tour.title,
    description: tour.summary,
    alternates: {
      canonical: `/${locale}/tours/${slug}`,
      languages: Object.fromEntries(
        locales.map((item) => [item, `/${item}/tours/${slug}`]),
      ),
    },
    openGraph: {
      title: tour.title,
      description: tour.summary,
      ...(tour.cover
        ? { images: [{ url: tour.cover.url, alt: tour.cover.alt }] }
        : {}),
    },
  };
}

export default async function TourPage({ params }: TourPageProps) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const [dictionary, tour] = await Promise.all([
    getDictionary(locale),
    getTourBySlug(slug, locale),
  ]);
  if (!tour) notFound();

  const [related, departures] = await Promise.all([
    getRelatedTours(slug, locale),
    getDepartures(slug),
  ]);

  return (
    <TourDetail
      tour={tour}
      related={related}
      departures={departures}
      locale={locale}
      dictionary={dictionary}
    />
  );
}
