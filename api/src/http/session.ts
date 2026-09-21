import { createHmac, timingSafeEqual } from "node:crypto";

import type { CookieOptions, NextFunction, Request, Response } from "express";

import { env, isProduction } from "../env.ts";
import { unauthorized } from "./errors.ts";

export const SESSION_COOKIE = "gb_admin";

/**
 * Stateless admin session: `<expiresAt>.<hmac>`. There is one administrator and one
 * password (see docs/API.md), so nothing needs to be stored server side. Swapping this
 * for a user table later only changes what goes into the payload.
 */
function sign(payload: string): string {
  return createHmac("sha256", env.SESSION_SECRET).update(payload).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  // timingSafeEqual throws on length mismatch, which would itself leak length.
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function createSessionToken(now = Date.now()): string {
  const expiresAt = now + env.SESSION_TTL_HOURS * 60 * 60 * 1000;
  const payload = String(expiresAt);
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(
  token: string | undefined,
  now = Date.now(),
): boolean {
  if (!token) return false;

  const separator = token.lastIndexOf(".");
  if (separator <= 0) return false;

  const payload = token.slice(0, separator);
  const signature = token.slice(separator + 1);
  if (!safeEqual(signature, sign(payload))) return false;

  const expiresAt = Number(payload);
  return Number.isFinite(expiresAt) && expiresAt > now;
}

export function sessionCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    sameSite: "lax",
    // localhost is served over http in development; never send this cookie in the
    // clear once the API runs behind TLS.
    secure: isProduction,
    path: "/",
    maxAge: env.SESSION_TTL_HOURS * 60 * 60 * 1000,
  };
}

/** Guards every /api/admin route except login. */
export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.[SESSION_COOKIE] as string | undefined;
  if (!verifySessionToken(token)) {
    next(unauthorized("Admin session missing or expired"));
    return;
  }
  next();
}

/** Compares the submitted password without leaking its length through timing. */
export function isAdminPassword(candidate: string): boolean {
  const expected = createHmac("sha256", env.SESSION_SECRET)
    .update(env.ADMIN_PASSWORD)
    .digest("hex");
  const actual = createHmac("sha256", env.SESSION_SECRET)
    .update(candidate)
    .digest("hex");
  return safeEqual(actual, expected);
}
