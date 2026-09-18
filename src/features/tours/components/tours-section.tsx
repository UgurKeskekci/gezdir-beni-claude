import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion";
import { ButtonLink } from "@/components/ui/button";
import { ArrowRightIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Locale } from "@/config/i18n";
import { TourCard } from "@/features/tours/components/tour-card";
import type { Tour } from "@/features/tours/types";
import type { Dictionary } from "@/i18n/types";
import { routes } from "@/lib/routes";

type ToursSectionProps = {
  tours: Tour[];
  locale: Locale;
  dictionary: Dictionary["tours"];
};

export function ToursSection({ tours, locale, dictionary }: ToursSectionProps) {
  return (
    <section id="tours" className="scroll-mt-24 py-24 sm:py-32">
      <Container>
        <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow={dictionary.eyebrow}
            title={dictionary.title}
            accent={dictionary.titleAccent}
            description={dictionary.description}
          />
          <ButtonLink
            href={routes.tours(locale)}
            variant="secondary"
            size="sm"
            className="shrink-0"
          >
            {dictionary.seeAll}
            <ArrowRightIcon className="size-4 transition-transform duration-300 group-hover/button:translate-x-1" />
          </ButtonLink>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tours.map((tour, index) => (
            <Reveal key={tour.slug} delay={index * 90} className="h-full">
              <TourCard tour={tour} locale={locale} dictionary={dictionary} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
