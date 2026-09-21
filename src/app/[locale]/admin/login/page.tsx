import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { isLocale } from "@/config/i18n";
import { AdminLogin } from "@/features/admin";
import { getDictionary } from "@/i18n/get-dictionary";

type AdminLoginPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ expired?: string }>;
};

// The panel is private, so it stays out of search results even if robots.txt is ignored.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function AdminLoginPage({
  params,
  searchParams,
}: AdminLoginPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const { expired } = await searchParams;
  const dictionary = await getDictionary(locale);

  return (
    <main className="flex min-h-dvh items-center justify-center px-5 py-16">
      <AdminLogin
        locale={locale}
        dictionary={dictionary}
        expired={expired === "1"}
      />
    </main>
  );
}
