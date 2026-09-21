"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import type { Locale } from "@/config/i18n";
import { isOffline, isSessionExpired } from "@/features/admin/lib/session";
import { adminLogin, hasAdminSession } from "@/features/admin/services/admin";
import type { Dictionary } from "@/i18n/types";
import { routes } from "@/lib/routes";

type AdminLoginProps = {
  locale: Locale;
  dictionary: Dictionary;
  /** True when a panel screen bounced the visitor back here on a 401. */
  expired?: boolean;
};

export function AdminLogin({ locale, dictionary, expired }: AdminLoginProps) {
  const router = useRouter();
  const id = useId();
  const t = dictionary.admin;

  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  // Someone who still has a valid cookie should not have to type it again.
  useEffect(() => {
    let cancelled = false;
    void hasAdminSession()
      .then((valid) => {
        if (valid && !cancelled) router.replace(routes.admin(locale));
      })
      .catch(() => {
        // The API is unreachable; the submit below will say so properly.
      });
    return () => {
      cancelled = true;
    };
  }, [locale, router]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    if (password.trim().length === 0) {
      setError(t.login.required);
      return;
    }

    setPending(true);
    setError(null);
    try {
      await adminLogin(password);
      // replace(), so the back button does not return to a form that now redirects.
      router.replace(routes.admin(locale));
    } catch (cause) {
      if (isSessionExpired(cause)) setError(t.login.wrong);
      else if (isOffline(cause)) setError(t.login.offline);
      else setError(t.login.error);
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="card-soft w-full max-w-md rounded-3xl p-6 sm:p-8"
    >
      <p className="text-subtle-foreground text-xs tracking-wide uppercase">
        {t.login.eyebrow}
      </p>
      <h1 className="font-display mt-2 text-2xl font-semibold tracking-tight">
        {t.login.title}
      </h1>
      <p className="text-muted-foreground mt-2 text-sm">
        {t.login.description}
      </p>

      {expired ? (
        <p
          role="status"
          className="border-border bg-surface-muted text-muted-foreground mt-5 rounded-xl border px-3.5 py-2.5 text-xs"
        >
          {t.sessionExpired}
        </p>
      ) : null}

      <Field
        label={t.login.password}
        htmlFor={`${id}-password`}
        error={error ?? undefined}
        hint={t.login.hint}
        className="mt-6"
      >
        <div className="relative">
          <Input
            id={`${id}-password`}
            name="password"
            type={visible ? "text" : "password"}
            autoComplete="current-password"
            placeholder={t.login.passwordPlaceholder}
            value={password}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-password-error` : undefined}
            onChange={(event) => {
              setPassword(event.target.value);
              if (error) setError(null);
            }}
            className="pr-24"
          />
          <button
            type="button"
            onClick={() => setVisible((current) => !current)}
            className="text-muted-foreground hover:text-foreground focus-visible:outline-primary absolute inset-y-0 right-3 my-auto h-7 rounded-full px-2 text-xs transition-colors focus-visible:outline-2"
          >
            {visible ? t.login.hide : t.login.show}
          </button>
        </div>
      </Field>

      <Button type="submit" disabled={pending} className="mt-6 w-full">
        {pending ? t.login.submitting : t.login.submit}
      </Button>
    </form>
  );
}
