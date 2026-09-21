import { notFound } from "next/navigation";

import { isLocale } from "@/config/i18n";
import { ReservationsBrowser, type ReservationFilters } from "@/features/admin";
import { RESERVATION_STATUSES } from "@/features/admin/types";
import type { ReservationStatus } from "@/features/reservations";
import { getDictionary } from "@/i18n/get-dictionary";

type AdminReservationsPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ status?: string; q?: string; page?: string }>;
};

function toStatus(value?: string): ReservationStatus | undefined {
  return RESERVATION_STATUSES.find((status) => status === value);
}

/** Anything unparseable falls back to page 1 rather than erroring the screen. */
function toPage(value?: string): number {
  const page = Number.parseInt(value ?? "", 10);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

export default async function AdminReservationsPage({
  params,
  searchParams,
}: AdminReservationsPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const { status, q, page } = await searchParams;
  const dictionary = await getDictionary(locale);

  const filters: ReservationFilters = {
    status: toStatus(status),
    q: q?.trim() || undefined,
    page: toPage(page),
  };

  return (
    // Keyed on the query so a back-navigation remounts the browser: the search box
    // and the status select then start from the URL again instead of keeping what
    // the previous view had typed in them.
    <ReservationsBrowser
      key={`${filters.status ?? ""}|${filters.q ?? ""}|${filters.page}`}
      locale={locale}
      dictionary={dictionary}
      filters={filters}
    />
  );
}
