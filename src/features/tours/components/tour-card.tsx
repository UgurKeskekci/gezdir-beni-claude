import Link from "next/link";

import { buttonStyles } from "@/components/ui/button";
import {
  ArrowRightIcon,
  ClockIcon,
  PinIcon,
  StarIcon,
  UsersIcon,
} from "@/components/ui/icons";
import { Photo } from "@/components/ui/photo";
import type { Locale } from "@/config/i18n";
import { FavoriteButton } from "@/features/tours/components/favorite-button";
import type { Tour, TourBadgeTone } from "@/features/tours/types";
import type { Dictionary } from "@/i18n/types";
import { formatNumber, formatPrice } from "@/lib/format";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

/** Each badge meaning gets its own colour so they never read as the same label. */
const BADGE_TONES: Record<TourBadgeTone, string> = {
  bestseller: "bg-accent text-[oklch(0.2_0.03_60)]",
  new: "bg-primary text-primary-foreground",
  scarce: "bg-white text-[oklch(0.25_0.02_20)]",
};

type TourCardProps = {
  tour: Tour;
  locale: Locale;
  dictionary: Dictionary["tours"];
};

export function TourCard({ tour, locale, dictionary }: TourCardProps) {
  return (
    <article
      className={cn(
        "group border-border bg-surface relative flex h-full flex-col overflow-hidden rounded-3xl border",
        "transition-[transform,border-color,box-shadow] duration-300 ease-[var(--ease-out-expo)]",
        "hover:border-primary/40 hover:-translate-y-1.5",
        "hover:shadow-[0_24px_60px_-28px_oklch(0.79_0.13_190_/_0.55)]",
      )}
    >
      <div className="relative h-52 overflow-hidden">
        <Photo
          image={tour.cover}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.07]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/25"
        />

        <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-2">
          {tour.badge ? (
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-[0.7rem] font-semibold",
                BADGE_TONES[tour.badgeTone ?? "new"],
              )}
            >
              {tour.badge}
            </span>
          ) : (
            <span />
          )}
          <FavoriteButton
            label={dictionary.favorite}
            labelActive={dictionary.favoriteRemove}
          />
        </div>

        <span className="absolute bottom-3 left-4 inline-flex items-center gap-1.5 text-xs font-medium text-white/90">
          <PinIcon className="size-3.5" />
          {tour.destination}, {tour.country}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3.5 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg leading-snug font-semibold tracking-tight text-balance">
            {/* Stretched link: the whole card is clickable without nesting links. */}
            <Link
              href={routes.tour(locale, tour.slug)}
              className="after:absolute after:inset-0 after:content-['']"
            >
              {tour.title}
            </Link>
          </h3>
          <span
            className="flex shrink-0 items-center gap-1 text-sm font-medium"
            data-tabular
          >
            <StarIcon className="text-accent size-4" />
            {formatNumber(tour.rating, locale, 1)}
          </span>
        </div>

        {/* Clamped so every card in a row keeps the same rhythm. */}
        <p className="text-muted-foreground line-clamp-2 min-h-10 text-sm leading-relaxed">
          {tour.summary}
        </p>

        <ul className="flex min-h-7 flex-wrap gap-1.5 overflow-hidden">
          {tour.highlights.slice(0, 3).map((highlight) => (
            <li
              key={highlight}
              className="bg-surface-muted text-muted-foreground rounded-full px-2.5 py-1 text-xs whitespace-nowrap"
            >
              {highlight}
            </li>
          ))}
        </ul>

        <dl
          className="text-subtle-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-xs"
          data-tabular
        >
          <div className="flex items-center gap-1.5">
            <ClockIcon className="size-4" />
            <dd>
              {tour.durationDays} {dictionary.days} / {tour.durationNights}{" "}
              {dictionary.nights}
            </dd>
          </div>
          <div className="flex items-center gap-1.5">
            <UsersIcon className="size-4" />
            <dd>
              {tour.maxGroupSize} {dictionary.maxGroup}
            </dd>
          </div>
          <div>
            {formatNumber(tour.reviewCount, locale)} {dictionary.reviews}
          </div>
        </dl>

        <div className="border-border mt-auto flex items-end justify-between gap-3 border-t pt-4">
          <p className="leading-none">
            <span
              className="font-display text-2xl font-semibold tracking-tight"
              data-tabular
            >
              {formatPrice(tour.price.amount, tour.price.currency, locale)}
            </span>
            <span className="text-subtle-foreground mt-1.5 block text-xs">
              {dictionary.perPerson}
            </span>
          </p>
          <span
            aria-hidden="true"
            className={buttonStyles({
              variant: "secondary",
              size: "sm",
              className:
                "group-hover:border-primary/50 group-hover:text-primary",
            })}
          >
            {dictionary.detail}
            <ArrowRightIcon className="size-4 transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </article>
  );
}
