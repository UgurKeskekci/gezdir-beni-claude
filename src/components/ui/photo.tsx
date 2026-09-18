import Image, { type ImageProps } from "next/image";

import type { LocalizedImage } from "@/types";

type PhotoProps = Omit<
  ImageProps,
  "src" | "alt" | "placeholder" | "blurDataURL"
> & {
  image: LocalizedImage;
  /** Decorative photos that sit next to their own label drop the alt text. */
  decorative?: boolean;
};

/** next/image plus the generated blur preview, so every photo fades in the same way. */
export function Photo({ image, decorative = false, ...props }: PhotoProps) {
  return (
    <Image
      src={image.url}
      alt={decorative ? "" : image.alt}
      placeholder={image.blurDataURL ? "blur" : "empty"}
      blurDataURL={image.blurDataURL}
      {...props}
    />
  );
}
