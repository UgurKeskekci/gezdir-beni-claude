"use client";

import { useId, useMemo, useRef, useState } from "react";

import { Button, ButtonLink } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { ArrowRightIcon, CheckIcon } from "@/components/ui/icons";
import type { Locale } from "@/config/i18n";
import { ReservationSummary } from "@/features/reservations/components/reservation-summary";
import {
  FIELD_ORDER,
  fieldErrorsFromApi,
  validateCheckout,
  type CheckoutField,
  type FieldErrors,
} from "@/features/reservations/lib/validate-checkout";
import { createReservation } from "@/features/reservations/services/reservations";
import type { Reservation } from "@/features/reservations/types";
import type { Departure, Tour } from "@/features/tours/types";
import type { Dictionary } from "@/i18n/types";
import { ApiError } from "@/lib/api/client";
import { formatDate, formatPrice } from "@/lib/format";
import { routes } from "@/lib/routes";

type CheckoutFormProps = {
  tour: Tour;
  departures: Departure[];
  locale: Locale;
  dictionary: Dictionary;
  initialDepartureId?: string;
};

type Status =
  | { kind: "editing"; error?: string }
  | { kind: "sending" }
  | { kind: "done"; reservation: Reservation };

const CURRENT_YEAR = new Date().getFullYear();
const EXPIRY_YEARS = Array.from(
  { length: 12 },
  (_, index) => CURRENT_YEAR + index,
);

/** Turns an API failure into something a traveller can act on. */
function messageFor(error: unknown, labels: Dictionary["booking"]): string {
  if (!(error instanceof ApiError)) return labels.errors.generic;
  if (error.isOffline) return labels.errors.offline;
  if (error.status === 409) return labels.errors.soldOut;
  if (error.code === "bad_request") return labels.errors.card;
  if (error.status === 400) return labels.errors.form;
  return labels.errors.generic;
}

export function CheckoutForm({
  tour,
  departures,
  locale,
  dictionary,
  initialDepartureId,
}: CheckoutFormProps) {
  const id = useId();
  const labels = dictionary.booking;

  const bookable = useMemo(
    () => departures.filter((departure) => departure.seatsLeft > 0),
    [departures],
  );

  const [departureId, setDepartureId] = useState(
    () =>
      bookable.find((departure) => departure.id === initialDepartureId)?.id ??
      bookable[0]?.id ??
      "",
  );
  const [travellers, setTravellers] = useState(1);
  const [payNow, setPayNow] = useState(true);
  const [status, setStatus] = useState<Status>({ kind: "editing" });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const formRef = useRef<HTMLFormElement>(null);

  /** Moves the cursor to the first thing the visitor has to fix. */
  function focusFirstError(errors: FieldErrors) {
    const first = FIELD_ORDER.find((field) => errors[field]);
    if (!first || !formRef.current) return;
    const control = formRef.current.elements.namedItem(first);
    if (control instanceof HTMLElement) {
      control.focus();
      control.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }

  const departure = bookable.find((item) => item.id === departureId);
  const seatsLeft = departure?.seatsLeft ?? 0;
  const unitMinor = departure?.price.amountMinor ?? tour.price.amountMinor;
  const currency = departure?.price.currency ?? tour.price.currency;
  const totalMinor = unitMinor * travellers;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!departure) {
      setStatus({ kind: "editing", error: labels.errors.noDeparture });
      return;
    }

    const form = new FormData(event.currentTarget);
    const value = (name: string) => String(form.get(name) ?? "").trim();

    // Check here first so the visitor is told which field is wrong, next to that
    // field, instead of getting one generic sentence back from the API.
    const values = Object.fromEntries(
      FIELD_ORDER.map((field) => [field, value(field)]),
    ) as Record<CheckoutField, string>;

    const localErrors = validateCheckout(values, payNow, labels.fieldErrors);
    if (Object.keys(localErrors).length > 0) {
      setFieldErrors(localErrors);
      setStatus({ kind: "editing", error: labels.errors.form });
      focusFirstError(localErrors);
      return;
    }

    setFieldErrors({});
    setStatus({ kind: "sending" });
    try {
      const reservation = await createReservation({
        departureId: departure.id,
        travellers,
        guest: {
          fullName: value("fullName"),
          email: value("email"),
          phone: value("phone"),
          ...(value("note") ? { note: value("note") } : {}),
        },
        address: {
          line1: value("addressLine1"),
          ...(value("addressLine2") ? { line2: value("addressLine2") } : {}),
          city: value("city"),
          postalCode: value("postalCode"),
          country: value("country"),
        },
        ...(payNow
          ? {
              payment: {
                method: "card" as const,
                card: {
                  number: value("cardNumber"),
                  holder: value("cardHolder"),
                  expiryMonth: Number(value("expiryMonth")),
                  expiryYear: Number(value("expiryYear")),
                  cvc: value("cvc"),
                },
              },
            }
          : {}),
      });

      setStatus({ kind: "done", reservation });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      const fromApi =
        error instanceof ApiError ? fieldErrorsFromApi(error.details) : {};
      setFieldErrors(fromApi);
      setStatus({ kind: "editing", error: messageFor(error, labels) });
      focusFirstError(fromApi);
    }
  }

  if (status.kind === "done") {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="border-primary/30 bg-primary/10 flex items-center gap-3 rounded-2xl border p-4">
          <span className="bg-primary text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-full">
            <CheckIcon className="size-4" />
          </span>
          <p className="font-display text-lg font-semibold">
            {labels.success.title}
          </p>
        </div>

        <ReservationSummary
          reservation={status.reservation}
          locale={locale}
          dictionary={dictionary.reservation}
          className="mt-5"
        />

        <p className="text-muted-foreground mt-5 text-sm leading-relaxed">
          {labels.success.keepIt}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href={routes.tours(locale)} variant="secondary">
            {labels.success.viewAll}
          </ButtonLink>
          <ButtonLink href={routes.lookup(locale)} variant="ghost">
            {dictionary.nav.lookup}
          </ButtonLink>
        </div>
      </div>
    );
  }

  const sending = status.kind === "sending";

  /** Label, required marker and error for one field. */
  const fieldProps = (field: CheckoutField, isRequired = true) => ({
    htmlFor: `${id}-${field}`,
    error: fieldErrors[field],
    required: isRequired ? labels.requiredMark : undefined,
  });

  /** The matching input wiring, including the aria hooks screen readers need. */
  const inputProps = (field: CheckoutField) => ({
    id: `${id}-${field}`,
    name: field,
    "aria-invalid": Boolean(fieldErrors[field]),
    "aria-describedby": fieldErrors[field] ? `${id}-${field}-error` : undefined,
    // Clear the message as soon as the visitor starts fixing that field.
    onChange: () =>
      setFieldErrors((current) =>
        current[field] ? { ...current, [field]: undefined } : current,
      ),
  });

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      className="grid gap-10 lg:grid-cols-[1fr_21rem] lg:items-start"
    >
      <div className="min-w-0 space-y-10">
        <section>
          <h2 className="font-display text-lg font-semibold">
            {labels.tripSection}
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label={labels.date} htmlFor={`${id}-departure`}>
              <Select
                id={`${id}-departure`}
                value={departureId}
                onChange={(event) => {
                  setDepartureId(event.target.value);
                  setTravellers(1);
                }}
                disabled={bookable.length === 0}
              >
                {bookable.length === 0 ? (
                  <option value="">{dictionary.departures.none}</option>
                ) : (
                  bookable.map((item) => (
                    <option key={item.id} value={item.id}>
                      {formatDate(item.departsOn, locale)}
                    </option>
                  ))
                )}
              </Select>
            </Field>

            <Field
              label={labels.travellers}
              htmlFor={`${id}-travellers`}
              hint={`${labels.travellersHint}: ${seatsLeft}`}
            >
              <Select
                id={`${id}-travellers`}
                value={travellers}
                onChange={(event) => setTravellers(Number(event.target.value))}
                disabled={seatsLeft === 0}
              >
                {Array.from(
                  { length: Math.max(seatsLeft, 1) },
                  (_, index) => index + 1,
                ).map((count) => (
                  <option key={count} value={count}>
                    {count}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold">
            {labels.guestSection}
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label={labels.fullName} {...fieldProps("fullName")}>
              <Input {...inputProps("fullName")} autoComplete="name" />
            </Field>
            <Field label={labels.email} {...fieldProps("email")}>
              <Input
                {...inputProps("email")}
                type="email"
                required
                autoComplete="email"
              />
            </Field>
            <Field label={labels.phone} {...fieldProps("phone")}>
              <Input
                {...inputProps("phone")}
                type="tel"
                required
                autoComplete="tel"
              />
            </Field>
            <Field
              label={labels.note}
              htmlFor={`${id}-note`}
              optional={labels.noteOptional}
              className="sm:col-span-2"
            >
              <Textarea
                id={`${id}-note`}
                name="note"
                rows={3}
                placeholder={labels.notePlaceholder}
              />
            </Field>
          </div>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold">
            {labels.addressSection}
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field
              label={labels.addressLine1}
              {...fieldProps("addressLine1")}
              className="sm:col-span-2"
            >
              <Input
                {...inputProps("addressLine1")}
                autoComplete="address-line1"
              />
            </Field>
            <Field
              label={labels.addressLine2}
              htmlFor={`${id}-addressLine2`}
              optional={labels.noteOptional}
              className="sm:col-span-2"
            >
              <Input
                id={`${id}-addressLine2`}
                name="addressLine2"
                autoComplete="address-line2"
              />
            </Field>
            <Field label={labels.city} {...fieldProps("city")}>
              <Input {...inputProps("city")} autoComplete="address-level2" />
            </Field>
            <Field label={labels.postalCode} {...fieldProps("postalCode")}>
              <Input
                {...inputProps("postalCode")}
                autoComplete="postal-code"
                data-tabular
              />
            </Field>
            <Field
              label={labels.country}
              {...fieldProps("country")}
              hint={labels.countryHint}
            >
              <Input
                {...inputProps("country")}
                defaultValue="TR"
                maxLength={2}
                autoComplete="country"
                className="uppercase"
              />
            </Field>
          </div>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold">
            {labels.paymentSection}
          </h2>

          <div className="mt-4 flex flex-col gap-2">
            <label className="border-border hover:bg-surface-muted/50 flex cursor-pointer items-start gap-3 rounded-2xl border p-3.5 transition-colors">
              <input
                type="radio"
                name="paymentMode"
                checked={payNow}
                onChange={() => setPayNow(true)}
                className="accent-primary mt-0.5"
              />
              <span className="text-sm font-medium">{labels.payNow}</span>
            </label>
            <label className="border-border hover:bg-surface-muted/50 flex cursor-pointer items-start gap-3 rounded-2xl border p-3.5 transition-colors">
              <input
                type="radio"
                name="paymentMode"
                checked={!payNow}
                onChange={() => setPayNow(false)}
                className="accent-primary mt-0.5"
              />
              <span className="text-sm">
                <span className="block font-medium">{labels.payLater}</span>
                <span className="text-muted-foreground mt-0.5 block text-xs">
                  {labels.payLaterHint}
                </span>
              </span>
            </label>
          </div>

          {payNow ? (
            <>
              <p className="border-accent/30 bg-accent/10 text-accent-deep mt-4 rounded-2xl border p-3.5 text-xs leading-relaxed">
                {labels.demoWarning}
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field
                  label={labels.cardNumber}
                  {...fieldProps("cardNumber", payNow)}
                  className="sm:col-span-2"
                >
                  <Input
                    {...inputProps("cardNumber")}
                    inputMode="numeric"
                    autoComplete="off"
                    defaultValue="4242 4242 4242 4242"
                    data-tabular
                  />
                </Field>
                <Field
                  label={labels.cardHolder}
                  {...fieldProps("cardHolder", payNow)}
                  className="sm:col-span-2"
                >
                  <Input
                    {...inputProps("cardHolder")}
                    autoComplete="off"
                    className="uppercase"
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field
                    label={labels.expiryMonth}
                    htmlFor={`${id}-expiryMonth`}
                  >
                    <Select
                      id={`${id}-expiryMonth`}
                      name="expiryMonth"
                      defaultValue="12"
                    >
                      {Array.from({ length: 12 }, (_, index) => index + 1).map(
                        (month) => (
                          <option key={month} value={month}>
                            {String(month).padStart(2, "0")}
                          </option>
                        ),
                      )}
                    </Select>
                  </Field>
                  <Field label={labels.expiryYear} htmlFor={`${id}-expiryYear`}>
                    <Select
                      id={`${id}-expiryYear`}
                      name="expiryYear"
                      defaultValue={CURRENT_YEAR + 2}
                    >
                      {EXPIRY_YEARS.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </Select>
                  </Field>
                </div>
                <Field label={labels.cvc} {...fieldProps("cvc", payNow)}>
                  <Input
                    {...inputProps("cvc")}
                    inputMode="numeric"
                    maxLength={4}
                    autoComplete="off"
                    defaultValue="123"
                    data-tabular
                  />
                </Field>
              </div>
            </>
          ) : null}
        </section>
      </div>

      <aside className="card-soft rounded-3xl p-6 lg:sticky lg:top-24">
        <h2 className="font-display text-lg font-semibold">{labels.summary}</h2>

        <p className="mt-4 text-sm font-medium">{tour.title}</p>
        {departure ? (
          <p className="text-muted-foreground mt-1 text-sm" data-tabular>
            {formatDate(departure.departsOn, locale)}
          </p>
        ) : null}

        <dl className="border-border mt-5 space-y-2.5 border-t pt-5 text-sm">
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-muted-foreground">{labels.perPerson}</dt>
            <dd data-tabular>{formatPrice(unitMinor, currency, locale)}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-muted-foreground">{labels.travellers}</dt>
            <dd data-tabular>{travellers}</dd>
          </div>
        </dl>

        <div className="border-border mt-5 flex items-baseline justify-between gap-4 border-t pt-5">
          <span className="font-medium">{labels.total}</span>
          <span className="font-display text-2xl font-semibold" data-tabular>
            {formatPrice(totalMinor, currency, locale)}
          </span>
        </div>

        {status.kind === "editing" && status.error ? (
          <p
            role="alert"
            className="border-accent/40 bg-accent/10 text-accent-deep mt-5 rounded-2xl border p-3.5 text-sm"
          >
            {status.error}
          </p>
        ) : null}

        <Button
          type="submit"
          size="lg"
          className="mt-5 w-full"
          disabled={sending || !departure}
        >
          {sending ? (
            labels.submitting
          ) : (
            <>
              {labels.submit}
              <ArrowRightIcon className="size-4 transition-transform duration-300 group-hover/button:translate-x-1" />
            </>
          )}
        </Button>

        <ButtonLink
          href={routes.tour(locale, tour.slug)}
          variant="ghost"
          className="mt-2 w-full"
        >
          {labels.backToTour}
        </ButtonLink>
      </aside>
    </form>
  );
}
