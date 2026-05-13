// ─── Layer 3: MD3 Styled Components (most users use these) ────────────────────
export { Card } from "./Card";
export { CardMedia } from "./CardMedia";
export { CardHeader } from "./CardHeader";
export { CardContent } from "./CardContent";
export { CardActions } from "./CardActions";

// ─── Layer 2: Headless Primitive (for advanced customization) ─────────────────
export { CardHeadless } from "./CardHeadless";

// ─── CVA Variants ─────────────────────────────────────────────────────────────
export { cardVariants, type CardVariants } from "./Card.variants";

// ─── Types ────────────────────────────────────────────────────────────────────
export type {
  CardVariant,
  CardProps,
  CardHeadlessProps,
  CardMediaProps,
  CardHeaderProps,
  CardContentProps,
  CardActionsProps,
} from "./Card.types";
