import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { isLocale, locales } from "@/config/i18n";
import {
  getRelatedTours,
  getTourBySlug,
  getTourSlugs,
  TourDetail,
} from "@/features/tours";
import { getDictionary } from "@/i18n/get-dictionary";

type TourPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getTourSlugs();
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

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
      images: [{ url: tour.cover.url, alt: tour.cover.alt }],
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

  const related = await getRelatedTours(slug, locale);

  return (
    <TourDetail
      tour={tour}
      related={related}
      locale={locale}
      dictionary={dictionary}
    />
  );
}
