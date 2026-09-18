"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef } from "react";

import type { Locale } from "@/config/i18n";
import { formatNumber } from "@/lib/format";

type CountUpProps = {
  value: number;
  locale: Locale;
  decimals?: number;
  suffix?: string;
  durationSeconds?: number;
  className?: string;
};

/**
 * Counts from zero to `value` the first time it is seen.
 * The final value is rendered on the server and only overwritten once the
 * animation starts, so it reads correctly without JS and for screen readers.
 */
export function CountUp({
  value,
  locale,
  decimals = 0,
  suffix = "",
  durationSeconds = 1.6,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduceMotion = useReducedMotion();

  const format = useMemo(
    () => (input: number) => formatNumber(input, locale, decimals),
    [locale, decimals],
  );

  useEffect(() => {
    const node = numberRef.current;
    if (!node || !inView || reduceMotion) return;

    const controls = animate(0, value, {
      duration: durationSeconds,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (current) => {
        node.textContent = format(current);
      },
      onComplete: () => {
        node.textContent = format(value);
      },
    });

    return () => controls.stop();
  }, [inView, reduceMotion, value, durationSeconds, format]);

  return (
    <span ref={ref} className={className} data-tabular>
      <span ref={numberRef}>{format(value)}</span>
      {suffix}
    </span>
  );
}
