import { notFound } from "next/navigation";

import { isLocale } from "@/config/i18n";
import {
  ClosingCta,
  getClosingImage,
  getHeroImage,
  Hero,
  HowItWorks,
  LookupSection,
  WhyUs,
} from "@/features/landing";
import {
  getFeaturedTestimonial,
  getTestimonials,
  TestimonialsSection,
} from "@/features/testimonials";
import {
  getDepartures,
  getFeaturedTours,
  ToursSection,
} from "@/features/tours";
import { getDictionary } from "@/i18n/get-dictionary";

/** Seat counts are live, so the home page is rendered per request. */
export const dynamic = "force-dynamic";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const [
    dictionary,
    tours,
    heroImage,
    closingImage,
    testimonials,
    heroTestimonial,
  ] = await Promise.all([
    getDictionary(locale),
    getFeaturedTours(locale),
    getHeroImage(locale),
    getClosingImage(locale),
    getTestimonials(locale),
    getFeaturedTestimonial(locale),
  ]);

  const featured = tours[0];
  // The hero card advertises the next real departure of the first featured tour.
  const nextDeparture = featured
    ? (await getDepartures(featured.slug))[0]
    : undefined;

  return (
    <>
      <Hero
        locale={locale}
        image={heroImage}
        tour={featured}
        departure={nextDeparture}
        testimonial={heroTestimonial}
        dictionary={dictionary}
      />
      <ToursSection
        tours={tours}
        locale={locale}
        dictionary={dictionary.tours}
      />
      <HowItWorks dictionary={dictionary.how} />
      <WhyUs dictionary={dictionary.why} />
      <TestimonialsSection
        testimonials={testimonials}
        dictionary={dictionary.testimonials}
      />
      <LookupSection locale={locale} dictionary={dictionary} />
      <ClosingCta
        locale={locale}
        image={closingImage}
        dictionary={dictionary.closing}
      />
    </>
  );
}
