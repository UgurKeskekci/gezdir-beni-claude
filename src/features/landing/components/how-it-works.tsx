import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion";
import { CalendarIcon, MapIcon, SuitcaseIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Dictionary } from "@/i18n/types";

const STEP_ICONS = [MapIcon, CalendarIcon, SuitcaseIcon];

export function HowItWorks({ dictionary }: { dictionary: Dictionary["how"] }) {
  return (
    <section id="how" className="scroll-mt-24 py-24 sm:py-32">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow={dictionary.eyebrow}
            title={dictionary.title}
            accent={dictionary.titleAccent}
            description={dictionary.description}
          />
        </Reveal>

        <ol className="mt-16 grid gap-6 md:grid-cols-3">
          {dictionary.steps.map((step, index) => {
            const Icon = STEP_ICONS[index] ?? MapIcon;
            return (
              <Reveal
                as="li"
                key={step.title}
                delay={index * 90}
                className="border-border bg-surface/60 hover:border-primary/40 hover:bg-surface group relative overflow-hidden rounded-3xl border p-7 transition-colors duration-300"
              >
                <span
                  aria-hidden="true"
                  className="font-display text-border-strong/60 group-hover:text-primary/35 absolute top-4 right-6 text-5xl font-semibold transition-colors duration-300"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="bg-primary/12 text-primary flex size-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:-translate-y-0.5">
                  <Icon className="size-5" />
                </span>

                <h3 className="font-display mt-5 text-lg font-semibold">
                  {step.title}
                </h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {step.description}
                </p>
              </Reveal>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
