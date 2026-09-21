import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { defaultLocale, isLocale } from "@/config/i18n";
import { getDictionary } from "@/i18n/get-dictionary";

export default async function SiteLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;
  const dictionary = await getDictionary(locale);

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader locale={locale} dictionary={dictionary} />
      {/* The header is fixed and solid, so every page starts below it. */}
      <main className="flex-1 pt-16">{children}</main>
      <SiteFooter locale={locale} dictionary={dictionary} />
    </div>
  );
}
