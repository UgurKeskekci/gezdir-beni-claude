import { StarIcon } from "@/components/ui/icons";
import { Photo } from "@/components/ui/photo";
import type { Locale } from "@/config/i18n";
import type { Testimonial } from "@/features/testimonials";
import type { Departure, TourSummary } from "@/features/tours";
import type { Dictionary } from "@/i18n/types";
import { formatDate, formatNumber } from "@/lib/format";
import { routes } from "@/lib/routes";

type HeroCardsProps = {
  locale: Locale;
  tour: TourSummary;
  /** The next real departure, when the API has one. */
  departure?: Departure;
  testimonial: Testimonial;
  dictionary: Dictionary;
};

/** Two glass cards that drift slowly beside the headline. */
export function HeroCards({
  locale,
  tour,
  departure,
  testimonial,
  dictionary,
}: HeroCardsProps) {
  const hero = dictionary.hero;

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <a
        href={
          departure
            ? routes.book(locale, tour.slug, departure.id)
            : routes.tour(locale, tour.slug)
        }
        className="glass-panel animate-float-soft group flex items-center gap-4 rounded-3xl p-3 transition-transform duration-300 hover:-translate-y-1"
      >
        <span className="relative size-16 shrink-0 overflow-hidden rounded-2xl">
          {tour.cover ? (
            <Photo
              image={tour.cover}
              decorative
              fill
              sizes="64px"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : null}
        </span>
        <span className="min-w-0">
          <span className="text-primary block text-[0.7rem] font-semibold tracking-wide uppercase">
            {hero.departureCard.eyebrow}
          </span>
          <span className="text-foreground mt-0.5 block truncate text-sm font-semibold">
            {tour.title}
          </span>
          {/* Real date and real availability, straight from the booking API. */}
          <span
            className="text-accent-deep mt-1 block text-xs font-medium"
            data-tabular
          >
            {departure
              ? `${formatDate(departure.departsOn, locale)} · ${dictionary.departures.lastSeats} ${formatNumber(departure.seatsLeft, locale)} ${dictionary.departures.seatsLeft}`
              : hero.departureCard.soon}
          </span>
        </span>
      </a>

      <figure
        className="glass-panel animate-float-soft rounded-3xl p-5"
        style={{ animationDelay: "1.4s" }}
      >
        <div className="flex items-center justify-between">
          <span className="text-primary text-[0.7rem] font-semibold tracking-wide uppercase">
            {hero.reviewCard.eyebrow}
          </span>
          <span className="flex gap-0.5" aria-hidden="true">
            {Array.from({ length: testimonial.rating }).map((_, index) => (
              <StarIcon key={index} className="text-accent size-3" />
            ))}
          </span>
        </div>
        <blockquote className="text-foreground/85 mt-3 line-clamp-3 text-sm leading-relaxed">
          {testimonial.quote}
        </blockquote>
        <figcaption className="text-muted-foreground mt-3 text-xs">
          {testimonial.author} · {testimonial.context}
        </figcaption>
      </figure>
    </div>
  );
}
