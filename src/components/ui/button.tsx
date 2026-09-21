import Link from "next/link";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "glass";
type Size = "sm" | "md" | "lg";

/**
 * Shared micro-interaction: hover lifts the surface a touch, pressing scales to
 * 0.97, and any arrow inside slides via `group-hover/button`.
 */
const base =
  "group/button inline-flex items-center justify-center gap-2 rounded-xl font-semibold " +
  "transition-[background-color,border-color,color,box-shadow,transform,filter] duration-200 ease-[var(--ease-out-expo)] " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary " +
  "active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-[0_8px_24px_-12px_var(--primary)] hover:bg-primary-hover hover:shadow-[0_12px_32px_-10px_var(--primary)]",
  secondary:
    "border border-border bg-surface text-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary",
  ghost: "text-foreground hover:bg-primary/5 hover:text-primary",
  glass:
    "border border-white/40 bg-white/15 text-white backdrop-blur-md hover:border-white/60 hover:bg-white/25",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-12 px-7 text-[0.95rem]",
};

export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
} = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; size?: Size }) {
  return (
    <Link className={buttonStyles({ variant, size, className })} {...props} />
  );
}

export function Button({
  variant,
  size,
  className,
  type = "button",
  ...props
}: ComponentProps<"button"> & { variant?: Variant; size?: Size }) {
  return (
    <button
      type={type}
      className={buttonStyles({ variant, size, className })}
      {...props}
    />
  );
}
