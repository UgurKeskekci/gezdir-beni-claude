"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId } from "react";

import { locales, type Locale } from "@/config/i18n";
import type { Dictionary } from "@/i18n/types";
import { cn } from "@/lib/utils";

type LocaleSwitcherProps = {
  locale: Locale;
  dictionary: Dictionary["localeSwitcher"];
  /** True while the header is transparent over a photo, which needs light colours. */
  onPhoto?: boolean;
  className?: string;
};

/** Keeps the reader on the same page when they switch language. */
function swapLocale(pathname: string, next: Locale) {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return `/${next}`;
  segments[0] = next;
  return `/${segments.join("/")}`;
}

export function LocaleSwitcher({
  locale,
  dictionary,
  onPhoto = false,
  className,
}: LocaleSwitcherProps) {
  const pathname = usePathname();
  const indicatorId = useId();

  return (
    <nav
      aria-label={dictionary.label}
      className={cn(
        "relative flex items-center rounded-full border p-0.5 transition-colors duration-200",
        onPhoto ? "border-white/30" : "border-border/80",
        className,
      )}
    >
      {locales.map((item) => {
        const active = item === locale;
        return (
          <Link
            key={item}
            href={swapLocale(pathname, item)}
            hrefLang={item}
            aria-current={active ? "true" : undefined}
            className={cn(
              "relative rounded-full px-2.5 py-1 text-xs font-medium uppercase transition-colors duration-200",
              active
                ? "text-primary-foreground"
                : onPhoto
                  ? "text-white/75 hover:text-white"
                  : "text-muted-foreground hover:text-foreground",
            )}
          >
            {active ? (
              // layoutId makes the pill slide between the two options.
              <motion.span
                layoutId={indicatorId}
                className="bg-primary absolute inset-0 -z-10 rounded-full"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            ) : null}
            <span className="sr-only">{dictionary[item]}</span>
            <span aria-hidden="true">{item}</span>
          </Link>
        );
      })}
    </nav>
  );
}
