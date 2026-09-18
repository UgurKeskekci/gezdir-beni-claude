import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button";
import { defaultLocale } from "@/config/i18n";
import { getDictionary } from "@/i18n/get-dictionary";

/**
 * Rendered for unknown paths. Next.js does not pass params to not-found,
 * so this page always speaks the default language.
 */
export default async function NotFound() {
  const dictionary = await getDictionary(defaultLocale);

  return (
    <Container className="flex min-h-dvh flex-col items-start justify-center gap-4">
      <p className="text-primary text-sm font-medium">404</p>
      <h1 className="font-display text-3xl font-semibold sm:text-4xl">
        {dictionary.notFound.title}
      </h1>
      <p className="text-muted-foreground max-w-md">
        {dictionary.notFound.description}
      </p>
      <ButtonLink href={`/${defaultLocale}`} className="mt-2">
        {dictionary.notFound.cta}
      </ButtonLink>
    </Container>
  );
}
