import type { LocalizedText } from "@/config/i18n";

/** How a review is stored (all languages in one record). */
export type TestimonialEntry = {
  id: string;
  quote: LocalizedText;
  author: string;
  /** Which tour the review is about, and when. */
  context: LocalizedText;
  rating: number;
};

/** How a review reaches the UI. */
export type Testimonial = {
  id: string;
  quote: string;
  author: string;
  context: string;
  rating: number;
  /** Two letters for the avatar circle. */
  initials: string;
};
