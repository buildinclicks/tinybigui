import { createContext, useContext } from "react";
import type React from "react";
import type { ButtonGroupContextValue } from "./ButtonGroup.types";

/**
 * Context that provides ButtonGroup state to all child buttons.
 *
 * Consumed via `useButtonGroup()` hook inside child components
 * (Button, IconButton, or any custom button primitive).
 *
 * @example
 * ```tsx
 * // Inside a child button component
 * const { variant, size, selectedValues, onSelectionChange } = useButtonGroup();
 * ```
 */
export const ButtonGroupContext = createContext<ButtonGroupContextValue | null>(null);

ButtonGroupContext.displayName = "ButtonGroupContext";

/**
 * Hook for consuming ButtonGroup context inside child button components.
 *
 * @throws When called outside of a `ButtonGroup` or `ButtonGroupHeadless` container.
 *
 * @example
 * ```tsx
 * const MyButton = ({ value, children }: { value: string; children: React.ReactNode }) => {
 *   const { selectedValues, onSelectionChange, variant } = useButtonGroup();
 *   return (
 *     <button
 *       aria-pressed={selectedValues.has(value)}
 *       onClick={() => onSelectionChange(value)}
 *     >
 *       {children}
 *     </button>
 *   );
 * };
 * ```
 */
export function useButtonGroup(): ButtonGroupContextValue {
  const ctx = useContext(ButtonGroupContext);
  if (ctx === null) {
    throw new Error(
      "[ButtonGroup] useButtonGroup() must be used inside a <ButtonGroup> or <ButtonGroupHeadless>."
    );
  }
  return ctx;
}

/**
 * Props for `ButtonGroupProvider`
 */
export interface ButtonGroupProviderProps {
  /** The context value to provide to all children */
  value: ButtonGroupContextValue;
  /** Child button components */
  children: React.ReactNode;
}

/**
 * Provider component that wraps children with ButtonGroupContext.
 *
 * Used internally by `ButtonGroupHeadless`. You should rarely need
 * to use this directly — prefer `ButtonGroup` or `ButtonGroupHeadless`.
 */
export function ButtonGroupProvider({
  value,
  children,
}: ButtonGroupProviderProps): React.ReactElement {
  return <ButtonGroupContext.Provider value={value}>{children}</ButtonGroupContext.Provider>;
}
