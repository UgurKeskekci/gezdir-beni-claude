import { notFound } from "next/navigation";

import { isLocale } from "@/config/i18n";
import {
  ClosingCta,
  getClosingImage,
  getHeroImage,
  Hero,
  HowItWorks,
  WhyUs,
} from "@/features/landing";
import {
  getFeaturedTestimonial,
  getTestimonials,
  TestimonialsSection,
} from "@/features/testimonials";
import { getFeaturedTours, ToursSection } from "@/features/tours";
import { getDictionary } from "@/i18n/get-dictionary";

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

  return (
    <>
      <Hero
        locale={locale}
        image={heroImage}
        tour={tours[0]}
        testimonial={heroTestimonial}
        dictionary={dictionary.hero}
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
      <ClosingCta
        locale={locale}
        image={closingImage}
        dictionary={dictionary.closing}
      />
    </>
  );
}
