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
export type { ButtonProps, ButtonVariant, ButtonSize } from "./components/Button";

export {
  ButtonGroup,
  ButtonGroupHeadless,
  buttonGroupRootVariants,
  buttonGroupFocusRingVariants,
  buttonGroupVariants,
  ButtonGroupContext,
  useButtonGroup,
  useOptionalButtonGroup,
  getConnectedRadiusClasses,
} from "./components/ButtonGroup";
export type {
  ButtonGroupProps,
  ButtonGroupVariant,
  ButtonGroupSize,
  ButtonGroupShape,
  ButtonGroupSelectionMode,
  ButtonGroupContextValue,
  ButtonGroupRootVariants,
  ButtonGroupFocusRingVariants,
} from "./components/ButtonGroup";

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

export {
  Drawer,
  DrawerItem,
  DrawerSection,
  HeadlessDrawer,
  HeadlessDrawerItem,
  DrawerIconOnlyContext,
} from "./components/Drawer";
export type {
  DrawerProps,
  DrawerItemProps,
  DrawerItemBadgeConfig,
  DrawerSectionProps,
  DrawerVariant,
  HeadlessDrawerProps,
  HeadlessDrawerItemProps,
  DrawerContextValue,
} from "./components/Drawer";

export { Progress, ProgressHeadless } from "./components/Progress";
export type { ProgressProps, ProgressHeadlessProps } from "./components/Progress";

export { Divider, DividerHeadless, dividerVariants } from "./components/Divider";
export type {
  DividerProps,
  DividerHeadlessProps,
  DividerOrientation,
  DividerInset,
  DividerVariants,
} from "./components/Divider";

export {
  Card,
  CardMedia,
  CardHeader,
  CardContent,
  CardActions,
  CardHeadless,
  cardVariants,
} from "./components/Card";
export type {
  CardVariant,
  CardVariants,
  CardProps,
  CardHeadlessProps,
  CardMediaProps,
  CardHeaderProps,
  CardContentProps,
  CardActionsProps,
} from "./components/Card";

export {
  MenuTrigger,
  Menu,
  MenuItem,
  MenuSection,
  MenuDivider,
  HeadlessMenuTrigger,
  HeadlessMenu,
  HeadlessMenuItem,
  HeadlessMenuSection,
  HeadlessMenuDivider,
  MenuContext,
  useMenuContext,
} from "./components/Menu";
export type {
  MenuContainerVariants,
  MenuProps,
  MenuTriggerProps,
  MenuItemProps,
  MenuSectionProps,
  MenuDividerProps,
  HeadlessMenuProps,
  HeadlessMenuTriggerProps,
  HeadlessMenuItemProps,
  HeadlessMenuSectionProps,
  MenuContextValue,
} from "./components/Menu";

export {
  Snackbar,
  SnackbarHeadless,
  SnackbarProvider,
  SnackbarContext,
  useSnackbar,
} from "./components/Snackbar";
export type {
  SnackbarProps,
  SnackbarHeadlessProps,
  SnackbarProviderProps,
  SnackbarContextValue,
  SnackbarSeverity,
  SnackbarAction,
  SnackbarItem,
} from "./components/Snackbar";

export { Chip, ChipSet, ChipHeadless, chipVariants } from "./components/Chip";
export type {
  ChipType,
  ChipSurface,
  ChipProps,
  ChipHeadlessProps,
  ChipSetProps,
  ChipVariants,
} from "./components/Chip";

export {
  Dialog,
  DialogHeadline,
  DialogContent,
  DialogActions,
  DialogHeadless,
  DialogContext,
  useDialogContext,
} from "./components/Dialog";
export type {
  DialogVariant,
  DialogAnimationState,
  DialogProps,
  DialogHeadlessProps,
  DialogHeadlineProps,
  DialogContentProps,
  DialogActionsProps,
  DialogContextValue,
} from "./components/Dialog";

export {
  TooltipTrigger,
  Tooltip,
  RichTooltip,
  TooltipTriggerHeadless,
  TooltipOverlayHeadless,
  tooltipVariants,
  richTooltipVariants,
} from "./components/Tooltip";
export type {
  TooltipVariant,
  TooltipPlacement,
  TooltipTriggerProps,
  TooltipTriggerStyledProps,
  TooltipProps,
  RichTooltipProps,
  TooltipHeadlessProps,
  TooltipVariants,
  RichTooltipVariants,
} from "./components/Tooltip";

export {
  List,
  ListItem,
  ListItemLeading,
  ListItemTrailing,
  ListItemText,
  ListHeadless,
  ListItemHeadless,
  listVariants,
  listItemVariants,
} from "./components/List";
export type {
  ListDensity,
  ListLeadingType,
  ListTrailingType,
  ListProps,
  ListItemProps,
  ListItemLeadingProps,
  ListItemTrailingProps,
  ListItemTextProps,
  ListHeadlessProps,
  ListVariants,
  ListItemVariants,
} from "./components/List";
export {
  Search,
  SearchBar,
  SearchView,
  SearchBarHeadless,
  SearchViewHeadless,
  searchBarVariants,
  searchViewVariants,
  searchViewHeaderVariants,
} from "./components/Search";
export type {
  SearchStyle,
  SearchLayout,
  SearchBarProps,
  SearchViewProps,
  SearchProps,
  SearchBarHeadlessProps,
  SearchViewHeadlessProps,
} from "./components/Search";

export { Badge, BadgeHeadless, BadgeContent, badgeVariants } from "./components/Badge";
export type {
  BadgeProps,
  BadgeHeadlessProps,
  BadgeContentProps,
  BadgeColor,
  BadgeVariants,
} from "./components/Badge";

export {
  SplitButton,
  SplitButtonHeadless,
  splitButtonVariants,
  splitButtonContainerVariants,
  splitButtonPrimaryVariants,
  splitButtonDropdownVariants,
} from "./components/SplitButton";
export type {
  SplitButtonProps,
  SplitButtonHeadlessProps,
  SplitButtonVariant,
  SplitButtonSize,
  SplitButtonMenuItem,
  SplitButtonContainerVariants,
  SplitButtonPrimaryVariants,
  SplitButtonDropdownVariants,
} from "./components/SplitButton";

export {
  FABMenu,
  FABMenuItem,
  FABMenuHeadless,
  FABMenuContext,
  useFABMenuContext,
  fabMenuVariants,
  fabMenuItemVariants,
} from "./components/FABMenu";
export type {
  FABMenuDirection,
  FABMenuProps,
  FABMenuItemProps,
  FABMenuHeadlessProps,
  FABMenuContextValue,
  FABMenuVariants,
  FABMenuItemVariants,
} from "./components/FABMenu";

export {
  Slider,
  SliderHeadless,
  sliderContainerVariants,
  sliderActiveTrackVariants,
  sliderInactiveTrackVariants,
  sliderHandleVariants,
  sliderHandleStateLayerVariants,
  sliderTrackLayoutVariants,
} from "./components/Slider";
export type {
  SliderVariant,
  SliderSize,
  SliderOrientation,
  SliderHeadlessProps,
  SliderThumbProps,
  SliderProps,
  SliderThumbState,
  SliderRenderState,
  SliderRangeThumbLabels,
} from "./components/Slider";

export {
  BottomSheet,
  BottomSheetHandle,
  BottomSheetHeadless,
  BottomSheetContext,
  useBottomSheetContext,
  useBottomSheetDrag,
  bottomSheetVariants,
  bottomSheetScrimVariants,
  bottomSheetHandleWrapperVariants,
  bottomSheetHandlePillVariants,
  bottomSheetAnimationVariants,
} from "./components/BottomSheet";
export type {
  BottomSheetVariant,
  BottomSheetAnimationState,
  BottomSheetContextValue,
  BottomSheetHeadlessProps,
  BottomSheetProps,
  BottomSheetHandleProps,
  UseBottomSheetDragOptions,
  UseBottomSheetDragReturn,
  BottomSheetAnimationVariants,
  BottomSheetVariants,
  BottomSheetScrimVariants,
  BottomSheetHandleVariants,
} from "./components/BottomSheet";

export {
  TimePicker,
  TimePickerDial,
  TimePickerInput,
  timePickerContainerVariants,
  clockDialContainerVariants,
  clockDialNumberVariants,
  clockHandCenterVariants,
  clockHandTrackVariants,
  clockHandHandleVariants,
  timeSelectorContainerVariants,
  periodSelectorContainerVariants,
  periodSelectorItemVariants,
  timeInputFieldVariants,
  timeSeparatorVariants,
  timePickerHeadlineVariants,
  timePickerActionRowVariants,
  timePickerActionButtonVariants,
  timePickerModeToggleVariants,
} from "./components/TimePicker";
export type {
  TimePickerVariant,
  TimeFormat,
  TimePickerOrientation,
  TimePeriod,
  ClockSelectionMode,
  TimeValue,
  TimePickerHeadlessProps,
  TimePickerProps,
  TimePickerDialProps,
  TimePickerInputProps,
  ClockDialProps,
  ClockHandProps,
  PeriodSelectorProps,
  TimeSelectorProps,
  TimeInputFieldProps,
  TimePickerRenderState,
  TimePickerContainerVariants,
  ClockDialContainerVariants,
  ClockDialNumberVariants,
  ClockHandCenterVariants,
  ClockHandTrackVariants,
  ClockHandHandleVariants,
  TimeSelectorContainerVariants,
  PeriodSelectorContainerVariants,
  PeriodSelectorItemVariants,
  TimeInputFieldVariants,
  TimeSeparatorVariants,
  TimePickerHeadlineVariants,
  TimePickerActionRowVariants,
  TimePickerActionButtonVariants,
  TimePickerModeToggleVariants,
} from "./components/TimePicker";

export {
  DatePicker,
  DatePickerDocked,
  DatePickerModal,
  DatePickerModalInput,
  CalendarCore,
  DateField,
  datePickerContainerVariants,
  calendarCellVariants,
  datePickerHeaderVariants,
  datePickerNavVariants,
  yearItemVariants,
  datePickerDividerVariants,
  datePickerActionVariants,
  datePickerActionButtonVariants,
  datePickerWeekdayVariants,
  datePickerRangeIndicatorVariants,
  datePickerHeadlineVariants,
  datePickerSupportingTextVariants,
  datePickerScrimVariants,
} from "./components/DatePicker";
export type {
  DatePickerVariant,
  DateSelectionMode,
  CalendarView,
  CalendarCellType,
  DatePickerHeadlessProps,
  DatePickerProps,
  CalendarGridProps,
  CalendarCellProps,
  DatePickerRenderState,
  DatePickerDockedProps,
  DatePickerModalProps,
  DatePickerModalInputProps,
  DateFieldProps,
  DatePickerActionsProps,
  RangeCalendarProps,
  DateInputFieldProps,
  DatePickerModalHeaderProps,
  DatePickerContainerVariants,
  CalendarCellVariants,
  DatePickerHeaderVariants,
  DatePickerNavVariants,
  YearItemVariants,
  DatePickerDividerVariants,
  DatePickerActionVariants,
  DatePickerActionButtonVariants,
  DatePickerWeekdayVariants,
  DatePickerRangeIndicatorVariants,
  DatePickerHeadlineVariants,
  DatePickerSupportingTextVariants,
  DatePickerScrimVariants,
} from "./components/DatePicker";
