type Credit = { author: string; license: string; source: string };

/** Wikimedia Commons photos are CC licensed and must keep their attribution. */
export function PhotoCredit({
  credit,
  label,
  className,
}: {
  credit: Credit | undefined;
  label: string;
  className?: string;
}) {
  if (!credit) return null;

  return (
    <p className={className}>
      {label}:{" "}
      <a
        href={credit.source}
        target="_blank"
        rel="noreferrer noopener"
        className="underline underline-offset-2"
      >
        {credit.author}
      </a>{" "}
      · {credit.license}
    </p>
  );
}
