import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Locale } from "@/config/i18n";
import { ReservationLookup } from "@/features/reservations";
import type { Dictionary } from "@/i18n/types";

/** The PNR-style panel on the home page: find a booking by reference and e-mail. */
export function LookupSection({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  return (
    <section
      id="lookup"
      className="bg-surface-muted scroll-mt-24 py-24 sm:py-28"
    >
      <Container>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
          <Reveal>
            <SectionHeading
              eyebrow={dictionary.lookup.eyebrow}
              title={dictionary.lookup.title}
              accent={dictionary.lookup.titleAccent}
              description={dictionary.lookup.description}
            />
          </Reveal>
          <Reveal delay={80}>
            <ReservationLookup
              locale={locale}
              dictionary={dictionary}
              className="card-soft rounded-3xl p-6 sm:p-8"
            />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
