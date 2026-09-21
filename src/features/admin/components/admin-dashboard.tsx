"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

import { Container } from "@/components/layout/container";
import { CountUp } from "@/components/motion/count-up";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/config/i18n";
import { siteConfig } from "@/config/site";
import { ReservationsTable } from "@/features/admin/components/reservations-table";
import { isSessionExpired } from "@/features/admin/lib/session";
import {
  getAdminStats,
  listAdminReservations,
} from "@/features/admin/services/admin";
import type { AdminStats } from "@/features/admin/types";
import type { Reservation } from "@/features/reservations";
import type { Dictionary } from "@/i18n/types";
import { formatPrice } from "@/lib/format";
import { routes } from "@/lib/routes";

type AdminDashboardProps = {
  locale: Locale;
  dictionary: Dictionary;
};

const LATEST_COUNT = 5;

function StatCard({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="card-soft rounded-2xl p-5">
      <p className="text-muted-foreground text-sm">{label}</p>
      <p
        className="font-display mt-2 text-3xl font-semibold tracking-tight"
        data-tabular
      >
        {children}
      </p>
      {hint ? (
        <p className="text-subtle-foreground mt-1.5 text-xs">{hint}</p>
      ) : null}
    </div>
  );
}

export function AdminDashboard({ locale, dictionary }: AdminDashboardProps) {
  const router = useRouter();
  const t = dictionary.admin.dashboard;

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [latest, setLatest] = useState<Reservation[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  // Derived rather than stored, so nothing has to be set synchronously in the effect.
  const loading = latest === null && !failed;

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      getAdminStats(),
      listAdminReservations({ page: 1, perPage: LATEST_COUNT }),
    ])
      .then(([nextStats, page]) => {
        if (cancelled) return;
        setStats(nextStats);
        setLatest(page.data);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        // A 401 here means the cookie ran out while the tab sat open.
        if (isSessionExpired(error)) {
          router.replace(routes.adminLogin(locale, true));
          return;
        }
        setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [attempt, locale, router]);

  function retry() {
    setFailed(false);
    setLatest(null);
    setAttempt((current) => current + 1);
  }

  return (
    <Container size="wide">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            {t.title}
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">{t.description}</p>
        </div>
        <Link
          href={routes.adminReservations(locale)}
          className="text-primary text-sm font-medium hover:underline"
        >
          {t.seeAll}
        </Link>
      </div>

      {failed ? (
        <div className="card-soft mt-8 rounded-2xl p-6">
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
      ) : null}

      {stats ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard label={t.total}>
            <CountUp value={stats.reservations.total} locale={locale} />
          </StatCard>
          <StatCard label={t.pending}>
            <CountUp value={stats.reservations.pending} locale={locale} />
          </StatCard>
          <StatCard label={t.confirmed}>
            <CountUp value={stats.reservations.confirmed} locale={locale} />
          </StatCard>
          <StatCard label={t.cancelled}>
            <CountUp value={stats.reservations.cancelled} locale={locale} />
          </StatCard>
          <StatCard label={t.revenue} hint={t.revenueHint}>
            {formatPrice(stats.paidRevenueMinor, siteConfig.currency, locale)}
          </StatCard>
          <StatCard label={t.upcoming} hint={t.upcomingHint}>
            <CountUp value={stats.upcomingDepartures} locale={locale} />
          </StatCard>
        </div>
      ) : null}

      <section className="mt-12">
        <h2 className="font-display text-xl font-semibold tracking-tight">
          {t.latest}
        </h2>
        <div className="mt-4">
          {loading ? (
            <p className="text-muted-foreground text-sm" role="status">
              {dictionary.admin.list.loading}
            </p>
          ) : !latest || latest.length === 0 ? (
            <p className="text-muted-foreground text-sm">{t.empty}</p>
          ) : (
            <ReservationsTable
              reservations={latest}
              locale={locale}
              dictionary={dictionary}
            />
          )}
        </div>
      </section>
    </Container>
  );
}
