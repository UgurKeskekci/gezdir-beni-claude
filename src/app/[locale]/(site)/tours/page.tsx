import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion";
import { isLocale, locales } from "@/config/i18n";
import { getTours, TourCard } from "@/features/tours";
import { getDictionary } from "@/i18n/get-dictionary";

type ToursPageProps = {
  params: Promise<{ locale: string }>;
};

/** The catalogue comes from the booking API, so this page renders per request. */
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: ToursPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const dictionary = await getDictionary(locale);
  return {
    title: dictionary.toursIndex.title,
    description: dictionary.toursIndex.description,
    alternates: {
      canonical: `/${locale}/tours`,
      languages: Object.fromEntries(
        locales.map((item) => [item, `/${item}/tours`]),
      ),
    },
  };
}

export default async function ToursPage({ params }: ToursPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const [dictionary, tours] = await Promise.all([
    getDictionary(locale),
    getTours(locale),
  ]);

  return (
    <Container size="wide" className="py-16 sm:py-24">
      <div className="animate-fade-rise max-w-2xl">
        <h1 className="font-display text-4xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-5xl">
          {dictionary.toursIndex.title}
        </h1>
        <p className="text-muted-foreground mt-4 leading-relaxed text-pretty">
          {dictionary.toursIndex.description}
        </p>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tours.map((tour, index) => (
          <Reveal key={tour.slug} delay={(index % 3) * 90} className="h-full">
            <TourCard
              tour={tour}
              locale={locale}
              dictionary={dictionary.tours}
            />
          </Reveal>
        ))}
      </div>
    </Container>
  );
}
