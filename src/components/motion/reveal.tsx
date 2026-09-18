"use client";

import { useInView, useReducedMotion } from "motion/react";
import {
  useEffect,
  useRef,
  type ComponentProps,
  type CSSProperties,
  type ElementType,
} from "react";

type RevealProps<T extends ElementType> = {
  as?: T;
  /** Delay in ms — use the list index to stagger a group. */
  delay?: number;
  /** Distance travelled, in px. */
  distance?: number;
} & Omit<ComponentProps<T>, "as">;

/**
 * Fades and lifts its children the first time they enter the viewport, once.
 * Transform and opacity only, so it never moves layout.
 *
 * The hidden state is applied imperatively after mount, which keeps the server
 * HTML visible for readers without JS and avoids a hydration mismatch. Content
 * that is already on screen at mount is never hidden, so nothing flashes.
 */
export function Reveal<T extends ElementType = "div">({
  as,
  delay = 0,
  distance = 20,
  style,
  children,
  ...props
}: RevealProps<T>) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px -8% 0px" });
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || reduceMotion || node.dataset.reveal) return;

    const rect = node.getBoundingClientRect();
    const alreadyOnScreen = rect.top < window.innerHeight * 0.92;
    node.dataset.reveal = alreadyOnScreen ? "shown" : "hidden";
  }, [reduceMotion]);

  useEffect(() => {
    const node = ref.current;
    if (!node || reduceMotion || !inView) return;
    node.dataset.reveal = "shown";
  }, [inView, reduceMotion]);

  return (
    <Tag
      ref={ref}
      style={
        {
          "--reveal-delay": `${delay}ms`,
          "--reveal-y": `${distance}px`,
          ...style,
        } as CSSProperties
      }
      {...props}
    >
      {children}
    </Tag>
  );
}
