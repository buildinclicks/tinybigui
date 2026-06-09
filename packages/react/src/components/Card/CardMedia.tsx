import { forwardRef } from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn";
import type { CardMediaProps } from "./Card.types";

/**
 * Aspect ratio CVA for CardMedia.
 *
 * MD3 spec: full-bleed media slot at the top of a card.
 * - `16/9` → `aspect-video` (16:9 native Tailwind utility)
 * - `4/3`  → `aspect-[4/3]` (exact ratio; no MD3 token maps to 4:3 so an
 *             arbitrary value is the correct choice here)
 * - `1/1`  → `aspect-square`
 * - `auto` → no aspect constraint (natural image dimensions)
 */
const cardMediaVariants = cva("w-full object-cover", {
  variants: {
    aspectRatio: {
      "16/9": "aspect-video",
      "4/3": "aspect-[4/3]",
      "1/1": "aspect-square",
      auto: "",
    },
  },
  defaultVariants: {
    aspectRatio: "auto",
  },
});

/**
 * `CardMedia` — Full-bleed image slot sub-component (Layer 3).
 *
 * Renders a responsive image at the top of the card per MD3 spec.
 * When `alt` is an empty string the image is treated as decorative
 * (`role="presentation"`). All other `alt` values are passed through as-is.
 *
 * @example
 * ```tsx
 * // Standard media with aspect ratio
 * <CardMedia src="/images/preview.jpg" alt="Product preview" aspectRatio="16/9" />
 *
 * // Decorative image (hidden from assistive technology)
 * <CardMedia src="/images/banner.jpg" alt="" />
 * ```
 *
 * @see https://m3.material.io/components/cards/specs
 */
export const CardMedia = forwardRef<HTMLImageElement, CardMediaProps>(function CardMedia(
  { src, alt, aspectRatio = "auto", className },
  ref
) {
  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      {...(alt === "" && { role: "presentation" })}
      className={cn(cardMediaVariants({ aspectRatio }), className)}
    />
  );
});

CardMedia.displayName = "CardMedia";
