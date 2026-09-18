import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import {
  ArrowRightIcon,
  CheckIcon,
  ClockIcon,
  PinIcon,
  StarIcon,
  UsersIcon,
} from "@/components/ui/icons";
import { Photo } from "@/components/ui/photo";
import type { Locale } from "@/config/i18n";
import { siteConfig } from "@/config/site";
import { PhotoCredit } from "@/features/tours/components/photo-credit";
import { TourCard } from "@/features/tours/components/tour-card";
import type { Tour } from "@/features/tours/types";
import type { Dictionary } from "@/i18n/types";
import { formatNumber, formatPrice } from "@/lib/format";
import { routes } from "@/lib/routes";

type TourDetailProps = {
  tour: Tour;
  related: Tour[];
  locale: Locale;
  dictionary: Dictionary;
};

export function TourDetail({
  tour,
  related,
  locale,
  dictionary,
}: TourDetailProps) {
  const detail = dictionary.tourDetail;
  const labels = dictionary.tours;

  return (
    <article>
      <header className="relative -mt-16 flex h-[70vh] min-h-[30rem] items-end overflow-hidden">
        <div className="animate-ken-burns absolute inset-0 -z-20">
          <Photo
            image={tour.cover}
            decorative
            fill
            preload
            fetchPriority="high"
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div
          aria-hidden="true"
          className="photo-scrim absolute inset-0 -z-10"
        />

        <Container size="wide" className="relative pb-14">
          <div className="animate-fade-rise flex flex-wrap items-center gap-2">
            <span className="glass-panel inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-white">
              <PinIcon className="size-3.5" />
              {tour.destination}, {tour.country}
            </span>
            {tour.badge ? (
              <Badge className="border-transparent bg-white/90 text-neutral-900">
                {tour.badge}
              </Badge>
            ) : null}
          </div>

          <h1
            className="font-display animate-fade-rise mt-5 max-w-3xl text-4xl leading-[1.08] font-semibold tracking-[-0.02em] text-balance text-white sm:text-6xl"
            style={{ animationDelay: "90ms" }}
          >
            {tour.title}
          </h1>

          <dl
            className="animate-fade-rise mt-6 flex flex-wrap items-center gap-x-7 gap-y-2 text-sm text-white/80"
            style={{ animationDelay: "170ms" }}
            data-tabular
          >
            <div className="flex items-center gap-1.5">
              <ClockIcon className="size-4" />
              <dd>
                {tour.durationDays} {labels.days} / {tour.durationNights}{" "}
                {labels.nights}
              </dd>
            </div>
            <div className="flex items-center gap-1.5">
              <UsersIcon className="size-4" />
              <dd>
                {tour.maxGroupSize} {labels.maxGroup}
              </dd>
            </div>
            <div className="flex items-center gap-1.5">
              <StarIcon className="text-accent size-4" />
              <dd>
                {formatNumber(tour.rating, locale, 1)} ·{" "}
                {formatNumber(tour.reviewCount, locale)} {labels.reviews}
              </dd>
            </div>
          </dl>
        </Container>
      </header>

      <Container size="wide" className="py-14">
        <ButtonLink href={routes.tours(locale)} variant="ghost" size="sm">
          {detail.back}
        </ButtonLink>

        <div className="mt-8 grid gap-14 lg:grid-cols-[1fr_23rem] lg:items-start">
          <div className="min-w-0">
            <Reveal as="section">
              <h2 className="font-display text-2xl font-semibold tracking-tight">
                {detail.overview}
              </h2>
              <p className="text-muted-foreground mt-4 leading-relaxed text-pretty">
                {tour.description}
              </p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {tour.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="border-border bg-surface rounded-full border px-3.5 py-1.5 text-sm"
                  >
                    {highlight}
                  </li>
                ))}
              </ul>
            </Reveal>

            <section className="mt-16">
              <Reveal>
                <h2 className="font-display text-2xl font-semibold tracking-tight">
                  {detail.itinerary}
                </h2>
              </Reveal>
              <ol className="mt-8 space-y-7">
                {tour.itinerary.map((day, index) => (
                  <Reveal
                    as="li"
                    key={day.day}
                    delay={index * 60}
                    distance={14}
                    className="group flex gap-5"
                  >
                    <span
                      className="bg-primary/12 text-primary flex size-12 shrink-0 flex-col items-center justify-center rounded-2xl leading-none font-semibold transition-transform duration-300 group-hover:-translate-y-0.5"
                      data-tabular
                    >
                      <span className="text-sm">{day.day}</span>
                      <span className="mt-0.5 text-[0.625rem] font-medium">
                        {detail.day}
                      </span>
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-display font-semibold">
                        {day.title}
                      </h3>
                      <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                        {day.description}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </ol>
            </section>

            {tour.gallery.length > 0 ? (
              <section className="mt-16">
                <Reveal>
                  <h2 className="font-display text-2xl font-semibold tracking-tight">
                    {detail.gallery}
                  </h2>
                </Reveal>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {tour.gallery.map((image, index) => (
                    <Reveal as="figure" key={image.url} delay={index * 80}>
                      <div className="border-border group relative aspect-4/3 overflow-hidden rounded-2xl border">
                        <Photo
                          image={image}
                          fill
                          sizes="(min-width: 640px) 50vw, 100vw"
                          className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105"
                        />
                      </div>
                      <PhotoCredit
                        credit={image.credit}
                        label={detail.photoBy}
                        className="text-subtle-foreground mt-2 text-xs"
                      />
                    </Reveal>
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          <Reveal
            as="aside"
            distance={12}
            className="border-border bg-surface rounded-3xl border p-6 lg:sticky lg:top-24"
          >
            <p
              className="font-display text-3xl font-semibold tracking-tight"
              data-tabular
            >
              {formatPrice(tour.price.amount, tour.price.currency, locale)}
            </p>
            <p className="text-muted-foreground mt-1.5 text-sm">
              {detail.priceNote}
            </p>

            <ButtonLink
              href={`mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(tour.title)}`}
              size="lg"
              className="mt-6 w-full"
            >
              {detail.book}
              <ArrowRightIcon className="size-4 transition-transform duration-300 group-hover/button:translate-x-1" />
            </ButtonLink>
            <ButtonLink
              href={routes.contact(locale)}
              variant="secondary"
              className="mt-3 w-full"
            >
              {detail.askQuestion}
            </ButtonLink>

            <p className="text-subtle-foreground mt-4 text-center text-xs">
              {detail.dates}
            </p>

            <h2 className="border-border mt-7 border-t pt-6 text-sm font-semibold">
              {detail.included}
            </h2>
            <ul className="mt-4 space-y-3 text-sm">
              {tour.included.map((item) => (
                <li key={item} className="flex gap-2.5">
                  <CheckIcon className="text-primary mt-0.5 size-4 shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>

            <PhotoCredit
              credit={tour.cover.credit}
              label={detail.photoBy}
              className="text-subtle-foreground border-border mt-6 border-t pt-4 text-xs"
            />
          </Reveal>
        </div>
      </Container>

      {related.length > 0 ? (
        <section className="border-border bg-surface-muted/40 border-t py-20">
          <Container size="wide">
            <Reveal>
              <h2 className="font-display text-2xl font-semibold tracking-tight">
                {detail.related}
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item, index) => (
                <Reveal key={item.slug} delay={index * 90} className="h-full">
                  <TourCard tour={item} locale={locale} dictionary={labels} />
                </Reveal>
              ))}
            </div>
            <p className="text-subtle-foreground mt-8 text-xs">
              {detail.demoNotice}
            </p>
          </Container>
        </section>
      ) : null}
    </article>
  );
}
