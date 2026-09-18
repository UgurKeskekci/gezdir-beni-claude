import type { tr } from "@/i18n/dictionaries/tr";

/**
 * Turkish is the reference dictionary: every other language must match its shape,
 * so a missing translation becomes a type error instead of a blank string.
 */
export type Dictionary = typeof tr;
