import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { TestimonialCard } from "@/features/testimonials/components/testimonial-card";
import type { Testimonial } from "@/features/testimonials/types";
import type { Dictionary } from "@/i18n/types";

type TestimonialsSectionProps = {
  testimonials: Testimonial[];
  dictionary: Dictionary["testimonials"];
};

export function TestimonialsSection({
  testimonials,
  dictionary,
}: TestimonialsSectionProps) {
  // The track is rendered twice so the loop never shows a gap; the copy is hidden
  // from assistive tech. With reduced motion the strip becomes scrollable instead.
  const track = [...testimonials, ...testimonials];

  return (
    <section id="reviews" className="scroll-mt-24 py-24 sm:py-32">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow={dictionary.eyebrow}
            title={dictionary.title}
            description={dictionary.description}
          />
        </Reveal>
      </Container>

      <Reveal
        delay={80}
        className="group relative mt-14 overflow-hidden [@media(prefers-reduced-motion:reduce)]:overflow-x-auto"
      >
        <div
          aria-hidden="true"
          className="fade-edge-left pointer-events-none absolute inset-y-0 left-0 z-10 w-16 sm:w-28"
        />
        <div
          aria-hidden="true"
          className="fade-edge-right pointer-events-none absolute inset-y-0 right-0 z-10 w-16 sm:w-28"
        />
        <ul className="animate-marquee-x flex w-max gap-5 px-5 py-4 group-hover:[animation-play-state:paused] sm:px-8">
          {track.map((testimonial, index) => (
            <li
              key={`${testimonial.id}-${index}`}
              aria-hidden={index >= testimonials.length}
            >
              <TestimonialCard testimonial={testimonial} />
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
