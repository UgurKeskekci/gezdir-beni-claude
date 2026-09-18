import { QuoteIcon, StarIcon } from "@/components/ui/icons";
import type { Testimonial } from "@/features/testimonials/types";
import { cn } from "@/lib/utils";

export function TestimonialCard({
  testimonial,
  className,
}: {
  testimonial: Testimonial;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        "border-border bg-surface flex h-full w-80 shrink-0 flex-col gap-4 rounded-2xl border p-6 sm:w-96",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <QuoteIcon className="text-primary/70 size-6" />
        <div className="flex gap-0.5" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, index) => (
            <StarIcon
              key={index}
              className={cn(
                "size-3.5",
                index < testimonial.rating
                  ? "text-accent"
                  : "text-border-strong",
              )}
            />
          ))}
        </div>
      </div>

      <blockquote className="text-sm leading-relaxed text-pretty">
        {testimonial.quote}
      </blockquote>

      <figcaption className="mt-auto flex items-center gap-3">
        <span
          aria-hidden="true"
          className="bg-primary/15 text-primary flex size-9 items-center justify-center rounded-full text-xs font-semibold"
        >
          {testimonial.initials}
        </span>
        <span className="text-sm">
          <span className="block font-medium">{testimonial.author}</span>
          <span className="text-muted-foreground block text-xs">
            {testimonial.context}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}
