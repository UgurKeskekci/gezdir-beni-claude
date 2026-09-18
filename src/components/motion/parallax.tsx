"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef, type ReactNode } from "react";

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  /** Travel across the whole scroll range, in px. Positive moves down. */
  distance?: number;
};

/**
 * Moves its children slightly slower than the page while the section scrolls by.
 * The element tree never changes with the motion preference — only the travel
 * distance does — so the server and client markup always match.
 */
export function Parallax({
  children,
  className,
  distance = 90,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [0, reduceMotion ? 0 : distance],
  );

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }} className="relative h-full w-full">
        {children}
      </motion.div>
    </div>
  );
}
