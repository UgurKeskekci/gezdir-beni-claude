import { env } from "@/config/env";

/**
 * Typed fetch wrapper around the booking API (see docs/API.md).
 * Feature services are the only callers; nothing else may call fetch.
 *
 * The API answers with `{ data }` on success and `{ error: { code, message } }` on
 * failure, so this unwraps the envelope and turns failures into ApiError.
 */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }

  /** True when the server could not be reached at all. */
  get isOffline() {
    return this.status === 0;
  }
}

type Envelope<T> = { data: T; meta?: unknown };
type ErrorEnvelope = {
  error?: { code?: string; message?: string; details?: unknown };
};

/** Pagination as the admin list endpoints report it. */
export type PageMeta = {
  total: number;
  page: number;
  perPage: number;
  pageCount: number;
};

export type Page<T> = { data: T[]; meta: PageMeta };

export type RequestOptions = {
  /** Passed straight to fetch: `{ revalidate: 60 }` or `cache: "no-store"`. */
  next?: { revalidate?: number | false; tags?: string[] };
  cache?: RequestCache;
  signal?: AbortSignal;
  /**
   * `"include"` is what makes the admin session cookie travel. The panel runs on
   * port 3000 and the API on 4000, which is cross-origin, so the browser drops the
   * cookie unless the request asks for it (the API allows one named origin with
   * credentials, see api/src/app.ts).
   */
  credentials?: RequestCredentials;
};

/**
 * The server calls the API directly. The browser goes through the same-origin
 * `/api` rewrite in next.config.ts, which keeps the admin session cookie first-party
 * when the site and the API live on different domains.
 */
const baseUrl = () =>
  typeof window === "undefined" ? env.NEXT_PUBLIC_API_URL : "/api";

async function requestEnvelope<T>(
  method: string,
  path: string,
  body?: unknown,
  options: RequestOptions = {},
): Promise<Envelope<T>> {
  const url = `${baseUrl()}${path}`;

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers: {
        Accept: "application/json",
        ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      ...options,
    });
  } catch (cause) {
    throw new ApiError(
      0,
      "network_error",
      `Could not reach the booking API at ${baseUrl()}`,
      cause,
    );
  }

  const isJson = response.headers
    .get("content-type")
    ?.includes("application/json");
  const payload: unknown = isJson ? await response.json() : null;

  if (!response.ok) {
    const error = (payload as ErrorEnvelope | null)?.error;
    throw new ApiError(
      response.status,
      error?.code ?? "http_error",
      error?.message ?? `${method} ${path} failed with ${response.status}`,
      error?.details,
    );
  }

  return payload as Envelope<T>;
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  options?: RequestOptions,
): Promise<T> {
  return (await requestEnvelope<T>(method, path, body, options)).data;
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>("GET", path, undefined, options),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("POST", path, body, options),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("PATCH", path, body, options),
  /** For list endpoints, where `meta` carries the paging and must survive. */
  getPage: async <T>(
    path: string,
    options?: RequestOptions,
  ): Promise<Page<T>> => {
    const envelope = await requestEnvelope<T[]>(
      "GET",
      path,
      undefined,
      options,
    );
    return { data: envelope.data, meta: envelope.meta as PageMeta };
  },
};
