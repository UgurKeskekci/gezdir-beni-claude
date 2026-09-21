import Image, { type ImageProps } from "next/image";

/** Anything with a URL and alt text: a local asset or a photo from the API. */
export type PhotoSource = {
  url: string;
  alt: string;
  blurDataURL?: string;
};

type PhotoProps = Omit<
  ImageProps,
  "src" | "alt" | "placeholder" | "blurDataURL"
> & {
  image: PhotoSource;
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
