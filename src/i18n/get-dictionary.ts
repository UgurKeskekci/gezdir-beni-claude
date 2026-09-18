import type { Locale } from "@/config/i18n";
import { en } from "@/i18n/dictionaries/en";
import { tr } from "@/i18n/dictionaries/tr";
import type { Dictionary } from "@/i18n/types";

const dictionaries: Record<Locale, Dictionary> = { tr, en };

/** Async on purpose: swapping to a CMS or a fetched JSON file later changes only this body. */
export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale];
}
