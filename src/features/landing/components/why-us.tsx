import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion";
import {
  CompassIcon,
  LifeBuoyIcon,
  ShieldIcon,
  SunIcon,
  UsersIcon,
  WalletIcon,
} from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Dictionary } from "@/i18n/types";

const ITEM_ICONS = [
  UsersIcon,
  CompassIcon,
  WalletIcon,
  ShieldIcon,
  SunIcon,
  LifeBuoyIcon,
];

export function WhyUs({ dictionary }: { dictionary: Dictionary["why"] }) {
  return (
    <section
      id="why"
      className="border-border bg-surface-muted/40 scroll-mt-24 border-y py-24 sm:py-32"
    >
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow={dictionary.eyebrow}
            title={dictionary.title}
            accent={dictionary.titleAccent}
            description={dictionary.description}
          />
        </Reveal>

        <ul className="border-border bg-border mt-16 grid gap-px overflow-hidden rounded-3xl border sm:grid-cols-2 lg:grid-cols-3">
          {dictionary.items.map((item, index) => {
            const Icon = ITEM_ICONS[index] ?? UsersIcon;
            return (
              <Reveal
                as="li"
                key={item.title}
                delay={index * 70}
                distance={16}
                className="group bg-background hover:bg-surface relative p-8 transition-colors duration-300"
              >
                <span
                  aria-hidden="true"
                  className="rule-fade absolute inset-x-0 top-0 h-px scale-x-0 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-x-100"
                />
                <span className="bg-primary/12 text-primary flex size-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:rotate-3">
                  <Icon className="size-5" />
                </span>
                <h3 className="font-display mt-5 text-base font-semibold">
                  {item.title}
                </h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {item.description}
                </p>
              </Reveal>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
