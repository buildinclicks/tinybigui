# @tinybigui/tokens

> Material Design 3 design tokens for TinyBigUI

[![npm version](https://img.shields.io/npm/v/@tinybigui/tokens.svg?style=flat-square)](https://www.npmjs.com/package/@tinybigui/tokens)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@tinybigui/tokens?style=flat-square)](https://bundlephobia.com/package/@tinybigui/tokens)

A comprehensive collection of Material Design 3 design tokens implemented as CSS custom properties. Framework-agnostic and ready to use in any web project.

---

## ⚠️ Status

> **Pre-release: v0.0.x**
>
> This package is complete and approaching its first public release (**v0.1.0**). It is **not yet published to npm**.
>
> Follow our [GitHub repository](https://github.com/buildinclicks/tinybigui) for updates!

---

## 🎨 What Are Design Tokens?

Design tokens are the **visual design atoms** of a design system. They're named entities that store visual design attributes like colors, typography, spacing, and more.

**Think of them as variables for your design system:**

- Instead of `#6750a4`, use `var(--md-sys-color-primary)`
- Instead of `16px`, use `var(--md-sys-typescale-body-large-size)`
- Change once, update everywhere!

---

## ✨ Features

- 🎨 **120 Design Tokens** - Complete Material Design 3 token system
- 🌙 **Light & Dark Mode** - Automatic theme switching
- 🎯 **Standards-Based** - Follows MD3 specifications exactly
- 📦 **Framework Agnostic** - Use with React, Vue, Angular, or vanilla JS
- 🚀 **Tailwind Integration** - Works seamlessly with Tailwind CSS v4
- 🔧 **Customizable** - Override tokens for custom themes
- 📱 **Responsive** - Typography scales for all screen sizes
- ♿ **Accessible** - WCAG-compliant color contrast ratios
- 🎨 **CSS Variables** - Native CSS custom properties
- 📦 **Lightweight** - ~5KB gzipped

---

## 📦 Installation

> **v0.1.0 is in preparation.** This package will be available on npm as part of the upcoming v0.1.0 release.

```bash
npm install @tinybigui/tokens
# or
pnpm add @tinybigui/tokens
# or
yarn add @tinybigui/tokens
```

---

## 🚀 Quick Start

### 1. Import in CSS

```css
@import "@tinybigui/tokens";
```

### 2. Import in JavaScript

```js
import "@tinybigui/tokens";
```

### 3. Use the Tokens

```css
.my-component {
  background: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
  border-radius: var(--md-sys-shape-corner-medium);
  box-shadow: var(--md-sys-elevation-level-2);
}
```

---

## 🎨 Available Tokens

### Colors (29 tokens)

Material Design 3 color system with light and dark variants:

```css
/* Primary colors */
--md-sys-color-primary
--md-sys-color-on-primary
--md-sys-color-primary-container
--md-sys-color-on-primary-container

/* Secondary colors */
--md-sys-color-secondary
--md-sys-color-on-secondary
--md-sys-color-secondary-container
--md-sys-color-on-secondary-container

/* Tertiary colors */
--md-sys-color-tertiary
--md-sys-color-on-tertiary
--md-sys-color-tertiary-container
--md-sys-color-on-tertiary-container

/* Error colors */
--md-sys-color-error
--md-sys-color-on-error
--md-sys-color-error-container
--md-sys-color-on-error-container

/* Surface colors */
--md-sys-color-surface
--md-sys-color-on-surface
--md-sys-color-surface-variant
--md-sys-color-on-surface-variant

/* Surface containers (MD3 elevation system) */
--md-sys-color-surface-container-lowest
--md-sys-color-surface-container-low
--md-sys-color-surface-container
--md-sys-color-surface-container-high
--md-sys-color-surface-container-highest

/* Background */
--md-sys-color-background
--md-sys-color-on-background

/* Outline */
--md-sys-color-outline
--md-sys-color-outline-variant
```

---

### Typography (60 tokens)

15 type scales × 4 properties each:

```css
/* Display (Large, Medium, Small) */
--md-sys-typescale-display-large-size
--md-sys-typescale-display-large-line-height
--md-sys-typescale-display-large-weight
--md-sys-typescale-display-large-tracking

/* Headline (Large, Medium, Small) */
--md-sys-typescale-headline-large-size
--md-sys-typescale-headline-large-line-height
/* ... */

/* Title (Large, Medium, Small) */
--md-sys-typescale-title-large-size
/* ... */

/* Body (Large, Medium, Small) */
--md-sys-typescale-body-large-size
/* ... */

/* Label (Large, Medium, Small) */
--md-sys-typescale-label-large-size
/* ... */
```

---

### Elevation (6 levels)

Box shadows for elevation levels 0-5:

```css
--md-sys-elevation-level-0  /* No shadow */
--md-sys-elevation-level-1  /* 1dp */
--md-sys-elevation-level-2  /* 3dp */
--md-sys-elevation-level-3  /* 6dp */
--md-sys-elevation-level-4  /* 8dp */
--md-sys-elevation-level-5  /* 12dp */
```

**Example values:**

```css
--md-sys-elevation-level-1: 0 1px 2px 0 rgba(0, 0, 0, 0.3), 0 1px 3px 1px rgba(0, 0, 0, 0.15);
--md-sys-elevation-level-3: 0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 4px 8px 3px rgba(0, 0, 0, 0.15);
```

---

### Shape (7 values)

Border radius values for different corner styles:

```css
--md-sys-shape-corner-none: 0px;
--md-sys-shape-corner-extra-small: 4px;
--md-sys-shape-corner-small: 8px;
--md-sys-shape-corner-medium: 12px;
--md-sys-shape-corner-large: 16px;
--md-sys-shape-corner-extra-large: 28px;
--md-sys-shape-corner-full: 9999px;
```

---

### Motion (16 values)

Animation durations and easing curves:

**Durations:**

```css
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
```

**Easing curves:**

```css
--md-sys-motion-easing-standard: cubic-bezier(0.2, 0, 0, 1);
--md-sys-motion-easing-emphasized: cubic-bezier(0.2, 0, 0, 1);
--md-sys-motion-easing-emphasized-decelerate: cubic-bezier(0.05, 0.7, 0.1, 1);
--md-sys-motion-easing-emphasized-accelerate: cubic-bezier(0.3, 0, 0.8, 0.15);
```

---

## 🌙 Dark Mode

Dark mode is applied by adding the `.dark` class to the `<html>` element or any ancestor:

```css
/* Light mode (default — :root) */
:root {
  --md-sys-color-primary: #6750a4;
  --md-sys-color-surface: #fffbfe;
}

/* Dark mode — add .dark class to <html> or ancestor */
.dark {
  --md-sys-color-primary: #d0bcff;
  --md-sys-color-surface: #1c1b1f;
}
```

**Usage:**

```html
<!-- Enable dark mode -->
<html class="dark">
  <!-- All tokens switch to dark values automatically -->
</html>
```

> **Note:** Automatic system preference detection via `prefers-color-scheme` is planned for a future release.

---

## 🎨 Customization

### Override Individual Tokens

```css
:root {
  /* Override primary color */
  --md-sys-color-primary: #ff6b6b;
  --md-sys-color-on-primary: #ffffff;
}
```

### Create Custom Theme

```css
:root {
  /* Custom color palette */
  --md-sys-color-primary: #2ecc71;
  --md-sys-color-secondary: #3498db;
  --md-sys-color-tertiary: #e74c3c;

  /* Custom typography */
  --md-sys-typescale-body-large-size: 18px;

  /* Custom shape */
  --md-sys-shape-corner-medium: 8px;
}
```

### Multiple Themes

```css
/* Default theme */
:root {
  --md-sys-color-primary: #6750a4;
}

/* Brand theme */
[data-theme="brand"] {
  --md-sys-color-primary: #ff6b6b;
}

/* Ocean theme */
[data-theme="ocean"] {
  --md-sys-color-primary: #3498db;
}
```

```html
<div data-theme="ocean">
  <!-- Ocean theme applied here -->
</div>
```

---

## 🎯 Tailwind CSS Integration

Tokens are automatically mapped to Tailwind utilities:

```html
<!-- Color utilities -->
<div class="bg-primary text-on-primary">Primary background</div>
<div class="bg-surface text-on-surface">Surface background</div>

<!-- Shape utilities -->
<div class="rounded-md">Medium corner</div>
<div class="rounded-lg">Large corner</div>

<!-- Elevation utilities -->
<div class="shadow-md">Elevation 2</div>
<div class="shadow-lg">Elevation 3</div>
```

**How it works:**

Tailwind v4 uses the `@theme` directive to import tokens:

```css
@theme {
  /* Imports all MD3 tokens as Tailwind utilities */
  --color-primary: var(--md-sys-color-primary);
  --color-on-primary: var(--md-sys-color-on-primary);
  /* ... */
}
```

---

## 🔗 Framework Examples

### React

```tsx
import "@tinybigui/tokens";

function MyComponent() {
  return (
    <div
      style={{
        background: "var(--md-sys-color-primary)",
        color: "var(--md-sys-color-on-primary)",
        borderRadius: "var(--md-sys-shape-corner-medium)",
      }}
    >
      Material Design 3 styled!
    </div>
  );
}
```

### Vue

```vue
<template>
  <div class="md3-component">Hello</div>
</template>

<style>
@import "@tinybigui/tokens";

.md3-component {
  background: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
}
</style>
```

### Angular

```typescript
// styles.css
@import "@tinybigui/tokens";

// component.css
.component {
  background: var(--md-sys-color-surface);
  box-shadow: var(--md-sys-elevation-level-2);
}
```

### Vanilla JS

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <link rel="stylesheet" href="node_modules/@tinybigui/tokens/dist/tokens.css" />
    <style>
      .card {
        background: var(--md-sys-color-surface);
        border-radius: var(--md-sys-shape-corner-large);
        box-shadow: var(--md-sys-elevation-level-2);
      }
    </style>
  </head>
  <body>
    <div class="card">Material Design 3 card</div>
  </body>
</html>
```

---

## 📊 Token Summary

| Category   | Count   | Description                                     |
| ---------- | ------- | ----------------------------------------------- |
| Colors     | 29      | Primary, secondary, surface + containers        |
| Typography | 62      | 15 scales × 4 properties + 2 font-family tokens |
| Elevation  | 6       | Shadow levels 0-5                               |
| Shape      | 7       | Border radius values                            |
| Motion     | 16      | Durations + easing curves                       |
| **Total**  | **120** | **Complete MD3 token system**                   |

> **Note:** Dark mode reuses the same 120 token names with different values via the `.dark` class — no additional variables are added.

---

## 🎓 Why Use Design Tokens?

### ✅ Benefits

1. **Consistency** - Single source of truth for design values
2. **Maintainability** - Change once, update everywhere
3. **Scalability** - Easy to add new themes or variants
4. **Collaboration** - Designers and developers speak same language
5. **Accessibility** - Built-in WCAG-compliant colors
6. **Performance** - Native CSS, no JavaScript required
7. **Framework Agnostic** - Works with any tech stack

### 📐 Example: Consistency in Action

**Without tokens:**

```css
/* Scattered values, hard to maintain */
.button {
  background: #6750a4;
}
.card {
  background: #6750a4;
}
.header {
  background: #6850a4;
} /* Oops, typo! */
```

**With tokens:**

```css
/* Consistent, maintainable */
.button {
  background: var(--md-sys-color-primary);
}
.card {
  background: var(--md-sys-color-primary);
}
.header {
  background: var(--md-sys-color-primary);
}
```

---

## 📖 Documentation

- **Material Design 3 Guidelines**: [m3.material.io](https://m3.material.io/)
- **Design Tokens Spec**: [design-tokens.github.io](https://design-tokens.github.io/community-group/format/)
- **GitHub Repository**: [github.com/buildinclicks/tinybigui](https://github.com/buildinclicks/tinybigui)
- **Full Documentation**: Coming soon at [tinybigui.dev](https://tinybigui.dev)

---

## 🤝 Contributing

We welcome contributions! See our [Contributing Guide](https://github.com/buildinclicks/tinybigui#contributing) for details.

---

## 📄 License

MIT © [buildinclicks](https://github.com/buildinclicks)

---

## 🔗 Related Packages

- [`@tinybigui/react`](https://www.npmjs.com/package/@tinybigui/react) - React components using these tokens

---

## 🙏 Credits

Based on [Material Design 3](https://m3.material.io/) design system by Google.

---

<div align="center">
  <p>
    <strong>Made with ❤️ by <a href="https://github.com/buildinclicks">buildinclicks</a></strong>
  </p>
  <p>
    <a href="https://github.com/buildinclicks/tinybigui">GitHub</a> •
    <a href="https://github.com/buildinclicks/tinybigui/issues">Report Bug</a> •
    <a href="https://github.com/buildinclicks/tinybigui/discussions">Request Feature</a>
  </p>
</div>
