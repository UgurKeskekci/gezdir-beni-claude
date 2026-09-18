import { Container } from "@/components/layout/container";
import { CountUp, Parallax } from "@/components/motion";
import { ButtonLink } from "@/components/ui/button";
import { ArrowRightIcon, ChevronDownIcon } from "@/components/ui/icons";
import { Photo } from "@/components/ui/photo";
import type { Locale } from "@/config/i18n";
import { HeroCards } from "@/features/landing/components/hero-cards";
import { HeroSearch } from "@/features/landing/components/hero-search";
import type { Testimonial } from "@/features/testimonials";
import type { Tour } from "@/features/tours";
import type { Dictionary } from "@/i18n/types";
import { routes } from "@/lib/routes";
import type { LocalizedImage } from "@/types";

type HeroProps = {
  locale: Locale;
  image: LocalizedImage;
  tour: Tour;
  testimonial: Testimonial;
  dictionary: Dictionary["hero"];
};

/** Entrance timing — every value is a CSS animation-delay in ms. */
const WORD_STEP = 55;
const AFTER_TITLE = 420;

export function Hero({
  locale,
  image,
  tour,
  testimonial,
  dictionary,
}: HeroProps) {
  const words = dictionary.title.split(" ");

  return (
    <section className="relative isolate -mt-16 flex min-h-[92svh] flex-col justify-center overflow-hidden pt-28 pb-16 sm:pt-32">
      {/* Photography: slow Ken Burns drift, plus parallax while the section scrolls by. */}
      <Parallax
        className="absolute inset-x-0 -top-[8%] -z-20 h-[116%]"
        distance={80}
      >
        <div className="animate-ken-burns relative h-full w-full will-change-transform">
          <Photo
            image={image}
            decorative
            fill
            preload
            fetchPriority="high"
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </Parallax>

      {/* Readability: darkest at the left edge and along the bottom. */}
      <div aria-hidden="true" className="hero-scrim absolute inset-0 -z-10" />

      <Container size="wide">
        <div className="flex flex-col gap-14 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <div className="max-w-2xl">
            <p className="animate-fade-rise glass-panel inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium text-white/85">
              <span className="bg-accent animate-pulse-dot size-1.5 rounded-full" />
              {dictionary.badge}
            </p>

            <h1 className="font-display mt-6 text-[2.6rem] leading-[1.06] font-semibold tracking-[-0.02em] text-white sm:text-6xl lg:text-[4.2rem]">
              {/* Each word rides up behind its own mask. CSS only, so it needs no JS. */}
              <span className="sr-only">
                {dictionary.title} {dictionary.titleAccent}
              </span>
              <span aria-hidden="true">
                {words.map((word, index) => (
                  <span
                    key={`${word}-${index}`}
                    className="mr-[0.26em] -mb-[0.08em] inline-block overflow-hidden pb-[0.08em] align-bottom"
                  >
                    <span
                      className="animate-reveal-up inline-block"
                      style={{ animationDelay: `${120 + index * WORD_STEP}ms` }}
                    >
                      {word}
                    </span>
                  </span>
                ))}
                <span className="reveal-line">
                  <span
                    className="animate-reveal-up text-gradient-brand inline-block"
                    style={{
                      animationDelay: `${120 + words.length * WORD_STEP}ms`,
                    }}
                  >
                    {dictionary.titleAccent}
                  </span>
                </span>
              </span>
            </h1>

            <p
              className="animate-fade-rise mt-7 max-w-xl text-lg leading-relaxed text-pretty text-white/75"
              style={{ animationDelay: `${AFTER_TITLE}ms` }}
            >
              {dictionary.description}
            </p>

            <div
              className="animate-fade-rise mt-9 flex flex-wrap gap-3"
              style={{ animationDelay: `${AFTER_TITLE + 90}ms` }}
            >
              <ButtonLink href={routes.toursAnchor(locale)} size="lg">
                {dictionary.primaryCta}
                <ArrowRightIcon className="size-4 transition-transform duration-300 group-hover/button:translate-x-1" />
              </ButtonLink>
              <ButtonLink href="#how" variant="glass" size="lg">
                {dictionary.secondaryCta}
              </ButtonLink>
            </div>

            <dl
              className="animate-fade-rise mt-14 flex flex-wrap gap-x-12 gap-y-6"
              style={{ animationDelay: `${AFTER_TITLE + 180}ms` }}
            >
              {dictionary.stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="font-display text-3xl font-semibold text-white sm:text-4xl">
                    <CountUp
                      value={stat.value}
                      decimals={stat.decimals}
                      suffix={stat.suffix}
                      locale={locale}
                    />
                  </dt>
                  <dd className="mt-1 text-sm text-white/60">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div
            className="animate-fade-rise hidden lg:block"
            style={{ animationDelay: `${AFTER_TITLE + 260}ms` }}
          >
            <HeroCards
              locale={locale}
              tour={tour}
              testimonial={testimonial}
              dictionary={dictionary}
            />
          </div>
        </div>

        <div
          className="animate-fade-rise mt-12"
          style={{ animationDelay: `${AFTER_TITLE + 340}ms` }}
        >
          <HeroSearch locale={locale} dictionary={dictionary.search} />
        </div>
      </Container>

      <a
        href={routes.toursAnchor(locale)}
        className="absolute inset-x-0 bottom-6 mx-auto hidden w-fit flex-col items-center gap-1 text-[0.7rem] tracking-wide text-white/50 transition-colors hover:text-white/80 sm:flex"
      >
        {dictionary.scrollHint}
        <ChevronDownIcon className="animate-scroll-hint size-4" />
      </a>
    </section>
  );
}
