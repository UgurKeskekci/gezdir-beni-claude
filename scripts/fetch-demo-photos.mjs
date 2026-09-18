#!/usr/bin/env node
// Downloads the demo photography from Wikimedia Commons into public/images/tours.
// Hotlinking Commons gets rate limited (HTTP 429), so the files are served locally instead.
// Re-run with: node scripts/fetch-demo-photos.mjs [--force]
// Credits live next to the URLs in src/features/tours/data/images.ts and must stay.

import fs from "node:fs/promises";
import path from "node:path";

const OUT_DIR = path.join(process.cwd(), "public", "images", "tours");
const WIDTHS = [1280, 1920]; // Commons only serves specific thumbnail widths.
const USER_AGENT =
  "GezdirBeniDemo/1.0 (local demo project; contact: merhaba@gezdirbeni.example)";

/** name -> [shard, Commons file name] */
const PHOTOS = {
  "cappadocia-balloons": ["a/a4", "Hot_air_balloon_in_Cappadocia_02.jpg"],
  "cappadocia-balloon-close": ["d/df", "Hot_air_balloon_in_Cappadocia_01.jpg"],
  "cappadocia-aerial": ["a/a3", "Cappadocia_Aerial_View_Landscape.jpg"],
  "oludeniz-swimming": [
    "e/e4",
    "Swimming_in_the_Blue_Lagoon_in_%C3%96l%C3%BCdeniz%2C_Turkey_%2849070223763%29.jpg",
  ],
  "oludeniz-paragliding": [
    "2/25",
    "Paragliding_over_the_Blue_Lagoon_in_%C3%96l%C3%BCdeniz%2C_Turkey_%2849070937152%29.jpg",
  ],
  "oludeniz-lagoon": [
    "0/0b",
    "Blue_Lagoon_in_%C3%96l%C3%BCdeniz%2C_Turkey_%2849070738266%29.jpg",
  ],
  "ayder-plateau": ["9/95", "Ayder_Plateau_%40_Rize-Turkey.JPG"],
  "firtina-creek": [
    "4/4c",
    "F%C4%B1rt%C4%B1na_Deresi_%40Ayder-Rize-Turkey-2.JPG",
  ],
  "balat-houses": ["1/15", "Balat_houses.jpg"],
  "balat-colorful": ["3/34", "Colorful_Balat_houses.jpg"],
  "balat-street": ["4/48", "The_Colorful_Balat.jpg"],
  "kas-limanagzi": ["9/92", "Antalya_-_Ka%C5%9F_-Limana%C4%9Fz%C4%B1.jpg"],
  "kas-sunset": [
    "2/2c",
    "Ka%C5%9F_Ak%C5%9Fam%C3%BCst%C3%BC_Manzaras%C4%B1.jpg",
  ],
  "kas-harbour": [
    "6/62",
    "Ka%C5%9F%2C_A%C4%9Fustos_2015_Liman%27dan_bir_g%C3%B6r%C3%BCn%C3%BCm.jpg",
  ],
  "bali-terraces": ["3/3a", "Tegallalang_Rice_Terraces_Bali.jpg"],
  "bali-terraces-path": ["8/80", "Tegallalang_Rice_Terraces_Bali_1.jpg"],
  "bali-rice-fields": ["8/8a", "Rice_terraces%2C_Bali.jpg"],
};

const force = process.argv.includes("--force");

async function download(name, [shard, file]) {
  const dest = path.join(OUT_DIR, `${name}.jpg`);
  if (!force) {
    const existing = await fs.stat(dest).catch(() => null);
    if (existing?.size)
      return { name, status: "skipped", kb: Math.round(existing.size / 1024) };
  }

  let lastError = "no attempt";
  for (const width of WIDTHS) {
    const url = `https://upload.wikimedia.org/wikipedia/commons/thumb/${shard}/${file}/${width}px-${file}`;
    let response = await fetch(url, { headers: { "User-Agent": USER_AGENT } });

    // Commons rate limits bulk downloads; back off instead of giving up.
    for (let attempt = 1; response.status === 429 && attempt <= 4; attempt++) {
      const retryAfter = Number(response.headers.get("retry-after"));
      const waitMs =
        Number.isFinite(retryAfter) && retryAfter > 0
          ? retryAfter * 1000
          : attempt * 5000;
      console.log(
        `  429 for ${name}, waiting ${waitMs / 1000}s (attempt ${attempt}/4)`,
      );
      await new Promise((resolve) => setTimeout(resolve, waitMs));
      response = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
    }

    if (!response.ok) {
      lastError = `HTTP ${response.status} at ${width}px`;
      continue;
    }
    const type = response.headers.get("content-type") ?? "";
    if (!type.startsWith("image/")) {
      lastError = `unexpected content-type "${type}" at ${width}px`;
      continue;
    }
    const bytes = Buffer.from(await response.arrayBuffer());
    await fs.writeFile(dest, bytes);
    return {
      name,
      status: "downloaded",
      kb: Math.round(bytes.length / 1024),
      width,
    };
  }
  return { name, status: "FAILED", error: lastError };
}

await fs.mkdir(OUT_DIR, { recursive: true });

const results = [];
for (const [name, source] of Object.entries(PHOTOS)) {
  const result = await download(name, source);
  results.push(result);
  console.log(
    result.status === "FAILED"
      ? `FAILED   ${name}: ${result.error}`
      : `${result.status.padEnd(10)} ${name}.jpg  ${result.kb}KB${result.width ? ` (${result.width}px)` : ""}`,
  );
  // Be polite to Commons.
  await new Promise((resolve) => setTimeout(resolve, 250));
}

const failed = results.filter((r) => r.status === "FAILED");
if (failed.length > 0) {
  console.error(`\n${failed.length} photo(s) could not be downloaded.`);
  process.exit(1);
}
console.log(`\n${results.length} photos ready in public/images/tours.`);
