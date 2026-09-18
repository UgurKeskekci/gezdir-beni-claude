import { StarIcon } from "@/components/ui/icons";
import { Photo } from "@/components/ui/photo";
import type { Locale } from "@/config/i18n";
import type { Testimonial } from "@/features/testimonials";
import type { Tour } from "@/features/tours";
import type { Dictionary } from "@/i18n/types";
import { routes } from "@/lib/routes";

type HeroCardsProps = {
  locale: Locale;
  tour: Tour;
  testimonial: Testimonial;
  dictionary: Dictionary["hero"];
};

/** Two glass cards that drift slowly beside the headline. */
export function HeroCards({
  locale,
  tour,
  testimonial,
  dictionary,
}: HeroCardsProps) {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <a
        href={routes.tour(locale, tour.slug)}
        className="glass-panel animate-float-soft group flex items-center gap-4 rounded-3xl p-3 transition-transform duration-300 hover:-translate-y-1"
      >
        <span className="relative size-16 shrink-0 overflow-hidden rounded-2xl">
          <Photo
            image={tour.cover}
            decorative
            fill
            sizes="64px"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </span>
        <span className="min-w-0">
          <span className="text-primary block text-[0.7rem] font-semibold tracking-wide uppercase">
            {dictionary.departureCard.eyebrow}
          </span>
          <span className="mt-0.5 block truncate text-sm font-medium text-white">
            {tour.title}
          </span>
          <span className="text-accent mt-1 block text-xs">
            {dictionary.departureCard.date} · {dictionary.departureCard.spots}
          </span>
        </span>
      </a>

      <figure
        className="glass-panel animate-float-soft rounded-3xl p-5"
        style={{ animationDelay: "1.4s" }}
      >
        <div className="flex items-center justify-between">
          <span className="text-primary text-[0.7rem] font-semibold tracking-wide uppercase">
            {dictionary.reviewCard.eyebrow}
          </span>
          <span className="flex gap-0.5" aria-hidden="true">
            {Array.from({ length: testimonial.rating }).map((_, index) => (
              <StarIcon key={index} className="text-accent size-3" />
            ))}
          </span>
        </div>
        <blockquote className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/85">
          {testimonial.quote}
        </blockquote>
        <figcaption className="mt-3 text-xs text-white/55">
          {testimonial.author} · {testimonial.context}
        </figcaption>
      </figure>
    </div>
  );
}
