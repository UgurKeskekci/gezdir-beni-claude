import {
  PAYMENT_TONES,
  STATUS_TONES,
  StatusBadge,
} from "@/components/shared/status-badge";
import type { Locale } from "@/config/i18n";
import type { Reservation } from "@/features/reservations/types";
import type { Dictionary } from "@/i18n/types";
import { formatDate, formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

type ReservationSummaryProps = {
  reservation: Reservation;
  locale: Locale;
  dictionary: Dictionary["reservation"];
  className?: string;
};

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-border/70 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b py-3 last:border-b-0">
      <dt className="text-muted-foreground text-sm">{label}</dt>
      <dd className="text-right text-sm font-medium">{children}</dd>
    </div>
  );
}

/** Shown after checkout and by the reference lookup — one card, one layout. */
export function ReservationSummary({
  reservation,
  locale,
  dictionary,
  className,
}: ReservationSummaryProps) {
  const { payment, price, guest, address } = reservation;

  return (
    <div className={cn("card-soft rounded-3xl p-6 sm:p-8", className)}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-subtle-foreground text-xs tracking-wide uppercase">
            {dictionary.reference}
          </p>
          <p
            className="font-display mt-1 text-2xl font-semibold tracking-tight"
            data-tabular
          >
            {reservation.reference}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusBadge tone={STATUS_TONES[reservation.status]}>
            {dictionary.status[reservation.status]}
          </StatusBadge>
          <StatusBadge tone={PAYMENT_TONES[payment.status]}>
            {dictionary.payment[payment.status]}
          </StatusBadge>
        </div>
      </div>

      <dl className="mt-6">
        <Row label={dictionary.tour}>{reservation.tour.title[locale]}</Row>
        <Row label={dictionary.date}>
          {formatDate(reservation.departure.departsOn, locale)}
        </Row>
        <Row label={dictionary.travellers}>
          <span data-tabular>{reservation.travellers}</span>
        </Row>
        <Row label={dictionary.total}>
          <span data-tabular>
            {formatPrice(price.totalAmountMinor, price.currency, locale)}
          </span>
        </Row>
        <Row label={dictionary.guest}>
          <span className="block">{guest.fullName}</span>
          <span className="text-muted-foreground block text-xs font-normal">
            {guest.email} · {guest.phone}
          </span>
        </Row>
        <Row label={dictionary.address}>
          <span className="text-muted-foreground block text-xs font-normal">
            {address.line1}
            {address.line2 ? `, ${address.line2}` : ""}
            <br />
            {address.postalCode} {address.city} · {address.country}
          </span>
        </Row>
        {payment.cardLast4 ? (
          <Row label={dictionary.card}>
            <span data-tabular>
              {payment.cardBrand?.toUpperCase()} •••• {payment.cardLast4}
            </span>
          </Row>
        ) : null}
        <Row label={dictionary.createdAt}>
          {formatDate(reservation.createdAt, locale)}
        </Row>
      </dl>

      <p className="text-subtle-foreground mt-6 text-xs">
        {dictionary.demoNotice}
      </p>
    </div>
  );
}
