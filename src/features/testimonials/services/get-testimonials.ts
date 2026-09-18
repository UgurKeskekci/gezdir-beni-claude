import type { Locale } from "@/config/i18n";
import { testimonials } from "@/features/testimonials/data/testimonials";
import type {
  Testimonial,
  TestimonialEntry,
} from "@/features/testimonials/types";

function initialsOf(author: string) {
  return author
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toLocaleUpperCase("tr-TR");
}

function localize(entry: TestimonialEntry, locale: Locale): Testimonial {
  return {
    id: entry.id,
    author: entry.author,
    rating: entry.rating,
    quote: entry.quote[locale],
    context: entry.context[locale],
    initials: initialsOf(entry.author),
  };
}

/**
 * The only way the UI reads reviews.
 * Backend later: return api.get<Testimonial[]>(`/testimonials?locale=${locale}`).
 */
export async function getTestimonials(locale: Locale): Promise<Testimonial[]> {
  return testimonials.map((entry) => localize(entry, locale));
}

/** The single review shown on the hero card. */
export async function getFeaturedTestimonial(
  locale: Locale,
): Promise<Testimonial> {
  return localize(testimonials[0], locale);
}
