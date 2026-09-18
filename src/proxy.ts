import { NextResponse, type NextRequest } from "next/server";

import { defaultLocale, locales } from "@/config/i18n";

/** Sends locale-less paths to the default language: "/" -> "/tr", "/foo" -> "/tr/foo". */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals, metadata routes and anything with a file extension.
  matcher: ["/((?!_next|api|.*\\.).*)"],
};
