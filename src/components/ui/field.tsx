import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

export const inputClassName =
  "border-border bg-background text-foreground placeholder:text-subtle-foreground " +
  "focus-visible:border-primary focus-visible:outline-primary h-11 w-full rounded-xl border px-3.5 text-sm " +
  "transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 " +
  "aria-[invalid=true]:border-accent aria-[invalid=true]:bg-accent/5";

type FieldProps = {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  /** Word shown to screen readers next to the asterisk, e.g. "zorunlu". */
  required?: string;
  optional?: string;
  className?: string;
  children: ReactNode;
};

/**
 * Label, required marker, hint and error wired to one control.
 * The error replaces the hint so the two never compete, and it carries an id the
 * input points at with aria-describedby.
 */
export function Field({
  label,
  htmlFor,
  hint,
  error,
  required,
  optional,
  className,
  children,
}: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
        {required ? (
          <>
            <span aria-hidden="true" className="text-accent-deep ml-1">
              *
            </span>
            <span className="sr-only"> ({required})</span>
          </>
        ) : null}
        {optional ? (
          <span className="text-subtle-foreground ml-1.5 text-xs font-normal">
            ({optional})
          </span>
        ) : null}
      </label>
      {children}
      {error ? (
        <p
          id={`${htmlFor}-error`}
          role="alert"
          className="text-accent-deep text-xs"
        >
          {error}
        </p>
      ) : hint ? (
        <p id={`${htmlFor}-hint`} className="text-subtle-foreground text-xs">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(inputClassName, className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(inputClassName, "h-auto py-2.5", className)}
      {...props}
    />
  );
}

export function Select({ className, ...props }: ComponentProps<"select">) {
  return <select className={cn(inputClassName, className)} {...props} />;
}
