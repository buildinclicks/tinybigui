/**
 * @tinybigui/react
 * Material Design 3 components for React
 */

// Utilities
export {
  // Class name utilities
  cn,
  // Color utilities
  getColorValue,
  getMD3Color,
  withOpacity,
  hexToRgb,
  rgbToHex,
  generateMD3Theme,
  applyStateLayer,
  STATE_LAYER_OPACITY,
  argbFromHex,
  hexFromArgb,
  // Typography utilities
  getTypographyToken,
  getTypographyStyle,
  getFontFamily,
  getTypographyForElement,
  getTypographyClassName,
  getResponsiveTypography,
  remToPx,
  pxToRem,
  truncateText,
  TYPOGRAPHY_ELEMENT_MAP,
  TYPOGRAPHY_USAGE,
  // Types
  type MD3ColorRole,
  type Theme,
  type MD3TypographyScale,
  type MD3TypographySize,
  type MD3TypographyStyle,
  type TypographyProperty,
  type TypographyStyleObject,
} from "./utils";

// Components
export { AppBar, AppBarHeadless } from "./components/AppBar";
export type { AppBarProps, AppBarHeadlessProps, AppBarVariant } from "./components/AppBar";

export { Button } from "./components/Button";
export type { ButtonProps, ButtonVariant, ButtonColor, ButtonSize } from "./components/Button";

export { IconButton, IconButtonHeadless } from "./components/IconButton";
export type {
  IconButtonProps,
  IconButtonVariant,
  IconButtonColor,
  IconButtonSize,
  IconButtonHeadlessProps,
} from "./components/IconButton";

export { FAB, FABHeadless } from "./components/FAB";
export type { FABProps, FABSize, FABColor, FABHeadlessProps } from "./components/FAB";

export { TextField } from "./components/TextField";
export type { TextFieldProps, TextFieldVariant, TextFieldSize } from "./components/TextField";

export { Checkbox } from "./components/Checkbox";
export type { CheckboxProps } from "./components/Checkbox";

export { Switch } from "./components/Switch";
export type { SwitchProps } from "./components/Switch";

export { Radio, RadioGroup, RadioHeadless, RadioGroupHeadless } from "./components/Radio";
export type {
  RadioProps,
  RadioGroupProps,
  RadioHeadlessProps,
  RadioGroupHeadlessProps,
} from "./components/Radio";

export {
  Tabs,
  TabList,
  Tab,
  TabPanel,
  HeadlessTabList,
  HeadlessTab,
  HeadlessTabPanel,
} from "./components/Tabs";
export type {
  TabsProps,
  TabListProps,
  TabProps,
  TabPanelProps,
  TabVariant,
  TabLayout,
  TabItem,
  HeadlessTabProps,
  HeadlessTabPanelProps,
} from "./components/Tabs";

export {
  NavigationBar,
  NavigationBarItem,
  HeadlessNavigationBar,
  HeadlessNavigationBarItem,
} from "./components/NavigationBar";
export type {
  NavigationBarProps,
  NavigationBarItemProps,
  NavigationBarItemConfig,
  NavigationBarBadge,
  HeadlessNavigationBarProps,
  HeadlessNavigationBarItemProps,
  NavigationBarItemRenderProps,
} from "./components/NavigationBar";
