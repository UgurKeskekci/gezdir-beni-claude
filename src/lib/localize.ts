import type { Locale } from "@/config/i18n";
import type { ImageEntry, LocalizedImage } from "@/types";

export function localizeImage(
  image: ImageEntry,
  locale: Locale,
): LocalizedImage {
  return {
    url: image.url,
    alt: image.alt[locale],
    credit: image.credit,
    blurDataURL: image.blurDataURL,
  };
}
