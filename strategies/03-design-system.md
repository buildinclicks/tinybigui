# Material Design 3 Implementation Strategy

> **Status**: ✅ Decided  
> **Last Updated**: December 24, 2025

## 🎯 Overview

This document defines how we will implement **Material Design 3 (MD3)** specifications in TinyBigUI, including design tokens, components, motion, and theming.

---

## 📐 Material Design 3 Foundations

### Design Tokens

MD3 is built on a systematic token-based approach. We will implement all MD3 token categories:

#### 1. Color Tokens

**Color Roles** (all must be implemented):

```typescript
// MD3 Color System
interface MD3ColorScheme {
  // Primary
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;

  // Secondary
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;

  // Tertiary
  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;

  // Error
  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;

  // Surface
  surface: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;

  // Background
  background: string;
  onBackground: string;

  // Outline
  outline: string;
  outlineVariant: string;

  // Other
  shadow: string;
  scrim: string;
  inverseSurface: string;
  inverseOnSurface: string;
  inversePrimary: string;
}
```

**Implementation**:

```css
/* Light Theme */
:root {
  --md-sys-color-primary: #6750a4;
  --md-sys-color-on-primary: #ffffff;
  /* ... all color tokens */
}

/* Dark Theme */
[data-theme="dark"] {
  --md-sys-color-primary: #d0bcff;
  --md-sys-color-on-primary: #381e72;
  /* ... all color tokens */
}
```

#### 2. Typography Tokens

MD3 Typography Scale:

```css
:root {
  /* Display */
  --md-sys-typescale-display-large: 57px / 64px "Roboto";
  --md-sys-typescale-display-medium: 45px / 52px "Roboto";
  --md-sys-typescale-display-small: 36px / 44px "Roboto";

  /* Headline */
  --md-sys-typescale-headline-large: 32px / 40px "Roboto";
  --md-sys-typescale-headline-medium: 28px / 36px "Roboto";
  --md-sys-typescale-headline-small: 24px / 32px "Roboto";

  /* Title */
  --md-sys-typescale-title-large: 22px / 28px "Roboto";
  --md-sys-typescale-title-medium: 16px / 24px "Roboto" (500 weight);
  --md-sys-typescale-title-small: 14px / 20px "Roboto" (500 weight);

  /* Label */
  --md-sys-typescale-label-large: 14px / 20px "Roboto" (500 weight);
  --md-sys-typescale-label-medium: 12px / 16px "Roboto" (500 weight);
  --md-sys-typescale-label-small: 11px / 16px "Roboto" (500 weight);

  /* Body */
  --md-sys-typescale-body-large: 16px / 24px "Roboto";
  --md-sys-typescale-body-medium: 14px / 20px "Roboto";
  --md-sys-typescale-body-small: 12px / 16px "Roboto";
}
```

#### 3. Elevation Tokens

MD3 uses elevation levels 0-5:

```css
:root {
  --md-sys-elevation-level0: none;
  --md-sys-elevation-level1:
    0px 1px 2px 0px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15);
  --md-sys-elevation-level2:
    0px 1px 2px 0px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15);
  --md-sys-elevation-level3:
    0px 1px 3px 0px rgba(0, 0, 0, 0.3), 0px 4px 8px 3px rgba(0, 0, 0, 0.15);
  --md-sys-elevation-level4:
    0px 2px 3px 0px rgba(0, 0, 0, 0.3), 0px 6px 10px 4px rgba(0, 0, 0, 0.15);
  --md-sys-elevation-level5:
    0px 4px 4px 0px rgba(0, 0, 0, 0.3), 0px 8px 12px 6px rgba(0, 0, 0, 0.15);
}
```

#### 4. Shape Tokens

MD3 Shape System:

```css
:root {
  /* Corners */
  --md-sys-shape-corner-none: 0px;
  --md-sys-shape-corner-extra-small: 4px;
  --md-sys-shape-corner-small: 8px;
  --md-sys-shape-corner-medium: 12px;
  --md-sys-shape-corner-large: 16px;
  --md-sys-shape-corner-extra-large: 28px;
  --md-sys-shape-corner-full: 9999px;
}
```

#### 5. Motion Tokens

MD3 Motion System:

```css
:root {
  /* Duration */
  --md-sys-motion-duration-short1: 50ms;
  --md-sys-motion-duration-short2: 100ms;
  --md-sys-motion-duration-short3: 150ms;
  --md-sys-motion-duration-short4: 200ms;
  --md-sys-motion-duration-medium1: 250ms;
  --md-sys-motion-duration-medium2: 300ms;
  --md-sys-motion-duration-medium3: 350ms;
  --md-sys-motion-duration-medium4: 400ms;
  --md-sys-motion-duration-long1: 450ms;
  --md-sys-motion-duration-long2: 500ms;
  --md-sys-motion-duration-long3: 550ms;
  --md-sys-motion-duration-long4: 600ms;

  /* Easing */
  --md-sys-motion-easing-standard: cubic-bezier(0.2, 0, 0, 1);
  --md-sys-motion-easing-standard-accelerate: cubic-bezier(0.3, 0, 1, 1);
  --md-sys-motion-easing-standard-decelerate: cubic-bezier(0, 0, 0, 1);
  --md-sys-motion-easing-emphasized: cubic-bezier(0.2, 0, 0, 1);
  --md-sys-motion-easing-emphasized-accelerate: cubic-bezier(0.3, 0, 0.8, 0.15);
  --md-sys-motion-easing-emphasized-decelerate: cubic-bezier(0.05, 0.7, 0.1, 1);
}
```

---

## 🧱 Component Implementation Plan

### Phase 1: Button Components (Start Here)

| Component            | MD3 Spec               | Variants                                 | Priority    |
| -------------------- | ---------------------- | ---------------------------------------- | ----------- |
| **Button**           | Common buttons         | Filled, Outlined, Text, Elevated, Tonal  | 🔴 Critical |
| **Icon Button**      | Icon buttons           | Filled, Outlined, Standard, Filled Tonal | 🔴 Critical |
| **FAB**              | Floating action button | Small, Medium, Large, Extended           | 🟡 High     |
| **Segmented Button** | Segmented buttons      | Single-select, Multi-select              | 🟢 Medium   |

### Phase 2: Input Components

| Component      | MD3 Spec      | Variants                | Priority    |
| -------------- | ------------- | ----------------------- | ----------- |
| **Text Field** | Text fields   | Filled, Outlined        | 🔴 Critical |
| **Checkbox**   | Checkboxes    | Standard, Indeterminate | 🔴 Critical |
| **Radio**      | Radio buttons | Standard                | 🔴 Critical |
| **Switch**     | Switches      | Standard                | 🔴 Critical |
| **Slider**     | Sliders       | Continuous, Discrete    | 🟡 High     |

### Phase 3: Selection Components

| Component  | MD3 Spec               | Variants                          | Priority |
| ---------- | ---------------------- | --------------------------------- | -------- |
| **Chip**   | Chips                  | Assist, Filter, Input, Suggestion | 🟡 High  |
| **Menu**   | Menus                  | Standard                          | 🟡 High  |
| **Select** | Menus (select variant) | Filled, Outlined                  | 🟡 High  |

### Phase 4: Feedback Components

| Component              | MD3 Spec            | Variants         | Priority  |
| ---------------------- | ------------------- | ---------------- | --------- |
| **Progress Indicator** | Progress indicators | Linear, Circular | 🟡 High   |
| **Snackbar**           | Snackbars           | Standard, Action | 🟡 High   |
| **Badge**              | Badges              | Small, Large     | 🟢 Medium |
| **Tooltip**            | Tooltips            | Plain            | 🟢 Medium |

---

## 🎨 Theming Strategy

### Theme Provider

```typescript
"use client";

import { createContext, useContext } from "react";

interface ThemeContextValue {
  mode: "light" | "dark";
  setMode: (mode: "light" | "dark") => void;
  colorScheme: MD3ColorScheme;
  setColorScheme: (scheme: Partial<MD3ColorScheme>) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Implementation
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
```

### Dynamic Color

MD3's key feature is **dynamic color** - generating color schemes from a seed color:

```typescript
// utils/color.ts
export function generateColorScheme(seedColor: string): MD3ColorScheme {
  // Use Material Color Utilities to generate full scheme
  // https://github.com/material-foundation/material-color-utilities
}
```

**Decision**: Use `@material/material-color-utilities` for accurate color generation.

### User Customization

Users can customize theme in three ways:

#### 1. CSS Variables Override

```css
/* User's global.css */
:root {
  --md-sys-color-primary: #your-brand-color;
  /* Other tokens auto-adjust if using dynamic color */
}
```

#### 2. Tailwind Config Extension

```javascript
// User's tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: "#your-brand-color",
      },
    },
  },
};
```

#### 3. Theme Provider

```tsx
<ThemeProvider defaultMode="light" seedColor="#your-brand-color">
  <App />
</ThemeProvider>
```

---

## ✨ MD3 Interactions

### State Layers

MD3 uses state layers for hover/focus/press states:

```css
.md-button {
  position: relative;
  overflow: hidden;
}

.md-button::before {
  content: "";
  position: absolute;
  inset: 0;
  background: currentColor;
  opacity: 0;
  transition: opacity var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
}

.md-button:hover::before {
  opacity: 0.08; /* MD3 spec: 8% opacity for hover */
}

.md-button:focus-visible::before {
  opacity: 0.12; /* 12% for focus */
}

.md-button:active::before {
  opacity: 0.12; /* 12% for press */
}
```

### Ripple Effect

MD3's signature ripple animation:

```typescript
// hooks/use-ripple.ts
export function useRipple() {
  return {
    onPointerDown: (e: PointerEvent) => {
      // Create ripple element at touch/click point
      // Animate using MD3 motion tokens
      // Remove after animation
    },
  };
}
```

**Implementation**: Will create a lightweight ripple implementation following MD3 specs.

---

## 📏 Spacing & Layout

### MD3 Spacing Scale

```css
:root {
  --md-sys-spacing-0: 0px;
  --md-sys-spacing-1: 4px;
  --md-sys-spacing-2: 8px;
  --md-sys-spacing-3: 12px;
  --md-sys-spacing-4: 16px;
  --md-sys-spacing-5: 20px;
  --md-sys-spacing-6: 24px;
  --md-sys-spacing-8: 32px;
  --md-sys-spacing-10: 40px;
  --md-sys-spacing-12: 48px;
}
```

Map to Tailwind:

```javascript
// Tailwind v4 is CSS-first — spacing tokens are provided via CSS variables and
// mapped in @tinybigui/tokens/tokens.css (via @theme / @utility where needed).
spacing: {
  0: 'var(--md-sys-spacing-0)',
  1: 'var(--md-sys-spacing-1)',
  2: 'var(--md-sys-spacing-2)',
  // ... etc
}
```

---

## 🔤 Typography Components

Export typography utilities:

```typescript
// components/typography/
export function DisplayLarge({ children, ...props }) {
  return <h1 className="text-display-large" {...props}>{children}</h1>
}

export function HeadlineMedium({ children, ...props }) {
  return <h2 className="text-headline-medium" {...props}>{children}</h2>
}

// ... all typescale levels
```

---

## 🎭 Component State Mapping

MD3 defines specific states for all interactive components:

| MD3 State | Implementation                  |
| --------- | ------------------------------- |
| Enabled   | Default state                   |
| Disabled  | `disabled` prop + opacity: 0.38 |
| Hovered   | `:hover` + state layer          |
| Focused   | `:focus-visible` + focus ring   |
| Pressed   | `:active` + state layer         |
| Dragged   | Custom logic per component      |

---

## 🌙 Dark Mode Strategy

### Automatic Dark Mode

```typescript
export function ThemeProvider({ children, defaultMode = "auto" }) {
  // 'auto' respects system preference
  const [mode, setMode] = useState<"light" | "dark" | "auto">(defaultMode);

  useEffect(() => {
    if (mode === "auto") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      // Listen for changes
    }
  }, [mode]);
}
```

### Dark Theme Adjustments

MD3 dark theme isn't just inverted colors:

- Surface elevations use lighter tints (not shadows)
- Different color contrast ratios
- Adjusted opacity values

All specified in MD3 docs and implemented via CSS variables.

---

## 📋 Implementation Checklist

### Token System

- [ ] Color tokens (all 25 color roles)
- [ ] Typography tokens (13 type scales)
- [ ] Elevation tokens (6 levels)
- [ ] Shape tokens (7 corner sizes)
- [ ] Motion tokens (durations + easings)
- [ ] Spacing tokens

### Theming

- [ ] ThemeProvider component
- [ ] useTheme hook
- [ ] Dynamic color generation
- [ ] Light/Dark mode switching
- [ ] CSS variable system

### Interactions

- [ ] State layers implementation
- [ ] Ripple effect hook
- [ ] Focus indicators
- [ ] Hover/press states

### Components

- [ ] Follow MD3 specs exactly
- [ ] Implement all variants per spec
- [ ] State layer on all interactive components
- [ ] Proper elevation usage

---

## 🔗 References

- [Material Design 3](https://m3.material.io/)
- [MD3 Color System](https://m3.material.io/styles/color/overview)
- [MD3 Typography](https://m3.material.io/styles/typography/overview)
- [MD3 Motion](https://m3.material.io/styles/motion/overview)
- [Material Color Utilities](https://github.com/material-foundation/material-color-utilities)
- [MD3 Components](https://m3.material.io/components)
