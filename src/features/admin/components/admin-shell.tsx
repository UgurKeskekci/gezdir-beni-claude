"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

import { Container } from "@/components/layout/container";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/config/i18n";
import { adminLogout, hasAdminSession } from "@/features/admin/services/admin";
import type { Dictionary } from "@/i18n/types";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

type AdminShellProps = {
  locale: Locale;
  dictionary: Dictionary;
  children: ReactNode;
};

type Phase = "checking" | "ready" | "unreachable";

/**
 * The panel's chrome and its guard in one place.
 *
 * The session lives in an httpOnly cookie the API sets, which JavaScript cannot read,
 * so the only honest way to know whether we are signed in is to ask: `GET /admin/me`.
 * Nothing renders until it answers, so a stranger never sees the panel flash by.
 */
export function AdminShell({ locale, dictionary, children }: AdminShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("checking");
  const [signingOut, setSigningOut] = useState(false);
  // Bumped by the retry button to run the check again; the effect only ever sets
  // state from inside the promise, never synchronously.
  const [attempt, setAttempt] = useState(0);
  const t = dictionary.admin;

  useEffect(() => {
    let cancelled = false;

    hasAdminSession()
      .then((valid) => {
        if (cancelled) return;
        if (valid) setPhase("ready");
        else router.replace(routes.adminLogin(locale));
      })
      .catch(() => {
        // The API is down rather than the session being bad; bouncing to the login
        // screen would just hide that.
        if (!cancelled) setPhase("unreachable");
      });

    return () => {
      cancelled = true;
    };
  }, [attempt, locale, router]);

  async function signOut() {
    setSigningOut(true);
    try {
      await adminLogout();
    } catch {
      // The cookie may already be gone; either way the panel is closed.
    }
    router.replace(routes.adminLogin(locale));
  }

  if (phase !== "ready") {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-muted-foreground text-sm" role="status">
          {phase === "checking" ? t.checking : t.login.offline}
        </p>
        {phase === "unreachable" ? (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setPhase("checking");
              setAttempt((current) => current + 1);
            }}
          >
            {t.dashboard.retry}
          </Button>
        ) : null}
      </main>
    );
  }

  const links = [
    { href: routes.admin(locale), label: t.nav.dashboard, exact: true },
    {
      href: routes.adminReservations(locale),
      label: t.nav.reservations,
      exact: false,
    },
  ];

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-border bg-surface/80 sticky top-0 z-50 border-b backdrop-blur-xl">
        <Container
          size="wide"
          className="flex h-16 flex-wrap items-center justify-between gap-x-6 gap-y-2"
        >
          <div className="flex items-center gap-6">
            <Link
              href={routes.admin(locale)}
              className="font-display text-base font-semibold tracking-tight"
            >
              {t.brand}
            </Link>
            <nav className="flex items-center gap-5 text-sm">
              {links.map((link) => {
                const active = link.exact
                  ? pathname === link.href
                  : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "py-1 transition-colors duration-200",
                      active
                        ? "text-foreground border-primary border-b-2"
                        : "text-muted-foreground hover:text-foreground border-b-2 border-transparent",
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2.5">
            <LocaleSwitcher
              locale={locale}
              dictionary={dictionary.localeSwitcher}
            />
            <Link
              href={routes.home(locale)}
              className="text-muted-foreground hover:text-foreground hidden text-sm transition-colors sm:inline"
            >
              {t.backToSite}
            </Link>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => void signOut()}
              disabled={signingOut}
            >
              {signingOut ? t.loggingOut : t.logout}
            </Button>
          </div>
        </Container>
      </header>

      <main className="flex-1 py-10 sm:py-14">{children}</main>
    </div>
  );
}
