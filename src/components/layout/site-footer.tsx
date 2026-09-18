import Link from "next/link";

import { Container } from "@/components/layout/container";
import { ArrowRightIcon } from "@/components/ui/icons";
import type { Locale } from "@/config/i18n";
import { siteConfig } from "@/config/site";
import type { Dictionary } from "@/i18n/types";
import { routes } from "@/lib/routes";

type SiteFooterProps = {
  locale: Locale;
  dictionary: Dictionary;
};

export function SiteFooter({ locale, dictionary }: SiteFooterProps) {
  const exploreLinks = [
    { label: dictionary.nav.tours, href: routes.tours(locale) },
    { label: dictionary.nav.how, href: `/${locale}#how` },
    { label: dictionary.nav.why, href: routes.why(locale) },
  ];
  const companyLinks = [
    { label: dictionary.footer.about, href: routes.why(locale) },
    { label: dictionary.footer.careers, href: routes.why(locale) },
  ];

  return (
    <footer
      id="contact"
      className="border-border bg-background-deep scroll-mt-24 border-t"
    >
      <Container className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className="font-display text-xl font-semibold tracking-tight">
            {siteConfig.name}
          </p>
          <p className="text-muted-foreground mt-4 max-w-xs text-sm leading-relaxed">
            {dictionary.footer.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {siteConfig.social.map((item) => (
              <a
                key={item.label}
                href={item.href}
                rel="noreferrer noopener"
                target="_blank"
                className="border-border text-muted-foreground hover:border-primary/50 hover:text-foreground focus-visible:outline-primary rounded-full border px-3.5 py-1.5 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold">{dictionary.footer.explore}</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {exploreLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold">{dictionary.footer.company}</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {companyLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold">{dictionary.footer.reach}</h2>
          <ul className="mt-5 space-y-3 text-sm">
            <li>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="text-muted-foreground hover:text-primary group inline-flex items-center gap-1.5 transition-colors"
              >
                {siteConfig.contact.email}
                <ArrowRightIcon className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </a>
            </li>
            <li className="text-muted-foreground" data-tabular>
              {siteConfig.contact.phone}
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-border/70 border-t">
        <Container className="text-subtle-foreground flex flex-col gap-2 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}.{" "}
            {dictionary.footer.rights}
          </p>
          <p>{dictionary.footer.demoNotice}</p>
        </Container>
      </div>
    </footer>
  );
}
