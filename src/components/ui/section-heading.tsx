import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  /** One short emphasis phrase, set in the italic serif accent. Max one per heading. */
  accent?: string;
  description?: string;
  as?: "h1" | "h2";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  accent,
  description,
  as: Tag = "h2",
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-2xl", className)}>
      <p className="text-primary flex items-center gap-3 text-sm font-medium tracking-wide">
        <span aria-hidden="true" className="rule-fade h-px w-8" />
        {eyebrow}
      </p>

      <Tag className="font-display mt-4 text-3xl leading-[1.12] font-semibold tracking-tight text-balance sm:text-[2.6rem]">
        {title}
        {accent ? (
          <>
            {" "}
            <span className="font-accent text-primary text-[1.08em] font-normal italic">
              {accent}
            </span>
          </>
        ) : null}
      </Tag>

      {description ? (
        <p className="text-muted-foreground mt-4 leading-relaxed text-pretty">
          {description}
        </p>
      ) : null}
    </div>
  );
}
