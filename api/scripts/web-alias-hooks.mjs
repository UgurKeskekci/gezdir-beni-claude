// Resolves the web app's "@/..." import alias so this API can read its source data
// files directly. Used only by scripts/export-web-tours.ts — nothing at runtime.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const webSrc = path.resolve(here, "..", "..", "src");

export async function resolve(specifier, context, nextResolve) {
  if (!specifier.startsWith("@/")) return nextResolve(specifier, context);

  const base = path.join(webSrc, specifier.slice(2));
  const candidates = [
    base,
    `${base}.ts`,
    `${base}.tsx`,
    path.join(base, "index.ts"),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return nextResolve(pathToFileURL(candidate).href, context);
    }
  }

  throw new Error(`Cannot resolve "${specifier}" under ${webSrc}`);
}
