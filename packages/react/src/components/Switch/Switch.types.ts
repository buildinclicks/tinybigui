import type React from "react";
import type { AriaSwitchProps } from "react-aria";

/**
 * Material Design 3 Switch Component Props
 *
 * Built on React Aria for world-class accessibility.
 * Represents on/off states (not selection like checkbox).
 * Styled via the Variants-vs-States architecture: CVA slots + data-* attributes.
 *
 * @example
 * ```tsx
 * // Controlled switch
 * <Switch isSelected={isOn} onChange={setIsOn}>
 *   Low power mode
 * </Switch>
 *
 * // Uncontrolled with default value
 * <Switch defaultSelected>
 *   Enable notifications
 * </Switch>
 *
 * // With icons
 * <Switch icon={<IconClose />} selectedIcon={<IconCheck />}>
 *   Airplane mode
 * </Switch>
 *
 * // Disabled
 * <Switch isDisabled>
 *   Disabled option
 * </Switch>
 *
 * // Headless version (custom styling)
 * <SwitchHeadless className="my-custom-styles">
 *   Custom switch
 * </SwitchHeadless>
 * ```
 */
export interface SwitchProps
  extends
    AriaSwitchProps,
    Omit<React.HTMLAttributes<HTMLLabelElement>, keyof AriaSwitchProps | "children"> {
  /**
   * Switch label content.
   */
  children?: React.ReactNode;

  /**
   * Icon displayed inside the handle when the switch is OFF.
   * Presence of this prop also sets `data-with-icon` on the root,
   * expanding the handle to 24dp (same as selected) for visual balance.
   *
   * @default undefined
   */
  icon?: React.ReactNode;

  /**
   * Icon displayed inside the handle when the switch is ON.
   * Presence of this prop also sets `data-with-icon` on the root.
   *
   * @default undefined
   */
  selectedIcon?: React.ReactNode;

  /**
   * Disable the ripple effect on press.
   *
   * @default false
   */
  disableRipple?: boolean;

  /**
   * Additional Tailwind CSS classes applied to the root label element.
   */
  className?: string;
}

/**
 * Props for the headless Switch component.
 * Extends AriaSwitchProps for accessibility primitives.
 */
export interface SwitchHeadlessProps extends AriaSwitchProps {
  /**
   * Additional CSS classes for the label wrapper.
   */
  className?: string;

  /**
   * Switch label content.
   */
  children?: React.ReactNode;

  /**
   * Render prop for custom switch visual.
   * Receives the current interaction/selection state.
   */
  renderSwitch?: (state: {
    isSelected: boolean;
    isDisabled: boolean;
    isFocusVisible: boolean;
    isPressed: boolean;
    isReadOnly: boolean;
  }) => React.ReactNode;
}
