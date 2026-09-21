import { ButtonLink } from "@/components/ui/button";
import { ArrowRightIcon, CalendarIcon } from "@/components/ui/icons";
import type { Locale } from "@/config/i18n";
import type { Departure } from "@/features/tours/types";
import type { Dictionary } from "@/i18n/types";
import { formatDate, formatNumber, formatPrice } from "@/lib/format";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

type DeparturePickerProps = {
  slug: string;
  departures: Departure[];
  locale: Locale;
  dictionary: Dictionary["departures"];
};

/** Fewer than this and the date is shown as nearly gone. */
const SCARCE_THRESHOLD = 4;

export function DeparturePicker({
  slug,
  departures,
  locale,
  dictionary,
}: DeparturePickerProps) {
  if (departures.length === 0) {
    return <p className="text-muted-foreground text-sm">{dictionary.none}</p>;
  }

  return (
    <ul className="flex flex-col gap-2.5">
      {departures.map((departure) => {
        const soldOut = departure.seatsLeft <= 0;
        const scarce = !soldOut && departure.seatsLeft < SCARCE_THRESHOLD;

        return (
          <li
            key={departure.id}
            className={cn(
              "border-border bg-surface-muted/60 flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-3.5 transition-colors",
              soldOut
                ? "opacity-55"
                : "hover:border-primary/40 hover:bg-primary/5",
            )}
          >
            <div className="min-w-0">
              <p className="flex items-center gap-2 text-sm font-medium">
                <CalendarIcon className="text-primary size-4 shrink-0" />
                <span data-tabular>
                  {formatDate(departure.departsOn, locale)}
                </span>
              </p>
              <p className="text-subtle-foreground mt-1 pl-6 text-xs">
                {soldOut ? (
                  dictionary.soldOut
                ) : (
                  <span className={cn(scarce && "text-accent")}>
                    {scarce ? `${dictionary.lastSeats} ` : ""}
                    <span data-tabular>
                      {formatNumber(departure.seatsLeft, locale)}
                    </span>{" "}
                    {dictionary.seatsLeft}
                  </span>
                )}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-display text-sm font-semibold" data-tabular>
                {formatPrice(
                  departure.price.amountMinor,
                  departure.price.currency,
                  locale,
                )}
              </span>
              {soldOut ? (
                <span className="text-subtle-foreground text-xs">
                  {dictionary.soldOut}
                </span>
              ) : (
                <ButtonLink
                  href={routes.book(locale, slug, departure.id)}
                  size="sm"
                >
                  {dictionary.book}
                  <ArrowRightIcon className="size-4 transition-transform duration-300 group-hover/button:translate-x-1" />
                </ButtonLink>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
