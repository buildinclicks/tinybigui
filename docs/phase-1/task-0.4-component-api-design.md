# Task 0.4: Component API Design

**Date**: 2025-12-31  
**Status**: ✅ Complete (Updated: 2025-12-31)  
**Phase**: 1a - Core Buttons (Research & Planning)

---

## 📋 Overview

This document defines the TypeScript interfaces and API contracts for all three core button components:
- **Button** (5 variants)
- **IconButton** (4 variants)
- **FAB** (4 sizes + extended)

These APIs will guide all implementation tasks and ensure consistency across components.

---

## 🏗️ Architecture Strategy

### **Three-Layer Component Architecture**

We follow a **three-layer architecture** for maximum flexibility and world-class accessibility:

```
┌─────────────────────────────────────┐
│   Layer 3: MD3 Styled Components   │  ← What most users use
│   (Button.tsx)                      │     • Material Design 3 styling
│   • Uses CVA for variants          │     • Pre-configured variants
│   • Applies MD3 tokens             │     • Opinionated defaults
│   • Wraps headless layer           │
└─────────────────────────────────────┘
              ↓ uses
┌─────────────────────────────────────┐
│   Layer 2: Headless Primitives     │  ← Advanced users/customization
│   (ButtonHeadless.tsx)              │     • Unstyled, functional
│   • Uses React Aria hooks          │     • Full accessibility
│   • Provides behavior only         │     • Bring your own styles
│   • Type-safe props                │
└─────────────────────────────────────┘
              ↓ uses
┌─────────────────────────────────────┐
│   Layer 1: React Aria Hooks        │  ← Foundation (Adobe)
│   (useButton, useFocusRing, etc.)  │     • WCAG AA/AAA compliant
│   • World-class accessibility      │     • Keyboard navigation
│   • Cross-browser compatibility    │     • Screen reader support
│   • Battle-tested                  │     • Touch/pointer events
└─────────────────────────────────────┘
```

### **Why This Architecture?**

1. **Accessibility**: React Aria provides Adobe-quality accessibility primitives
2. **Flexibility**: Users can use styled components OR headless primitives
3. **Customization**: Full control when needed, convenience by default
4. **Maintainability**: Clear separation of concerns
5. **Future-proof**: Easy to update styling without breaking behavior

### **File Structure Per Component**

Each component follows this exact structure:

```
packages/react/src/components/Button/
├── ButtonHeadless.tsx      # Layer 2: React Aria wrapper (unstyled)
├── Button.variants.ts      # CVA variant definitions
├── Button.tsx              # Layer 3: MD3 styled component
├── Button.types.ts         # TypeScript interfaces
├── Button.test.tsx         # Comprehensive tests
├── Button.stories.tsx      # Storybook stories
└── index.ts                # Public exports
```

### **Key Technologies**

- **React Aria** (`react-aria`): Accessibility hooks and primitives
- **React Aria Components** (`react-aria-components`): Pre-built accessible components
- **CVA** (`class-variance-authority`): Type-safe variant management
- **Tailwind CSS v4**: Utility-first styling with MD3 tokens
- **clsx + tailwind-merge**: Smart className merging

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

## 🎨 Implementation Approach

### **Layer 1: React Aria Hooks (Foundation)**

React Aria provides the accessibility foundation:

```typescript
// Example: Using React Aria hooks in headless component
import { useButton } from 'react-aria';
import type { AriaButtonProps } from 'react-aria';

// React Aria handles:
// - Keyboard interactions (Enter, Space)
// - Focus management
// - Disabled states
// - ARIA attributes
// - Touch/pointer events
// - Screen reader support
```

### **Layer 2: Headless Primitive**

Unstyled, behavior-only component using React Aria:

```typescript
// ButtonHeadless.tsx
import { useRef } from 'react';
import { useButton } from 'react-aria';
import type { AriaButtonProps } from 'react-aria';

interface ButtonHeadlessProps extends AriaButtonProps {
  className?: string;
  children: React.ReactNode;
}

export function ButtonHeadless(props: ButtonHeadlessProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const { buttonProps } = useButton(props, ref);

  return (
    <button {...buttonProps} ref={ref} className={props.className}>
      {props.children}
    </button>
  );
}
```

### **Layer 3: CVA Variants**

Type-safe variant management using CVA:

```typescript
// Button.variants.ts
import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariants = cva(
  // Base styles (always applied)
  [
    'relative inline-flex items-center justify-center',
    'font-medium transition-all',
    'focus-visible:outline-2 focus-visible:outline-offset-2',
    'disabled:opacity-38 disabled:pointer-events-none',
  ],
  {
    variants: {
      variant: {
        filled: 'shadow-none hover:shadow-md',
        outlined: 'bg-transparent border border-outline',
        tonal: '',
        elevated: 'shadow-elevation-1 hover:shadow-elevation-2',
        text: 'bg-transparent',
      },
      color: {
        primary: '',
        secondary: '',
        tertiary: '',
        error: '',
      },
      size: {
        small: 'h-10 px-4 text-sm gap-2 rounded-full',
        medium: 'h-12 px-6 text-base gap-2 rounded-full',
        large: 'h-14 px-8 text-lg gap-3 rounded-full',
      },
    },
    compoundVariants: [
      // Filled variants with colors
      {
        variant: 'filled',
        color: 'primary',
        className: 'bg-primary text-on-primary hover:bg-primary/90',
      },
      {
        variant: 'filled',
        color: 'secondary',
        className: 'bg-secondary text-on-secondary hover:bg-secondary/90',
      },
      {
        variant: 'filled',
        color: 'tertiary',
        className: 'bg-tertiary text-on-tertiary hover:bg-tertiary/90',
      },
      {
        variant: 'filled',
        color: 'error',
        className: 'bg-error text-on-error hover:bg-error/90',
      },
      // Outlined variants with colors
      {
        variant: 'outlined',
        color: 'primary',
        className: 'text-primary hover:bg-primary/10',
      },
      {
        variant: 'outlined',
        color: 'secondary',
        className: 'text-secondary hover:bg-secondary/10',
      },
      {
        variant: 'outlined',
        color: 'tertiary',
        className: 'text-tertiary hover:bg-tertiary/10',
      },
      {
        variant: 'outlined',
        color: 'error',
        className: 'text-error hover:bg-error/10',
      },
      // Tonal variants with colors
      {
        variant: 'tonal',
        color: 'primary',
        className: 'bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80',
      },
      {
        variant: 'tonal',
        color: 'secondary',
        className: 'bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80',
      },
      {
        variant: 'tonal',
        color: 'tertiary',
        className: 'bg-tertiary-container text-on-tertiary-container hover:bg-tertiary-container/80',
      },
      {
        variant: 'tonal',
        color: 'error',
        className: 'bg-error-container text-on-error-container hover:bg-error-container/80',
      },
      // Elevated variants with colors
      {
        variant: 'elevated',
        color: 'primary',
        className: 'bg-surface-container-low text-primary hover:shadow-elevation-2',
      },
      {
        variant: 'elevated',
        color: 'secondary',
        className: 'bg-surface-container-low text-secondary hover:shadow-elevation-2',
      },
      {
        variant: 'elevated',
        color: 'tertiary',
        className: 'bg-surface-container-low text-tertiary hover:shadow-elevation-2',
      },
      {
        variant: 'elevated',
        color: 'error',
        className: 'bg-surface-container-low text-error hover:shadow-elevation-2',
      },
      // Text variants with colors
      {
        variant: 'text',
        color: 'primary',
        className: 'text-primary hover:bg-primary/10',
      },
      {
        variant: 'text',
        color: 'secondary',
        className: 'text-secondary hover:bg-secondary/10',
      },
      {
        variant: 'text',
        color: 'tertiary',
        className: 'text-tertiary hover:bg-tertiary/10',
      },
      {
        variant: 'text',
        color: 'error',
        className: 'text-error hover:bg-error/10',
      },
    ],
    defaultVariants: {
      variant: 'filled',
      color: 'primary',
      size: 'medium',
    },
  }
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;
```

### **Layer 3: MD3 Styled Component**

Combines headless primitive + CVA variants:

```typescript
// Button.tsx
'use client';

import { forwardRef } from 'react';
import { ButtonHeadless } from './ButtonHeadless';
import { buttonVariants, type ButtonVariants } from './Button.variants';
import { cn } from '../../utils/cn';
import { useRipple } from '../../hooks/useRipple';
import type { ButtonProps } from './Button.types';

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonProps & ButtonVariants
>(({ variant, color, size, className, icon, children, loading, disableRipple, ...props }, ref) => {
  const { ripples, rippleRef } = useRipple({ disabled: props.disabled || loading, disableRipple });

  return (
    <ButtonHeadless
      {...props}
      ref={ref}
      className={cn(
        buttonVariants({ variant, color, size }),
        className
      )}
    >
      {loading && <Spinner />}
      {icon && !loading && <span className="icon">{icon}</span>}
      {children}
      {ripples}
    </ButtonHeadless>
  );
});

Button.displayName = 'Button';
```

---

## 🔧 Implementation Guidelines

### **DO's**

✅ **Use React Aria for all interactive components**
- Provides battle-tested accessibility
- Handles keyboard, mouse, touch, screen readers
- Cross-browser compatible

✅ **Use CVA for all variant styling**
- Type-safe variants
- Compound variants for complex combinations
- IntelliSense support

✅ **Export both headless and styled versions**
```typescript
export { Button } from './Button';           // Styled
export { ButtonHeadless } from './ButtonHeadless'; // Headless
export { buttonVariants } from './Button.variants'; // CVA
```

✅ **Follow three-layer architecture**
- React Aria → Headless → Styled
- Keep each layer focused and testable

✅ **Use `cn()` utility for className merging**
- Combines clsx + tailwind-merge
- Prevents Tailwind class conflicts

### **DON'Ts**

❌ **Don't implement accessibility manually**
- Use React Aria hooks instead
- Don't reinvent keyboard handling
- Don't manually manage ARIA attributes

❌ **Don't use manual class maps**
```typescript
// ❌ BAD: Manual class maps
const variantClasses = {
  filled: 'bg-primary text-on-primary',
  outlined: 'border border-outline',
};

// ✅ GOOD: Use CVA
export const buttonVariants = cva('base', {
  variants: { variant: { filled: '...', outlined: '...' } }
});
```

❌ **Don't skip the headless layer**
- Always provide unstyled version
- Enables advanced customization

❌ **Don't hardcode default values in component**
```typescript
// ❌ BAD
function Button({ variant = 'filled', ...props }) { }

// ✅ GOOD: Define in CVA defaultVariants
export const buttonVariants = cva('base', {
  variants: { ... },
  defaultVariants: { variant: 'filled' }
});
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

## 📝 Refactoring Plan

### **Current Button Implementation**

The existing `Button.tsx` was implemented with a **simple, single-layer approach**:
- ❌ Manual accessibility implementation
- ❌ Manual class maps (not using CVA)
- ❌ No headless layer
- ❌ No React Aria foundation

### **Required Refactoring**

To align with our three-layer architecture, we need to:

1. **Install Dependencies** ✅ DONE
   - `react-aria` - Accessibility hooks
   - `react-aria-components` - Pre-built components
   - `class-variance-authority` - Already installed

2. **Refactor Button Component** 🔄 PENDING
   - Create `ButtonHeadless.tsx` using React Aria
   - Create `Button.variants.ts` using CVA
   - Refactor `Button.tsx` to use headless + variants
   - Update tests to cover all layers
   - Update stories to showcase flexibility

3. **Update Button Types** 🔄 PENDING
   - Extend `AriaButtonProps` from React Aria
   - Add variant types from CVA
   - Keep existing prop interface

4. **Verify Functionality** 🔄 PENDING
   - Run existing tests (should still pass)
   - Run Storybook (styling should work)
   - Verify accessibility with screen reader
   - Check keyboard navigation

### **Implementation Order**

```
Task 1.1.1: Refactor Button Component
├── Step 1: Create ButtonHeadless.tsx (React Aria)
├── Step 2: Create Button.variants.ts (CVA)
├── Step 3: Refactor Button.tsx (combine layers)
├── Step 4: Update Button.types.ts (extend AriaButtonProps)
├── Step 5: Update tests
├── Step 6: Update stories
└── Step 7: Verify & document

Task 1.2: Implement IconButton (using new pattern)
Task 1.3: Implement FAB (using new pattern)
```

---

## 🎓 Summary

We've defined comprehensive TypeScript APIs for all three button components **with three-layer architecture**:

### **Components**
- **Button**: 5 variants, optional icons, text required  
- **IconButton**: 4 variants, icon only, aria-label required  
- **FAB**: 4 sizes, icon required, aria-label required, fixed positioning

### **Architecture**
- **Layer 1**: React Aria hooks (accessibility foundation)
- **Layer 2**: Headless primitives (unstyled, behavior-only)
- **Layer 3**: MD3 styled components (CVA variants + Tailwind)

### **Key Features**
- ✅ **World-class accessibility** (React Aria by Adobe)
- ✅ **Type-safe variants** (CVA with IntelliSense)
- ✅ **Maximum flexibility** (use styled OR headless)
- ✅ **Consistent patterns** across all components
- ✅ **Battle-tested foundation** (React Aria)

### **Technologies**
- ✅ `react-aria` + `react-aria-components` - Accessibility
- ✅ `class-variance-authority` - Variant management
- ✅ `clsx` + `tailwind-merge` - ClassName utilities
- ✅ Tailwind CSS v4 - Styling with MD3 tokens

---

## 🚨 Important Notes

### **Breaking Change from Initial Implementation**

The Button component implemented in Task 1.1 **does NOT follow this architecture** and needs refactoring:
- ❌ Uses manual accessibility (should use React Aria)
- ❌ Uses manual class maps (should use CVA)
- ❌ Single-layer design (should be three-layer)

**Action Required**: Refactor Task 1.1 Button before proceeding to IconButton and FAB.

### **Going Forward**

All future component implementations **MUST follow**:
1. ✅ Use React Aria for accessibility
2. ✅ Use CVA for variant management
3. ✅ Implement three-layer architecture
4. ✅ Export both headless and styled versions
5. ✅ Test all three layers independently

---

**Task Status**: ✅ Complete (Architecture Defined)  
**Next Task**: 1.1.1 - Refactor Button Component (Three-Layer Architecture)  
**Then**: 1.2 - Implement IconButton | 1.3 - Implement FAB

