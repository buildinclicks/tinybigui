# Task 0.4: Component API Design

**Date**: 2025-12-31  
**Status**: ✅ Complete  
**Phase**: 1a - Core Buttons (Research & Planning)

---

## 📋 Overview

This document defines the TypeScript interfaces and API contracts for all three core button components:
- **Button** (5 variants)
- **IconButton** (4 variants)
- **FAB** (4 sizes + extended)

These APIs will guide all implementation tasks and ensure consistency across components.

---

## 🎯 Design Principles

### **1. Type Safety**
- Strict TypeScript with discriminated unions
- No `any` types
- Proper prop validation

### **2. Consistency**
- Shared patterns across all button components
- Common prop names for common functionality
- Predictable behavior

### **3. Accessibility First**
- Required accessibility props where needed
- TypeScript errors for missing a11y props
- WCAG AA compliance by default

### **4. Developer Experience**
- IntelliSense support
- Clear prop names
- Helpful JSDoc comments

### **5. Flexibility**
- Support custom classes (className)
- Forward refs
- Polymorphic components (as prop)

---

## 🔧 Shared Types & Patterns

### **Base Button Props**

All button components share these base props:

```typescript
/**
 * Base props shared by all button components
 */
interface BaseButtonProps {
  /**
   * Additional CSS classes (Tailwind)
   */
  className?: string;

  /**
   * Whether the button is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Loading state - shows spinner, disables interaction
   * @default false
   */
  loading?: boolean;

  /**
   * Click handler
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;

  /**
   * Button type for forms
   * @default 'button'
   */
  type?: 'button' | 'submit' | 'reset';

  /**
   * Optional test ID for testing
   */
  'data-testid'?: string;

  /**
   * Accessible label for screen readers
   * Required for icon-only buttons (IconButton, FAB without text)
   */
  'aria-label'?: string;

  /**
   * Tab index for keyboard navigation
   * @default 0
   */
  tabIndex?: number;

  /**
   * ARIA pressed state (for toggle buttons)
   */
  'aria-pressed'?: boolean | 'true' | 'false' | 'mixed';

  /**
   * ARIA expanded state (for buttons that control expandable content)
   */
  'aria-expanded'?: boolean | 'true' | 'false';

  /**
   * ARIA controls - ID of element controlled by this button
   */
  'aria-controls'?: string;

  /**
   * ARIA haspopup - indicates button opens a menu/dialog
   */
  'aria-haspopup'?: boolean | 'true' | 'false' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
}
```

---

### **Size Types**

```typescript
/**
 * Standard button sizes (Button component)
 */
type ButtonSize = 'small' | 'medium' | 'large';

/**
 * IconButton size (always 40×40px, but can scale icon)
 */
type IconButtonSize = 'small' | 'medium' | 'large';

/**
 * FAB sizes
 */
type FABSize = 'small' | 'medium' | 'large';
```

---

### **Color Variants**

```typescript
/**
 * MD3 color schemes for buttons
 */
type ButtonColor = 'primary' | 'secondary' | 'tertiary' | 'error';

/**
 * FAB color variants (includes surface)
 */
type FABColor = 'primary' | 'secondary' | 'tertiary' | 'surface';
```

---

### **Polymorphic Component**

Allow rendering as different elements or components:

```typescript
/**
 * Polymorphic component props
 * Allows rendering button as <a>, <Link>, or custom component
 */
type PolymorphicProps<E extends React.ElementType> = {
  /**
   * Element or component to render as
   * @default 'button'
   */
  as?: E;
} & Omit<React.ComponentPropsWithoutRef<E>, 'as'>;
```

---

## 🔘 Button Component API

### **Props Interface**

```typescript
/**
 * Material Design 3 Button Component
 * 
 * Supports 5 variants: filled, outlined, tonal, elevated, text
 * Implementation uses Tailwind CSS classes mapped to MD3 tokens.
 * 
 * @example
 * ```tsx
 * // Filled button (default)
 * <Button variant="filled" color="primary">
 *   Click me
 * </Button>
 * 
 * // With icon
 * <Button variant="tonal" icon={<IconAdd />}>
 *   Add Item
 * </Button>
 * 
 * // Loading state
 * <Button variant="elevated" loading>
 *   Saving...
 * </Button>
 * 
 * // Disabled
 * <Button variant="outlined" disabled>
 *   Disabled
 * </Button>
 * 
 * // As link
 * <Button as="a" href="/page">
 *   Go to page
 * </Button>
 * ```
 */
interface ButtonProps extends BaseButtonProps {
  /**
   * Button variant
   * @default 'filled'
   */
  variant?: 'filled' | 'outlined' | 'tonal' | 'elevated' | 'text';

  /**
   * Color scheme
   * @default 'primary'
   */
  color?: ButtonColor;

  /**
   * Size variant
   * @default 'medium'
   */
  size?: ButtonSize;

  /**
   * Leading icon (before text)
   */
  icon?: React.ReactNode;

  /**
   * Trailing icon (after text)
   */
  trailingIcon?: React.ReactNode;

  /**
   * Button content (text)
   * Required unless icon-only (not recommended for Button)
   */
  children: React.ReactNode;

  /**
   * Full width button (spans container)
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Disable ripple effect
   * @default false
   */
  disableRipple?: boolean;

  /**
   * Custom ref forwarding
   */
  ref?: React.Ref<HTMLButtonElement>;
}
```

---

### **Component Signature**

```typescript
/**
 * Button component with polymorphic support
 */
export const Button: <E extends React.ElementType = 'button'>(
  props: ButtonProps & PolymorphicProps<E>
) => React.ReactElement | null;

// Also export with forwardRef
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    // Implementation
  }
);
```

---

### **Default Props**

```typescript
const defaultProps: Partial<ButtonProps> = {
  variant: 'filled',
  color: 'primary',
  size: 'medium',
  type: 'button',
  disabled: false,
  loading: false,
  fullWidth: false,
  disableRipple: false,
  tabIndex: 0,
};
```

---

### **Prop Validation Rules**

```typescript
/**
 * Runtime validation (in development)
 */
if (process.env.NODE_ENV === 'development') {
  // Warn if no children provided
  if (!children) {
    console.warn('[Button] Button should have text content. Use IconButton for icon-only buttons.');
  }

  // Warn if both icon and trailingIcon provided
  if (icon && trailingIcon) {
    console.warn('[Button] Button should have either icon or trailingIcon, not both.');
  }
}
```

---

## 🎯 IconButton Component API

### **Props Interface**

```typescript
/**
 * Material Design 3 IconButton Component
 * 
 * Circular button with icon only (no text).
 * Supports 4 variants: standard, filled, tonal, outlined
 * 
 * ⚠️ IMPORTANT: aria-label is REQUIRED for accessibility
 * 
 * @example
 * ```tsx
 * // Standard icon button
 * <IconButton aria-label="Add item">
 *   <IconAdd />
 * </IconButton>
 * 
 * // Filled variant
 * <IconButton variant="filled" aria-label="Favorite">
 *   <IconFavorite />
 * </IconButton>
 * 
 * // Toggle button (like/unlike)
 * <IconButton 
 *   aria-label="Like" 
 *   aria-pressed={liked}
 *   onClick={toggleLike}
 * >
 *   {liked ? <IconFavorite /> : <IconFavoriteBorder />}
 * </IconButton>
 * 
 * // Disabled
 * <IconButton aria-label="Settings" disabled>
 *   <IconSettings />
 * </IconButton>
 * ```
 */
interface IconButtonProps extends BaseButtonProps {
  /**
   * Icon button variant
   * @default 'standard'
   */
  variant?: 'standard' | 'filled' | 'tonal' | 'outlined';

  /**
   * Color scheme
   * @default 'primary'
   */
  color?: ButtonColor;

  /**
   * Icon size (scales icon inside 40×40px container)
   * @default 'medium'
   */
  size?: IconButtonSize;

  /**
   * Icon content (required)
   */
  children: React.ReactNode;

  /**
   * Accessible label (REQUIRED)
   * TypeScript will enforce this
   */
  'aria-label': string; // Required, not optional!

  /**
   * Disable ripple effect
   * @default false
   */
  disableRipple?: boolean;

  /**
   * Custom ref forwarding
   */
  ref?: React.Ref<HTMLButtonElement>;
}
```

---

### **Type Enforcement for aria-label**

Make `aria-label` required at the type level:

```typescript
// Option 1: Make aria-label required in interface
interface IconButtonProps extends Omit<BaseButtonProps, 'aria-label'> {
  'aria-label': string; // Required!
  // ... other props
}

// Option 2: Conditional type (allows aria-labelledby as alternative)
type IconButtonProps = BaseButtonProps & {
  // ... other props
} & (
  | { 'aria-label': string }
  | { 'aria-labelledby': string }
);
```

---

### **Default Props**

```typescript
const defaultProps: Partial<IconButtonProps> = {
  variant: 'standard',
  color: 'primary',
  size: 'medium',
  type: 'button',
  disabled: false,
  loading: false,
  disableRipple: false,
  tabIndex: 0,
};
```

---

### **Prop Validation Rules**

```typescript
/**
 * Runtime validation (in development)
 */
if (process.env.NODE_ENV === 'development') {
  // Error if no aria-label provided
  if (!props['aria-label'] && !props['aria-labelledby']) {
    console.error(
      '[IconButton] aria-label is REQUIRED for icon-only buttons. ' +
      'Provide either aria-label or aria-labelledby for screen readers.'
    );
  }

  // Warn if children is text (should use Button instead)
  if (typeof children === 'string') {
    console.warn(
      '[IconButton] IconButton should only contain icons, not text. ' +
      'Use <Button icon={...}>Text</Button> instead.'
    );
  }
}
```

---

## 🎈 FAB Component API

### **Props Interface**

```typescript
/**
 * Material Design 3 FAB (Floating Action Button) Component
 * 
 * High-emphasis button for primary screen action.
 * Supports 4 sizes: small, medium, large, extended
 * 
 * ⚠️ IMPORTANT: 
 * - Only ONE FAB per screen
 * - aria-label is REQUIRED (even for extended FAB)
 * - Use for primary constructive actions only
 * 
 * @example
 * ```tsx
 * // Standard FAB
 * <FAB aria-label="Create new item">
 *   <IconAdd />
 * </FAB>
 * 
 * // Small FAB
 * <FAB size="small" aria-label="Add photo">
 *   <IconCamera />
 * </FAB>
 * 
 * // Large FAB
 * <FAB size="large" aria-label="Compose">
 *   <IconEdit />
 * </FAB>
 * 
 * // Extended FAB (with text)
 * <FAB size="extended" aria-label="Create new document">
 *   <IconAdd />
 *   Create
 * </FAB>
 * 
 * // Loading state
 * <FAB aria-label="Creating" loading>
 *   <IconAdd />
 * </FAB>
 * 
 * // Secondary color
 * <FAB color="secondary" aria-label="Edit">
 *   <IconEdit />
 * </FAB>
 * ```
 */
interface FABProps extends BaseButtonProps {
  /**
   * FAB size variant
   * - small: 40×40px
   * - medium: 56×56px (default)
   * - large: 96×96px
   * - extended: Variable width with text
   * @default 'medium'
   */
  size?: FABSize | 'extended';

  /**
   * Color scheme
   * @default 'primary'
   */
  color?: FABColor;

  /**
   * Icon content (required)
   */
  icon: React.ReactNode;

  /**
   * Text label (required for extended, ignored for others)
   */
  children?: React.ReactNode;

  /**
   * Accessible label (REQUIRED for all sizes)
   * Even extended FAB needs aria-label
   */
  'aria-label': string; // Required!

  /**
   * Positioning (when using fixed positioning)
   */
  position?: {
    /**
     * Placement on screen
     * @default 'bottom-right'
     */
    placement?: 'bottom-right' | 'bottom-left' | 'bottom-center' | 'top-right' | 'top-left';
    
    /**
     * Offset from edge
     * @default 16
     */
    offset?: number;
  };

  /**
   * Use fixed positioning (floats above content)
   * @default true
   */
  fixed?: boolean;

  /**
   * Disable ripple effect
   * @default false
   */
  disableRipple?: boolean;

  /**
   * Custom ref forwarding
   */
  ref?: React.Ref<HTMLButtonElement>;
}
```

---

### **Conditional Types for Extended FAB**

```typescript
/**
 * Extended FAB requires children (text)
 * Other sizes ignore children
 */
type FABProps = BaseButtonProps & {
  icon: React.ReactNode;
  'aria-label': string;
  color?: FABColor;
  // ... other common props
} & (
  | {
      size?: 'small' | 'medium' | 'large';
      children?: never; // Not allowed for standard sizes
    }
  | {
      size: 'extended';
      children: React.ReactNode; // Required for extended
    }
);
```

---

### **Default Props**

```typescript
const defaultProps: Partial<FABProps> = {
  size: 'medium',
  color: 'primary',
  type: 'button',
  disabled: false,
  loading: false,
  fixed: true,
  disableRipple: false,
  tabIndex: 0,
  position: {
    placement: 'bottom-right',
    offset: 16,
  },
};
```

---

### **Prop Validation Rules**

```typescript
/**
 * Runtime validation (in development)
 */
if (process.env.NODE_ENV === 'development') {
  // Error if no aria-label provided
  if (!props['aria-label']) {
    console.error(
      '[FAB] aria-label is REQUIRED for all FAB variants, including extended. ' +
      'This ensures screen reader accessibility.'
    );
  }

  // Error if extended size without children
  if (size === 'extended' && !children) {
    console.error('[FAB] Extended FAB requires children (text label).');
  }

  // Warn if children provided for non-extended sizes
  if (size !== 'extended' && children) {
    console.warn(
      '[FAB] Children (text) is only used for extended FAB. ' +
      'For icon-only FAB, use icon prop only.'
    );
  }

  // Warn if no icon provided
  if (!icon) {
    console.error('[FAB] icon prop is required. FAB must have an icon.');
  }
}
```

---

## 🔄 Shared Utilities & Hooks

### **useRipple Hook**

```typescript
/**
 * Hook for ripple effect on button press
 * Returns ref and ripple element to render
 */
interface UseRippleOptions {
  disabled?: boolean;
  disableRipple?: boolean;
  color?: string;
}

function useRipple(options?: UseRippleOptions): {
  ref: React.RefObject<HTMLElement>;
  ripples: React.ReactNode;
}

// Usage in button components:
const { ref, ripples } = useRipple({ disabled, disableRipple });
```

---

### **useButtonState Hook**

```typescript
/**
 * Hook for managing button state (hover, focus, pressed)
 * Returns state and handlers
 */
interface ButtonState {
  hovered: boolean;
  focused: boolean;
  pressed: boolean;
}

function useButtonState(): {
  state: ButtonState;
  handlers: {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onFocus: () => void;
    onBlur: () => void;
    onMouseDown: () => void;
    onMouseUp: () => void;
  };
}
```

---

### **cn Utility (Already Exists)**

```typescript
/**
 * Merge Tailwind classes with proper precedence
 */
import { cn } from '@/utils/cn';

// Usage:
<button className={cn(
  'base-classes',
  variantClasses[variant],
  disabled && 'opacity-38',
  className // User's custom classes
)}>
```

---

## 🎨 Styling Approach

### **Component Structure**

Each button component will follow this structure:

```tsx
<button
  ref={ref}
  type={type}
  disabled={disabled || loading}
  aria-label={ariaLabel}
  onClick={handleClick}
  className={cn(
    // Base classes (all buttons)
    'relative inline-flex items-center justify-center',
    'transition-all duration-200',
    'focus-visible:outline-2 focus-visible:outline-primary',
    
    // Size classes
    sizeClasses[size],
    
    // Variant classes
    variantClasses[variant],
    
    // State classes
    disabled && 'opacity-38 pointer-events-none',
    loading && 'cursor-wait',
    
    // User custom classes
    className
  )}
  {...otherProps}
>
  {/* Loading spinner (if loading) */}
  {loading && <Spinner />}
  
  {/* Icon (if provided) */}
  {icon && <span className="icon">{icon}</span>}
  
  {/* Content */}
  {children}
  
  {/* Ripple effect */}
  {ripples}
</button>
```

---

### **Variant Class Maps**

Pre-defined Tailwind class combinations for each variant:

```typescript
const buttonVariantClasses = {
  filled: 'bg-primary text-on-primary shadow-none',
  outlined: 'bg-transparent border border-outline text-primary',
  tonal: 'bg-secondary-container text-on-secondary-container',
  elevated: 'bg-surface-container-low text-primary shadow-elevation-1',
  text: 'bg-transparent text-primary',
};

const iconButtonVariantClasses = {
  standard: 'bg-transparent text-on-surface-variant',
  filled: 'bg-primary text-on-primary',
  tonal: 'bg-secondary-container text-on-secondary-container',
  outlined: 'bg-transparent border border-outline text-on-surface-variant',
};

const fabVariantClasses = {
  primary: 'bg-primary-container text-on-primary-container',
  secondary: 'bg-secondary-container text-on-secondary-container',
  tertiary: 'bg-tertiary-container text-on-tertiary-container',
  surface: 'bg-surface text-primary',
};
```

---

## 📦 Export Structure

```typescript
// packages/react/src/components/Button/index.ts
export { Button } from './Button';
export type { ButtonProps, ButtonSize, ButtonColor } from './Button';

// packages/react/src/components/IconButton/index.ts
export { IconButton } from './IconButton';
export type { IconButtonProps, IconButtonSize } from './IconButton';

// packages/react/src/components/FAB/index.ts
export { FAB } from './FAB';
export type { FABProps, FABSize, FABColor } from './FAB';

// packages/react/src/index.ts (main entry)
export { Button, IconButton, FAB } from './components';
export type { 
  ButtonProps, 
  IconButtonProps, 
  FABProps,
  ButtonSize,
  ButtonColor,
  IconButtonSize,
  FABSize,
  FABColor,
} from './components';
```

---

## ✅ API Design Checklist

### **Type Safety**
- [x] All props have explicit types
- [x] No `any` types
- [x] Discriminated unions for variants
- [x] Required props enforced by TypeScript
- [x] aria-label required for icon-only buttons

### **Consistency**
- [x] Shared BaseButtonProps interface
- [x] Consistent prop naming (variant, color, size)
- [x] Common event handlers (onClick, onFocus, etc.)
- [x] Consistent default values

### **Accessibility**
- [x] aria-label required for IconButton and FAB
- [x] Support for aria-pressed (toggle buttons)
- [x] Support for aria-expanded, aria-controls
- [x] Focus indicators in base styles
- [x] Disabled state properly conveyed

### **Flexibility**
- [x] className prop for custom styles
- [x] Polymorphic support (as prop)
- [x] Ref forwarding
- [x] Data attributes for testing

### **Developer Experience**
- [x] JSDoc comments on all props
- [x] Usage examples in comments
- [x] Clear prop descriptions
- [x] Runtime validation in development
- [x] Helpful error/warning messages

---

## 🎯 Next Steps

With these API contracts defined, we can now proceed to implementation:

1. **Task 1.1**: Implement Button component
2. **Task 1.2**: Implement IconButton component  
3. **Task 1.3**: Implement FAB component
4. **Task 2.x**: Write comprehensive tests
5. **Task 3.x**: Create Storybook stories
6. **Task 4.x**: Write component documentation

All components will implement these exact interfaces with no deviations.

---

## 📝 Key Design Decisions

### **1. aria-label Required for Icon-Only Buttons**

**Decision**: Make `aria-label` required at TypeScript level for IconButton and FAB.

**Rationale**:
- Accessibility is non-negotiable
- Prevents developers from forgetting
- TypeScript error = immediate feedback
- Better than runtime warning

---

### **2. Extended FAB as Size Variant**

**Decision**: Extended FAB is `size="extended"`, not a separate component.

**Rationale**:
- Reduces API surface area
- All FABs share same behavior
- Clear in usage: `<FAB size="extended">`
- Conditional types ensure proper props

---

### **3. Polymorphic Support**

**Decision**: Support `as` prop for rendering as different elements.

**Rationale**:
- Enables Button as link: `<Button as="a" href="...">`
- Enables Button as router Link: `<Button as={Link} to="...">`
- Maintains type safety
- Common pattern in modern libraries

---

### **4. Loading State Built-In**

**Decision**: All buttons support `loading` prop.

**Rationale**:
- Common use case (async actions)
- Shows spinner, disables interaction
- Better UX than disabled state
- Consistent across all button types

---

### **5. Single Icon or Trailing Icon (Not Both)**

**Decision**: Button supports `icon` OR `trailingIcon`, warn if both provided.

**Rationale**:
- MD3 spec: buttons have one icon max
- Clear API: icon=leading, trailingIcon=trailing
- Runtime warning helps catch mistakes
- Simpler implementation

---

### **6. FAB Position Prop**

**Decision**: FAB has `position` prop for placement and offset.

**Rationale**:
- FABs are commonly fixed-position
- Developers need to control placement
- Encapsulates positioning logic
- Can be ignored if not using fixed position

---

### **7. Shared Base Props**

**Decision**: All buttons extend `BaseButtonProps`.

**Rationale**:
- Reduces duplication
- Ensures consistency
- Easy to add new common props
- Clear hierarchy

---

## 🎓 Summary

We've defined comprehensive TypeScript APIs for all three button components:

**Button**: 5 variants, optional icons, text required  
**IconButton**: 4 variants, icon only, aria-label required  
**FAB**: 4 sizes, icon required, aria-label required, fixed positioning

**Key Features**:
- ✅ Type-safe with strict TypeScript
- ✅ Accessibility enforced at type level
- ✅ Consistent prop naming across components
- ✅ Flexible (polymorphic, ref forwarding)
- ✅ Developer-friendly (JSDoc, examples, validation)

These APIs are now **locked** and ready for implementation!

---

**Task Status**: ✅ Complete  
**Next Task**: 1.1 - Implement Button Component (TDD)

