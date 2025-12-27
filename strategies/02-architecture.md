# Architecture Strategy

> **Status**: ✅ Decided  
> **Last Updated**: December 24, 2025

## 🎯 Overview

This document defines the project structure, component architecture, and code organization patterns for TinyBigUI.

---

## 📁 Project Structure

### Monorepo vs Single Repo

**Decision**: Start with **single repo**, evolve to monorepo if needed

**Rationale**:
- Simpler for initial open source setup
- Easier onboarding for contributors
- Single package distribution simplifies publishing
- Can migrate to monorepo later if we add docs site, CLI tools, etc.

### Directory Structure

```
tinybigui/
├── src/
│   ├── components/
│   │   ├── button/
│   │   │   ├── button-headless.tsx      # Headless primitive
│   │   │   ├── button.tsx               # MD3 styled version
│   │   │   ├── button.variants.ts       # CVA variants
│   │   │   ├── button.types.ts          # TypeScript types
│   │   │   ├── button.stories.tsx       # Storybook stories
│   │   │   ├── button.test.tsx          # Tests
│   │   │   └── index.ts                 # Public exports
│   │   ├── icon-button/
│   │   ├── fab/
│   │   └── ... (other components)
│   │
│   ├── hooks/
│   │   ├── use-theme.ts                 # Theme management
│   │   ├── use-ripple.ts                # MD3 ripple effect
│   │   └── index.ts
│   │
│   ├── styles/
│   │   ├── globals.css                  # Base styles
│   │   ├── tokens.css                   # MD3 design tokens
│   │   └── animations.css               # MD3 motion
│   │
│   ├── utils/
│   │   ├── cn.ts                        # className utility (clsx + tw-merge)
│   │   ├── color.ts                     # MD3 color utilities
│   │   └── index.ts
│   │
│   ├── types/
│   │   ├── theme.ts                     # Theme types
│   │   └── index.ts
│   │
│   └── index.ts                          # Main entry point
│
├── .storybook/
│   ├── main.ts
│   ├── preview.tsx
│   └── theme.ts                          # MD3 Storybook theme
│
├── tests/
│   ├── setup.ts                          # Test setup
│   └── utils.tsx                         # Test utilities
│
├── tailwind.config.ts                    # Tailwind config for dev
├── tailwind.preset.js                    # Preset for users (shipped)
├── tsup.config.ts                        # Build configuration
├── vitest.config.ts                      # Test configuration
├── package.json
├── README.md
└── strategies/                           # Strategy documents
```

---

## 🧱 Component Architecture

### Layered Architecture

TinyBigUI uses a **three-layer architecture**:

```
┌─────────────────────────────────────┐
│   Layer 3: MD3 Styled Components   │  ← What users typically use
│   (button.tsx, text-field.tsx)    │
└─────────────────────────────────────┘
              ↓ uses
┌─────────────────────────────────────┐
│   Layer 2: Headless Primitives     │  ← Advanced users/customization
│   (button-headless.tsx)            │
└─────────────────────────────────────┘
              ↓ uses
┌─────────────────────────────────────┐
│   Layer 1: React Aria Hooks        │  ← Foundation
│   (useButton, useFocusRing, etc.)  │
└─────────────────────────────────────┘
```

### Component Template

Every component follows this structure:

#### 1. Headless Primitive (`button-headless.tsx`)

```typescript
// No 'use client' directive - RSC compatible
import { useButton } from 'react-aria'
import { ButtonProps } from './button.types'

export function ButtonHeadless(props: ButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const { buttonProps } = useButton(props, ref)
  
  return (
    <button
      {...buttonProps}
      ref={ref}
      className={props.className}
    >
      {props.children}
    </button>
  )
}
```

#### 2. Variants Definition (`button.variants.ts`)

```typescript
import { cva, type VariantProps } from 'class-variance-authority'

export const buttonVariants = cva(
  // Base styles (always applied)
  'inline-flex items-center justify-center rounded-full font-medium transition-all',
  {
    variants: {
      variant: {
        filled: 'bg-primary text-on-primary hover:shadow-md',
        outlined: 'border-2 border-outline text-primary',
        text: 'text-primary hover:bg-primary/10',
      },
      size: {
        small: 'h-10 px-4 text-sm',
        medium: 'h-12 px-6 text-base',
        large: 'h-14 px-8 text-lg',
      },
      disabled: {
        true: 'opacity-38 cursor-not-allowed pointer-events-none',
      },
    },
    defaultVariants: {
      variant: 'filled',
      size: 'medium',
    },
  }
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
```

#### 3. MD3 Styled Component (`button.tsx`)

```typescript
'use client'

import { forwardRef } from 'react'
import { ButtonHeadless } from './button-headless'
import { buttonVariants, type ButtonVariants } from './button.variants'
import { cn } from '../../utils/cn'
import type { ButtonProps } from './button.types'

export interface StyledButtonProps extends ButtonProps, ButtonVariants {}

export const Button = forwardRef<HTMLButtonElement, StyledButtonProps>(
  ({ variant, size, className, ...props }, ref) => {
    return (
      <ButtonHeadless
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'
```

#### 4. Type Definitions (`button.types.ts`)

```typescript
import { AriaButtonProps } from 'react-aria'

export interface ButtonProps extends AriaButtonProps {
  /**
   * The visual appearance of the button
   * @default 'filled'
   */
  variant?: 'filled' | 'outlined' | 'text'
  
  /**
   * The size of the button
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large'
  
  /**
   * Optional icon to display before the button text
   */
  startIcon?: React.ReactNode
  
  /**
   * Optional icon to display after the button text
   */
  endIcon?: React.ReactNode
  
  /**
   * Whether the button should take full width
   * @default false
   */
  fullWidth?: boolean
}
```

#### 5. Public Exports (`index.ts`)

```typescript
export { Button } from './button'
export { ButtonHeadless } from './button-headless'
export { buttonVariants } from './button.variants'
export type { ButtonProps, StyledButtonProps } from './button.types'
export type { ButtonVariants } from './button.variants'
```

---

## 🔧 Utility Functions

### className Utility (`utils/cn.ts`)

```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines className values using clsx and merges Tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Usage**: Prevents Tailwind class conflicts when merging user classes

---

## 🎨 Design Token System

### CSS Variables Strategy

MD3 design tokens will be defined as CSS variables:

```css
/* styles/tokens.css */
:root {
  /* Primary Colors */
  --md-sys-color-primary: #6750a4;
  --md-sys-color-on-primary: #ffffff;
  --md-sys-color-primary-container: #eaddff;
  --md-sys-color-on-primary-container: #21005e;
  
  /* Surface Colors */
  --md-sys-color-surface: #fffbfe;
  --md-sys-color-on-surface: #1c1b1f;
  
  /* Elevation */
  --md-sys-elevation-level0: 0px 0px 0px 0px rgba(0,0,0,0);
  --md-sys-elevation-level1: 0px 1px 3px 1px rgba(0,0,0,0.15);
  
  /* Typography */
  --md-sys-typescale-label-large-font: 'Roboto', sans-serif;
  --md-sys-typescale-label-large-size: 0.875rem;
  --md-sys-typescale-label-large-weight: 500;
  
  /* Motion */
  --md-sys-motion-duration-short1: 50ms;
  --md-sys-motion-duration-short2: 100ms;
  --md-sys-motion-duration-medium1: 250ms;
  --md-sys-motion-easing-standard: cubic-bezier(0.2, 0.0, 0, 1.0);
}
```

### Tailwind Integration

```javascript
// tailwind.preset.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: 'var(--md-sys-color-primary)',
        'on-primary': 'var(--md-sys-color-on-primary)',
        // ... all MD3 color tokens
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
      boxShadow: {
        'elevation-1': 'var(--md-sys-elevation-level1)',
        // ... all elevation levels
      },
    },
  },
}
```

---

## 📝 Naming Conventions

### Files
- Components: `kebab-case.tsx` (e.g., `button.tsx`, `text-field.tsx`)
- Types: `*.types.ts`
- Variants: `*.variants.ts`
- Tests: `*.test.tsx`
- Stories: `*.stories.tsx`

### Components
- Styled: `PascalCase` (e.g., `Button`, `TextField`)
- Headless: `PascalCase + Headless` (e.g., `ButtonHeadless`)
- Hooks: `camelCase with use prefix` (e.g., `useTheme`, `useRipple`)

### Exports
- Named exports only (no default exports)
- Main entry point re-exports all public APIs

---

## 🔒 Public API Surface

### What Gets Exported

```typescript
// src/index.ts
export * from './components/button'
export * from './components/icon-button'
export * from './components/fab'
// ... all components

export * from './hooks'
export * from './utils/cn'
export * from './types'

// CSS must be imported separately by users
// import 'tinybigui/styles.css'
```

### What Stays Internal

- Component implementation details
- Internal utilities not meant for users
- Test utilities
- Storybook configurations

---

## 🧪 Testing Strategy

### Test Structure

```typescript
// button.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from '@axe-core/react'
import { Button } from './button'

describe('Button', () => {
  describe('Rendering', () => {
    it('renders with default props', () => { })
    it('renders with all variants', () => { })
  })
  
  describe('Interactions', () => {
    it('handles click events', async () => { })
    it('handles keyboard navigation', async () => { })
  })
  
  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<Button>Click me</Button>)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })
  
  describe('Customization', () => {
    it('merges custom className', () => { })
  })
})
```

---

## 🚀 Tree-Shaking Strategy

### How It Works

1. **Named exports only**: Enables tree-shaking
2. **Separate component files**: Bundler can exclude unused components
3. **`sideEffects: false`**: Tells bundlers all code is side-effect free
4. **ESM format**: Modern bundlers optimize ESM better

### Example

```typescript
// User imports only Button
import { Button } from 'tinybigui'

// Bundler includes ONLY:
// - button/* files
// - shared utilities (cn, variants)
// - React Aria hooks used by Button

// Excludes everything else ✅
```

---

## 🔄 Future Considerations

### Potential Monorepo Migration

If we add:
- Separate docs site
- CLI tools for scaffolding
- Multiple framework support (Vue, Svelte)

Then migrate to:

```
packages/
├── core/           # Headless primitives
├── react/          # React implementation
├── docs/           # Documentation site
└── cli/            # CLI tools
```

### Component Composition

As library grows, create higher-level composed components:

```
src/
├── primitives/     # Basic components
└── composed/       # Complex composed components
    ├── dialog/
    ├── data-table/
    └── date-picker/
```

---

## 📊 Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| Three-layer architecture | Flexibility for all user types |
| Headless + Styled exports | Users choose their level |
| CVA for variants | Type-safe, performant, great DX |
| CSS variables for tokens | Runtime theming, easy overrides |
| Named exports only | Better tree-shaking |
| Separate files per concern | Better code organization |
| 'use client' explicit | Clear RSC boundaries |

---

## 🔗 References

- [React Aria Architecture](https://react-spectrum.adobe.com/architecture.html)
- [CVA Patterns](https://cva.style/docs/getting-started/variants)
- [Tree Shaking Guide](https://webpack.js.org/guides/tree-shaking/)

