"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { ButtonLink } from "@/components/ui/button";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";
import type { Locale } from "@/config/i18n";
import { siteConfig } from "@/config/site";
import type { Dictionary } from "@/i18n/types";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

type NavLink = { label: string; href: string };

type MobileMenuProps = {
  locale: Locale;
  links: NavLink[];
  dictionary: Dictionary["nav"];
  /** True while the header is transparent over a photo, which needs light colours. */
  onPhoto?: boolean;
};

const EASE = [0.22, 1, 0.36, 1] as const;

export function MobileMenu({
  locale,
  links,
  dictionary,
  onPhoto = false,
}: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  // A full-screen panel must not leave the page scrolling behind it.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label={dictionary.menu}
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className={cn(
          "focus-visible:outline-primary flex size-9 items-center justify-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 md:hidden",
          onPhoto
            ? "border-white/30 text-white hover:bg-white/10"
            : "border-border text-foreground hover:bg-surface-muted",
        )}
      >
        <MenuIcon className="size-4.5" />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            key="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label={dictionary.menu}
            className="bg-background/98 fixed inset-0 z-[70] backdrop-blur-xl md:hidden"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: EASE }}
          >
            <div className="flex h-16 items-center justify-between px-5">
              <Link
                href={routes.home(locale)}
                onClick={() => setOpen(false)}
                className="font-display text-lg font-semibold tracking-tight"
              >
                {siteConfig.name}
              </Link>
              <button
                type="button"
                aria-label={dictionary.close}
                onClick={() => setOpen(false)}
                className="border-border hover:bg-surface-muted focus-visible:outline-primary flex size-9 items-center justify-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                autoFocus
              >
                <CloseIcon className="size-4.5" />
              </button>
            </div>

            <nav className="mt-6 px-5">
              <ul className="flex flex-col">
                {links.map((link, index) => (
                  <motion.li
                    key={link.href}
                    initial={
                      reduceMotion ? { opacity: 0 } : { opacity: 0, y: 14 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.35,
                      ease: EASE,
                      delay: reduceMotion ? 0 : 0.06 + index * 0.05,
                    }}
                    className="border-border/70 border-b"
                  >
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="font-display hover:text-primary block py-5 text-2xl font-medium transition-colors"
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <ButtonLink
                href={routes.tours(locale)}
                size="lg"
                onClick={() => setOpen(false)}
                className="mt-8 w-full"
              >
                {dictionary.cta}
              </ButtonLink>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
