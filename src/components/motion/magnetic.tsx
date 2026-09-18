"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import type { ReactNode } from "react";

type MagneticProps = {
  children: ReactNode;
  className?: string;
  /** How far the content may drift towards the pointer, in px. */
  strength?: number;
};

/**
 * Nudges its child towards the pointer. Purely decorative: the wrapped element
 * keeps its own focus and click behaviour, and the markup never changes shape.
 */
export function Magnetic({ children, className, strength = 6 }: MagneticProps) {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  return (
    <motion.span
      className={className}
      style={{ x: springX, y: springY, display: "inline-flex" }}
      onPointerMove={(event) => {
        if (reduceMotion || event.pointerType !== "mouse") return;
        const rect = event.currentTarget.getBoundingClientRect();
        const offsetX = event.clientX - (rect.left + rect.width / 2);
        const offsetY = event.clientY - (rect.top + rect.height / 2);
        x.set((offsetX / rect.width) * strength * 2);
        y.set((offsetY / rect.height) * strength * 2);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}
