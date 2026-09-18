import { tourImages } from "@/features/tours/data/images";
import type { ImageEntry } from "@/types";

/** The landing hero reuses one of the demo photos; see scripts/fetch-demo-photos.mjs. */
export const heroImage: ImageEntry = tourImages.cappadociaAerial;

/** A different photo for the closing call to action, so the page does not repeat itself. */
export const closingImage: ImageEntry = tourImages.kasSunset;
