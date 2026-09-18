import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion";
import { ButtonLink } from "@/components/ui/button";
import { ArrowRightIcon } from "@/components/ui/icons";
import { Photo } from "@/components/ui/photo";
import type { Locale } from "@/config/i18n";
import { siteConfig } from "@/config/site";
import type { Dictionary } from "@/i18n/types";
import { routes } from "@/lib/routes";
import type { LocalizedImage } from "@/types";

type ClosingCtaProps = {
  locale: Locale;
  image: LocalizedImage;
  dictionary: Dictionary["closing"];
};

export function ClosingCta({ locale, image, dictionary }: ClosingCtaProps) {
  return (
    <section className="pb-24 sm:pb-32">
      <Container>
        <Reveal className="relative isolate overflow-hidden rounded-[2rem]">
          <Photo
            image={image}
            decorative
            fill
            sizes="(min-width: 1280px) 1200px, 100vw"
            className="-z-20 object-cover"
          />
          <div
            aria-hidden="true"
            className="cta-scrim absolute inset-0 -z-10"
          />

          <div className="px-7 py-16 sm:px-14 sm:py-20 lg:px-20">
            <p className="text-primary text-sm font-medium tracking-wide">
              {dictionary.eyebrow}
            </p>
            <h2 className="font-display mt-3 max-w-2xl text-3xl leading-[1.12] font-semibold tracking-tight text-balance text-white sm:text-5xl">
              {dictionary.title}{" "}
              <span className="font-accent text-primary text-[1.08em] font-normal italic">
                {dictionary.titleAccent}
              </span>
            </h2>
            <p className="mt-5 max-w-xl leading-relaxed text-pretty text-white/70">
              {dictionary.description}
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href={routes.tours(locale)} size="lg">
                {dictionary.primaryCta}
                <ArrowRightIcon className="size-4 transition-transform duration-300 group-hover/button:translate-x-1" />
              </ButtonLink>
              <ButtonLink
                href={`mailto:${siteConfig.contact.email}`}
                variant="glass"
                size="lg"
              >
                {dictionary.secondaryCta}
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
