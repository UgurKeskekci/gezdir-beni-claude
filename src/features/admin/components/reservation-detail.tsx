"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/config/i18n";
import { isSessionExpired } from "@/features/admin/lib/session";
import {
  getAdminReservation,
  setReservationStatus,
} from "@/features/admin/services/admin";
import { RESERVATION_STATUSES } from "@/features/admin/types";
import {
  ReservationSummary,
  type Reservation,
  type ReservationStatus,
} from "@/features/reservations";
import type { Dictionary } from "@/i18n/types";
import { ApiError } from "@/lib/api/client";
import { routes } from "@/lib/routes";

type ReservationDetailProps = {
  locale: Locale;
  dictionary: Dictionary;
  reference: string;
};

const ACTION_LABEL = {
  pending: "setPending",
  confirmed: "setConfirmed",
  cancelled: "setCancelled",
} as const;

export function AdminReservationDetail({
  locale,
  dictionary,
  reference,
}: ReservationDetailProps) {
  const router = useRouter();
  const t = dictionary.admin.detail;

  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "missing" | "error">(
    "loading",
  );
  const [pendingStatus, setPendingStatus] = useState<ReservationStatus | null>(
    null,
  );
  const [confirming, setConfirming] = useState(false);
  const [notice, setNotice] = useState<{
    tone: "ok" | "bad";
    text: string;
  } | null>(null);

  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    getAdminReservation(reference)
      .then((found) => {
        if (cancelled) return;
        if (!found) {
          setState("missing");
          return;
        }
        setReservation(found);
        setState("ready");
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        if (isSessionExpired(error)) {
          router.replace(routes.adminLogin(locale, true));
          return;
        }
        setState("error");
      });

    return () => {
      cancelled = true;
    };
  }, [attempt, locale, reference, router]);

  function retry() {
    setState("loading");
    setAttempt((current) => current + 1);
  }

  async function apply(status: ReservationStatus) {
    setConfirming(false);
    setPendingStatus(status);
    setNotice(null);
    try {
      setReservation(await setReservationStatus(reference, status));
      setNotice({ tone: "ok", text: t.updated });
    } catch (error) {
      if (isSessionExpired(error)) {
        router.replace(routes.adminLogin(locale, true));
        return;
      }
      // 409 is the API refusing on purpose: the departure filled up, or the booking
      // already had that status.
      const conflict = error instanceof ApiError && error.status === 409;
      setNotice({ tone: "bad", text: conflict ? t.conflict : t.updateError });
    } finally {
      setPendingStatus(null);
    }
  }

  if (state !== "ready" || !reservation) {
    return (
      <Container size="wide">
        <Link
          href={routes.adminReservations(locale)}
          className="text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          ← {t.back}
        </Link>
        <p className="mt-8 text-sm" role="status">
          {state === "loading"
            ? t.loading
            : state === "missing"
              ? t.notFound
              : t.error}
        </p>
        {state === "error" ? (
          <Button
            variant="secondary"
            size="sm"
            className="mt-4"
            onClick={retry}
          >
            {t.retry}
          </Button>
        ) : null}
      </Container>
    );
  }

  return (
    <Container size="wide">
      <Link
        href={routes.adminReservations(locale)}
        className="text-muted-foreground hover:text-foreground text-sm transition-colors"
      >
        ← {t.back}
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <ReservationSummary
          reservation={reservation}
          locale={locale}
          dictionary={dictionary.reservation}
        />

        <aside className="card-soft rounded-3xl p-6">
          <h2 className="font-display text-lg font-semibold tracking-tight">
            {t.actions}
          </h2>
          <p className="text-muted-foreground mt-2 text-xs">{t.actionsHint}</p>

          <p className="text-subtle-foreground mt-5 text-xs tracking-wide uppercase">
            {t.current}
          </p>
          <p className="mt-1 text-sm font-medium">
            {dictionary.reservation.status[reservation.status]}
          </p>

          {notice ? (
            <p
              role="status"
              className={`mt-5 rounded-xl border px-3.5 py-2.5 text-xs ${
                notice.tone === "ok"
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-accent/40 bg-accent/10 text-accent-deep"
              }`}
            >
              {notice.text}
            </p>
          ) : null}

          {confirming ? (
            <div className="border-accent/40 bg-accent/5 mt-5 rounded-xl border p-3.5">
              <p className="text-xs">{t.confirmCancel}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button size="sm" onClick={() => void apply("cancelled")}>
                  {t.confirmCancelYes}
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setConfirming(false)}
                >
                  {t.confirmCancelNo}
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-5 flex flex-col gap-2">
              {RESERVATION_STATUSES.map((status) => (
                <Button
                  key={status}
                  size="sm"
                  variant={status === "cancelled" ? "secondary" : "primary"}
                  disabled={
                    status === reservation.status || pendingStatus !== null
                  }
                  onClick={() =>
                    status === "cancelled"
                      ? setConfirming(true)
                      : void apply(status)
                  }
                >
                  {pendingStatus === status
                    ? t.updating
                    : t[ACTION_LABEL[status]]}
                </Button>
              ))}
            </div>
          )}

          <Link
            href={routes.tour(locale, reservation.tour.slug)}
            className="text-primary mt-6 inline-block text-sm hover:underline"
          >
            {t.viewTour}
          </Link>
        </aside>
      </div>
    </Container>
  );
}
