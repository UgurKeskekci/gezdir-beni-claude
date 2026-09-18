import type { Locale } from "@/config/i18n";
import { closingImage, heroImage } from "@/features/landing/data/hero-image";
import { localizeImage } from "@/lib/localize";
import type { LocalizedImage } from "@/types";

export async function getHeroImage(locale: Locale): Promise<LocalizedImage> {
  return localizeImage(heroImage, locale);
}

export async function getClosingImage(locale: Locale): Promise<LocalizedImage> {
  return localizeImage(closingImage, locale);
}
