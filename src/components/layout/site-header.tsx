"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Container } from "@/components/layout/container";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { ButtonLink } from "@/components/ui/button";
import type { Locale } from "@/config/i18n";
import { siteConfig } from "@/config/site";
import type { Dictionary } from "@/i18n/types";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

type SiteHeaderProps = {
  locale: Locale;
  dictionary: Dictionary;
};

/** Sections the header highlights while the landing page scrolls. */
const SECTION_IDS = ["tours", "how", "why", "contact"];

export function SiteHeader({ locale, dictionary }: SiteHeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const onLanding = pathname === `/${locale}` || pathname === "/";

  const links: {
    label: string;
    href: string;
    id: string;
    desktopClassName?: string;
  }[] = [
    { label: dictionary.nav.tours, href: routes.tours(locale), id: "tours" },
    { label: dictionary.nav.how, href: `/${locale}#how`, id: "how" },
    { label: dictionary.nav.why, href: routes.why(locale), id: "why" },
    {
      label: dictionary.nav.contact,
      href: routes.contact(locale),
      id: "contact",
    },
    // A page rather than a section, so it never takes the active-section underline.
    // Five links crowd the bar below 1024px, and it is in the footer and the mobile
    // menu as well, so the desktop bar only shows it when there is room.
    {
      label: dictionary.nav.lookup,
      href: routes.lookup(locale),
      id: "",
      desktopClassName: "hidden lg:inline-block",
    },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Off the landing page there are no sections to track; the rendered state is
    // already gated on `onLanding`, so nothing needs resetting here.
    if (!onLanding) return;

    const sections = SECTION_IDS.map((id) =>
      document.getElementById(id),
    ).filter((node): node is HTMLElement => node !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.2, 0.6] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [onLanding, pathname]);

  return (
    <header
      className={cn(
        "bg-background/95 fixed inset-x-0 top-0 z-[60] border-b backdrop-blur-xl transition-[border-color,box-shadow] duration-300 ease-[var(--ease-out-expo)]",
        scrolled
          ? "border-border shadow-[0_8px_24px_-18px_rgb(16_40_90/0.35)]"
          : "border-border/60",
      )}
    >
      <Container
        size="wide"
        className="flex h-16 items-center justify-between gap-4"
      >
        <Link
          href={routes.home(locale)}
          className="font-display text-primary text-xl font-bold tracking-tight"
        >
          {siteConfig.name}
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          {links.map((link) => {
            const active = onLanding && activeSection === link.id;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "true" : undefined}
                className={cn(
                  "group relative py-1 transition-colors duration-200",
                  link.desktopClassName,
                  active
                    ? "text-primary"
                    : "text-foreground/80 hover:text-primary",
                )}
              >
                {link.label}
                {/* Underline grows from the left on hover and stays for the active section. */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "bg-primary absolute inset-x-0 -bottom-0.5 h-px origin-left transition-transform duration-300 ease-[var(--ease-out-expo)]",
                    active
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100",
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2.5">
          <LocaleSwitcher
            locale={locale}
            dictionary={dictionary.localeSwitcher}
          />
          <ButtonLink
            href={routes.tours(locale)}
            size="sm"
            className="hidden sm:inline-flex"
          >
            {dictionary.nav.cta}
          </ButtonLink>
          <MobileMenu
            locale={locale}
            links={links}
            dictionary={dictionary.nav}
          />
        </div>
      </Container>
    </header>
  );
}
