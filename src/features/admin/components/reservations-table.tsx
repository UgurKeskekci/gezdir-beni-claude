import Link from "next/link";

import { STATUS_TONES, StatusBadge } from "@/components/shared/status-badge";
import type { Locale } from "@/config/i18n";
import type { Reservation } from "@/features/reservations";
import type { Dictionary } from "@/i18n/types";
import { formatDate, formatPrice } from "@/lib/format";
import { routes } from "@/lib/routes";

type ReservationsTableProps = {
  reservations: Reservation[];
  locale: Locale;
  dictionary: Dictionary;
};

/**
 * A list of links rather than a `<table>`: every row opens a booking, and this way the
 * same markup stacks into readable cards on a phone instead of scrolling sideways.
 */
const COLUMNS =
  "md:grid-cols-[7.5rem_minmax(0,1.1fr)_minmax(0,1.2fr)_3.5rem_7rem_6.5rem]";

export function ReservationsTable({
  reservations,
  locale,
  dictionary,
}: ReservationsTableProps) {
  const t = dictionary.admin.list;

  return (
    <div className="card-soft overflow-hidden rounded-2xl">
      <div
        aria-hidden="true"
        className={`text-subtle-foreground border-border hidden gap-4 border-b px-4 py-3 text-xs tracking-wide uppercase md:grid ${COLUMNS}`}
      >
        <span>{t.columns.reference}</span>
        <span>{t.columns.guest}</span>
        <span>{t.columns.tour}</span>
        <span className="text-right">{t.columns.travellers}</span>
        <span className="text-right">{t.columns.total}</span>
        <span className="text-right">{t.columns.status}</span>
      </div>

      <ul>
        {reservations.map((reservation) => (
          <li key={reservation.reference}>
            <Link
              href={routes.adminReservation(locale, reservation.reference)}
              className={`border-border/70 hover:bg-surface-muted focus-visible:outline-primary grid gap-x-4 gap-y-2 border-b px-4 py-4 text-sm transition-colors last:border-b-0 focus-visible:outline-2 focus-visible:-outline-offset-2 md:items-center ${COLUMNS}`}
            >
              <span className="font-semibold" data-tabular>
                {reservation.reference}
              </span>

              <span className="min-w-0">
                <span className="block truncate">
                  {reservation.guest.fullName}
                </span>
                <span className="text-muted-foreground block truncate text-xs">
                  {reservation.guest.email}
                </span>
              </span>

              <span className="min-w-0">
                <span className="block truncate">
                  {reservation.tour.title[locale]}
                </span>
                <span className="text-muted-foreground block text-xs">
                  {formatDate(reservation.departure.departsOn, locale)}
                </span>
              </span>

              <span className="text-muted-foreground md:text-foreground md:text-right">
                <span className="md:hidden">{t.columns.travellers}: </span>
                <span data-tabular>{reservation.travellers}</span>
              </span>

              <span className="font-medium md:text-right" data-tabular>
                {formatPrice(
                  reservation.price.totalAmountMinor,
                  reservation.price.currency,
                  locale,
                )}
              </span>

              <span className="md:text-right">
                <StatusBadge tone={STATUS_TONES[reservation.status]}>
                  {dictionary.reservation.status[reservation.status]}
                </StatusBadge>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
