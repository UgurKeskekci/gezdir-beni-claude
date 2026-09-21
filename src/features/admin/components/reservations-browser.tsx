"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useState, type FormEvent } from "react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import type { Locale } from "@/config/i18n";
import { ReservationsTable } from "@/features/admin/components/reservations-table";
import { isSessionExpired } from "@/features/admin/lib/session";
import { listAdminReservations } from "@/features/admin/services/admin";
import { RESERVATION_STATUSES } from "@/features/admin/types";
import type { Reservation, ReservationStatus } from "@/features/reservations";
import type { Dictionary } from "@/i18n/types";
import type { PageMeta } from "@/lib/api/client";
import { formatNumber } from "@/lib/format";
import { routes } from "@/lib/routes";

export type ReservationFilters = {
  status?: ReservationStatus;
  q?: string;
  page: number;
};

type ReservationsBrowserProps = {
  locale: Locale;
  dictionary: Dictionary;
  /** Read from the URL by the page, so a filtered view can be shared and bookmarked. */
  filters: ReservationFilters;
};

export function ReservationsBrowser({
  locale,
  dictionary,
  filters,
}: ReservationsBrowserProps) {
  const router = useRouter();
  const id = useId();
  const t = dictionary.admin.list;

  const [result, setResult] = useState<{
    rows: Reservation[];
    meta: PageMeta;
  } | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  // Derived, so the effect never sets state synchronously. The page remounts this
  // component whenever the URL changes, so both start fresh on every new query.
  const loading = result === null && !failed;

  // Typing should not re-query on every keystroke, so the controls hold their own
  // value until the form is submitted; the URL stays the single source of truth.
  const [query, setQuery] = useState(filters.q ?? "");
  const [status, setStatus] = useState<string>(filters.status ?? "");

  useEffect(() => {
    let cancelled = false;

    listAdminReservations({
      status: filters.status,
      q: filters.q,
      page: filters.page,
    })
      .then((page) => {
        if (!cancelled) setResult({ rows: page.data, meta: page.meta });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        if (isSessionExpired(error)) {
          router.replace(routes.adminLogin(locale, true));
          return;
        }
        setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [attempt, filters.status, filters.q, filters.page, locale, router]);

  function retry() {
    setFailed(false);
    setResult(null);
    setAttempt((current) => current + 1);
  }

  function go(next: ReservationFilters) {
    const params: Record<string, string> = {};
    if (next.status) params.status = next.status;
    if (next.q) params.q = next.q;
    if (next.page > 1) params.page = String(next.page);
    router.push(routes.adminReservations(locale, params));
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    go({
      status: status === "" ? undefined : (status as ReservationStatus),
      q: query.trim() === "" ? undefined : query.trim(),
      page: 1, // a new search always starts at the first page
    });
  }

  const filtered = Boolean(filters.status || filters.q);
  const rows = result?.rows ?? [];
  const page = result?.meta.page ?? filters.page;
  const pageCount = result?.meta.pageCount ?? 1;

  return (
    <Container size="wide">
      <h1 className="font-display text-3xl font-semibold tracking-tight">
        {t.title}
      </h1>
      <p className="text-muted-foreground mt-2 text-sm">{t.description}</p>

      <form
        onSubmit={onSubmit}
        className="card-soft mt-8 grid gap-4 rounded-2xl p-4 sm:grid-cols-[minmax(0,1fr)_12rem_auto] sm:items-end"
      >
        <Field label={t.search} htmlFor={`${id}-q`}>
          <Input
            id={`${id}-q`}
            name="q"
            type="search"
            placeholder={t.searchPlaceholder}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </Field>

        <Field label={t.status} htmlFor={`${id}-status`}>
          <Select
            id={`${id}-status`}
            name="status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="">{t.allStatuses}</option>
            {RESERVATION_STATUSES.map((value) => (
              <option key={value} value={value}>
                {dictionary.reservation.status[value]}
              </option>
            ))}
          </Select>
        </Field>

        <div className="flex gap-2">
          <Button type="submit">{t.submit}</Button>
          {filtered ? (
            <Button
              type="button"
              variant="secondary"
              onClick={() => go({ page: 1 })}
            >
              {t.clear}
            </Button>
          ) : null}
        </div>
      </form>

      <div className="mt-8">
        {loading ? (
          <p className="text-muted-foreground text-sm" role="status">
            {t.loading}
          </p>
        ) : failed ? (
          <div className="card-soft rounded-2xl p-6">
            <p className="text-sm">{t.error}</p>
            <Button
              variant="secondary"
              size="sm"
              className="mt-4"
              onClick={retry}
            >
              {t.retry}
            </Button>
          </div>
        ) : rows.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            {filtered ? t.empty : t.emptyAll}
          </p>
        ) : (
          <>
            <p className="text-subtle-foreground mb-3 text-xs">
              {formatNumber(result?.meta.total ?? rows.length, locale)}{" "}
              {t.resultCount}
            </p>
            <ReservationsTable
              reservations={rows}
              locale={locale}
              dictionary={dictionary}
            />
            {pageCount > 1 ? (
              <div className="mt-6 flex items-center justify-between gap-4">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => go({ ...filters, page: page - 1 })}
                >
                  {t.previous}
                </Button>
                <p className="text-muted-foreground text-sm" data-tabular>
                  {t.page} {page} / {pageCount}
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page >= pageCount}
                  onClick={() => go({ ...filters, page: page + 1 })}
                >
                  {t.next}
                </Button>
              </div>
            ) : null}
          </>
        )}
      </div>
    </Container>
  );
}
