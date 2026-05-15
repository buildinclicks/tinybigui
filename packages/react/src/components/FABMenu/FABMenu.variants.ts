import { cva, type VariantProps } from "class-variance-authority";

/**
 * CVA variants for the FABMenu root container.
 *
 * Controls the expansion direction of action items relative to the trigger FAB.
 * Uses gap-3 (12px) for spacing between trigger and items per MD3 spec.
 */
export const fabMenuVariants = cva(["relative", "inline-flex", "items-end"], {
  variants: {
    direction: {
      up: ["flex-col-reverse", "gap-3"],
      down: ["flex-col", "gap-3"],
      left: ["flex-row-reverse", "gap-3", "items-center"],
      right: ["flex-row", "gap-3", "items-center"],
    },
  },
  defaultVariants: {
    direction: "up",
  },
});

/**
 * CVA variants for individual FABMenuItem containers.
 *
 * Controls visibility and pointer interaction based on open state.
 * Transition classes are applied separately for stagger animation support.
 */
export const fabMenuItemVariants = cva(
  ["relative", "flex", "items-center", "gap-3", "cursor-pointer"],
  {
    variants: {
      isOpen: {
        true: ["pointer-events-auto", "opacity-100"],
        false: ["pointer-events-none", "opacity-0"],
      },
    },
    defaultVariants: {
      isOpen: false,
    },
  }
);

export type FABMenuVariants = VariantProps<typeof fabMenuVariants>;
export type FABMenuItemVariants = VariantProps<typeof fabMenuItemVariants>;
