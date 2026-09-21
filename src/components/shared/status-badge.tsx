import type { PaymentStatus, ReservationStatus } from "@/features/reservations";
import { cn } from "@/lib/utils";

type Tone = "positive" | "warning" | "neutral";

const TONES: Record<Tone, string> = {
  positive: "bg-primary/10 text-primary",
  warning: "bg-accent/15 text-accent-deep",
  neutral: "bg-surface-muted text-muted-foreground",
};

/** Used by the guest summary and by the panel, so the two never drift apart. */
export const STATUS_TONES: Record<ReservationStatus, Tone> = {
  pending: "warning",
  confirmed: "positive",
  cancelled: "neutral",
};

export const PAYMENT_TONES: Record<PaymentStatus, Tone> = {
  paid: "positive",
  unpaid: "neutral",
  failed: "warning",
};

export function StatusBadge({
  tone,
  children,
  className,
}: {
  tone: Tone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
