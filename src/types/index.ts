import type { LocalizedText } from "@/config/i18n";

/** Who made a photo and under which licence — never invented, always copied from the source. */
export type ImageCredit = {
  author: string;
  license: string;
  source: string;
};

/** How an image is stored (alt text in every language). */
export type ImageEntry = {
  url: string;
  alt: LocalizedText;
  credit: ImageCredit;
  /** Tiny base64 preview from scripts/generate-blur-data.mjs. */
  blurDataURL?: string;
};

/** How an image reaches the UI. */
export type LocalizedImage = {
  url: string;
  alt: string;
  credit: ImageCredit;
  blurDataURL?: string;
};
