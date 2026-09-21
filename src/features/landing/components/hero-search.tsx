import {
  CalendarIcon,
  PinIcon,
  SearchIcon,
  UsersIcon,
} from "@/components/ui/icons";
import type { Locale } from "@/config/i18n";
import type { Dictionary } from "@/i18n/types";
import { routes } from "@/lib/routes";

type HeroSearchProps = {
  locale: Locale;
  dictionary: Dictionary["hero"]["search"];
};

const fieldClass =
  "w-full bg-transparent text-sm font-medium text-foreground outline-none placeholder:font-normal placeholder:text-subtle-foreground";

/**
 * Interface only — there is no search backend yet, so the button is a link to the
 * tours section. Deliberately not a <form>, so Enter cannot submit anything.
 */
export function HeroSearch({ locale, dictionary }: HeroSearchProps) {
  return (
    <div className="max-w-3xl">
      <div
        role="search"
        aria-label={dictionary.label}
        className="glass-panel grid gap-2 overflow-hidden rounded-3xl p-2.5 shadow-[0_24px_60px_-24px_rgb(8_22_48/0.55)] sm:grid-cols-[1.3fr_1fr_0.9fr_auto] sm:items-stretch"
      >
        <label className="bg-surface hover:border-primary/40 flex items-center gap-2.5 rounded-2xl border border-transparent px-3.5 py-2.5 transition-colors">
          <PinIcon className="text-primary size-4 shrink-0" />
          <span className="min-w-0 flex-1">
            <span className="text-muted-foreground block text-[0.7rem] font-medium tracking-wide">
              {dictionary.destination}
            </span>
            <input
              type="text"
              name="destination"
              autoComplete="off"
              placeholder={dictionary.destinationPlaceholder}
              className={fieldClass}
            />
          </span>
        </label>

        <label className="bg-surface hover:border-primary/40 flex items-center gap-2.5 rounded-2xl border border-transparent px-3.5 py-2.5 transition-colors">
          <CalendarIcon className="text-primary size-4 shrink-0" />
          <span className="min-w-0 flex-1">
            <span className="text-muted-foreground block text-[0.7rem] font-medium tracking-wide">
              {dictionary.date}
            </span>
            <input
              type="text"
              name="date"
              autoComplete="off"
              placeholder={dictionary.datePlaceholder}
              className={fieldClass}
            />
          </span>
        </label>

        <label className="bg-surface hover:border-primary/40 flex items-center gap-2.5 rounded-2xl border border-transparent px-3.5 py-2.5 transition-colors">
          <UsersIcon className="text-primary size-4 shrink-0" />
          <span className="min-w-0 flex-1">
            <span className="text-muted-foreground block text-[0.7rem] font-medium tracking-wide">
              {dictionary.guests}
            </span>
            <input
              type="text"
              name="guests"
              autoComplete="off"
              placeholder={dictionary.guestsPlaceholder}
              className={fieldClass}
            />
          </span>
        </label>

        <a
          href={routes.toursAnchor(locale)}
          className="bg-primary text-primary-foreground hover:bg-primary-hover focus-visible:outline-primary inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-7 text-sm font-semibold transition-[background-color,transform] focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.97]"
        >
          <SearchIcon className="size-4" />
          {dictionary.submit}
        </a>
      </div>

      <p className="mt-2.5 pl-1 text-xs text-white/70">{dictionary.note}</p>
    </div>
  );
}
