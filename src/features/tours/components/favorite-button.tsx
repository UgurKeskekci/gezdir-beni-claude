"use client";

import { useState } from "react";

import { HeartIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

type FavoriteButtonProps = {
  label: string;
  labelActive: string;
  className?: string;
};

/**
 * Demo only: the state lives in this component and is not stored anywhere.
 * It sits above the card's stretched link, so it needs its own stacking context.
 */
export function FavoriteButton({
  label,
  labelActive,
  className,
}: FavoriteButtonProps) {
  const [saved, setSaved] = useState(false);

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? labelActive : label}
      onClick={() => setSaved((current) => !current)}
      className={cn(
        "relative z-20 flex size-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur",
        "transition-[transform,background-color,color] duration-200 ease-[var(--ease-out-expo)]",
        "hover:scale-110 hover:bg-black/60 active:scale-95",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
        saved && "text-accent",
        className,
      )}
    >
      <HeartIcon
        filled={saved}
        className={cn(
          "size-4 transition-transform duration-300 ease-[var(--ease-out-expo)]",
          saved && "scale-110",
        )}
      />
    </button>
  );
}
