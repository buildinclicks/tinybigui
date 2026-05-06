import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * Extended tailwind-merge that understands MD3 custom Tailwind v4 `@theme` utilities.
 *
 * By default, `tailwind-merge` treats ALL `text-*` classes as potentially
 * conflicting. This causes issues with our custom MD3 tokens:
 * - Typography scale: `text-body-large`, `text-label-medium`, etc. → font-size group
 * - Color utilities:  `text-on-surface`, `text-primary`, etc.       → text-color group
 *
 * We register the typography-scale tokens so `twMerge` knows they live in the
 * `font-size` group and do NOT conflict with `text-color` utilities.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            // MD3 Display scale
            "display-large",
            "display-medium",
            "display-small",
            // MD3 Headline scale
            "headline-large",
            "headline-medium",
            "headline-small",
            // MD3 Title scale
            "title-large",
            "title-medium",
            "title-small",
            // MD3 Body scale
            "body-large",
            "body-medium",
            "body-small",
            // MD3 Label scale
            "label-large",
            "label-medium",
            "label-small",
          ],
        },
      ],
    },
  },
});

/**
 * Combines and merges Tailwind CSS classes efficiently.
 *
 * Uses `clsx` for conditional joining + extended `tailwind-merge` that is
 * aware of MD3 typography scale utilities (`text-body-large`, etc.) so they
 * are not incorrectly removed when merged alongside color utilities
 * (`text-on-surface`, `text-primary`, etc.).
 *
 * @example
 * ```tsx
 * cn('px-2 py-1', condition && 'bg-blue-500', { 'text-white': isActive })
 * // => 'px-2 py-1 bg-blue-500 text-white'
 * ```
 *
 * @example Merging conflicting classes (later wins)
 * ```tsx
 * cn('px-2', 'px-4')
 * // => 'px-4'
 * ```
 *
 * @example MD3 typography + color (both kept — no false conflict)
 * ```tsx
 * cn('text-body-large', 'text-on-surface')
 * // => 'text-body-large text-on-surface'
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
