"use client";

import { useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { ArrowRightIcon, SearchIcon } from "@/components/ui/icons";
import type { Locale } from "@/config/i18n";
import { ReservationSummary } from "@/features/reservations/components/reservation-summary";
import { findReservation } from "@/features/reservations/services/reservations";
import type { Reservation } from "@/features/reservations/types";
import type { Dictionary } from "@/i18n/types";
import { ApiError } from "@/lib/api/client";

type ReservationLookupProps = {
  locale: Locale;
  dictionary: Dictionary;
  className?: string;
};

type State =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "found"; reservation: Reservation }
  | { kind: "message"; text: string };

/**
 * Reference + e-mail lookup, used on the home page and on its own page.
 * The e-mail never goes into the URL: the request is made from here and the result is
 * rendered in place.
 */
/** Turns a lookup failure into something the visitor can act on. */
function messageFor(error: unknown, labels: Dictionary["lookup"]): string {
  if (!(error instanceof ApiError)) return labels.error;
  if (error.isOffline) return labels.offline;
  if (error.status === 400) return labels.invalid;
  return labels.error;
}

export function ReservationLookup({
  locale,
  dictionary,
  className,
}: ReservationLookupProps) {
  const id = useId();
  const [state, setState] = useState<State>({ kind: "idle" });
  const labels = dictionary.lookup;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const reference = String(form.get("reference") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    if (!reference || !email) return;

    setState({ kind: "loading" });
    try {
      const reservation = await findReservation(reference, email);
      setState(
        reservation
          ? { kind: "found", reservation }
          : { kind: "message", text: labels.notFound },
      );
    } catch (error) {
      setState({ kind: "message", text: messageFor(error, labels) });
    }
  }

  if (state.kind === "found") {
    return (
      <div className={className}>
        <ReservationSummary
          reservation={state.reservation}
          locale={locale}
          dictionary={dictionary.reservation}
        />
        <Button
          variant="secondary"
          className="mt-4"
          onClick={() => setState({ kind: "idle" })}
        >
          {labels.reset}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={className} noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={labels.reference} htmlFor={`${id}-reference`}>
          <Input
            id={`${id}-reference`}
            name="reference"
            required
            autoComplete="off"
            spellCheck={false}
            placeholder={labels.referencePlaceholder}
            className="uppercase"
            data-tabular
          />
        </Field>
        <Field label={labels.email} htmlFor={`${id}-email`}>
          <Input
            id={`${id}-email`}
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder={labels.emailPlaceholder}
          />
        </Field>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <Button type="submit" size="lg" disabled={state.kind === "loading"}>
          {state.kind === "loading" ? (
            labels.submitting
          ) : (
            <>
              <SearchIcon className="size-4" />
              {labels.submit}
              <ArrowRightIcon className="size-4 transition-transform duration-300 group-hover/button:translate-x-1" />
            </>
          )}
        </Button>
        {state.kind === "message" ? (
          <p role="status" className="text-accent-deep text-sm">
            {state.text}
          </p>
        ) : null}
      </div>
    </form>
  );
}
