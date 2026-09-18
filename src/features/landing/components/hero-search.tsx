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
  "w-full bg-transparent text-sm text-white outline-none placeholder:text-white/45";

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
        className="glass-panel grid gap-px overflow-hidden rounded-3xl p-2 sm:grid-cols-[1.3fr_1fr_0.9fr_auto] sm:items-center sm:gap-2"
      >
        <label className="flex items-center gap-2.5 rounded-2xl px-3 py-2.5 transition-colors hover:bg-white/5">
          <PinIcon className="size-4 shrink-0 text-white/60" />
          <span className="min-w-0 flex-1">
            <span className="block text-[0.7rem] font-medium tracking-wide text-white/60">
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

        <label className="flex items-center gap-2.5 rounded-2xl px-3 py-2.5 transition-colors hover:bg-white/5 sm:border-l sm:border-white/10">
          <CalendarIcon className="size-4 shrink-0 text-white/60" />
          <span className="min-w-0 flex-1">
            <span className="block text-[0.7rem] font-medium tracking-wide text-white/60">
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

        <label className="flex items-center gap-2.5 rounded-2xl px-3 py-2.5 transition-colors hover:bg-white/5 sm:border-l sm:border-white/10">
          <UsersIcon className="size-4 shrink-0 text-white/60" />
          <span className="min-w-0 flex-1">
            <span className="block text-[0.7rem] font-medium tracking-wide text-white/60">
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
          className="bg-primary text-primary-foreground hover:bg-primary-hover focus-visible:outline-primary inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-6 text-sm font-semibold transition-[background-color,transform] focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.97]"
        >
          <SearchIcon className="size-4" />
          {dictionary.submit}
        </a>
      </div>

      <p className="mt-2.5 pl-1 text-xs text-white/45">{dictionary.note}</p>
    </div>
  );
}
