import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { isLocale } from "@/config/i18n";
import { AdminShell } from "@/features/admin";
import { getDictionary } from "@/i18n/get-dictionary";

type AdminLayoutProps = {
  params: Promise<{ locale: string }>;
  children: ReactNode;
};

export const metadata: Metadata = { robots: { index: false, follow: false } };

/**
 * Wraps every panel screen except the login page, which sits outside this route
 * group on purpose so it is not guarded by the shell.
 */
export default async function AdminLayout({
  params,
  children,
}: AdminLayoutProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dictionary = await getDictionary(locale);

  return (
    <AdminShell locale={locale} dictionary={dictionary}>
      {children}
    </AdminShell>
  );
}
