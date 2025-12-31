# @tinybigui/tokens

> Material Design 3 design tokens for TinyBigUI

[![npm version](https://img.shields.io/npm/v/@tinybigui/tokens.svg?style=flat-square)](https://www.npmjs.com/package/@tinybigui/tokens)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@tinybigui/tokens?style=flat-square)](https://bundlephobia.com/package/@tinybigui/tokens)

A comprehensive collection of Material Design 3 design tokens implemented as CSS custom properties. Framework-agnostic and ready to use in any web project.

---

## ⚠️ Status

> **🚧 Work in Progress**
>
> This package is currently in active development (Phase 0) and is **not yet published to npm**.
>
> Follow our [GitHub repository](https://github.com/buildinclicks/tinybigui) for updates!

---

## 🎨 What Are Design Tokens?

Design tokens are the **visual design atoms** of a design system. They're named entities that store visual design attributes like colors, typography, spacing, and more.

**Think of them as variables for your design system:**

- Instead of `#6750a4`, use `var(--md-sys-color-primary)`
- Instead of `16px`, use `var(--md-sys-typescale-body-large-font-size)`
- Change once, update everywhere!

---

## ✨ Features

- 🎨 **145 Design Tokens** - Complete Material Design 3 token system
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

> **Coming Soon!** This package will be available once we reach Phase 1b.

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
  padding: var(--md-sys-spacing-4);
  border-radius: var(--md-sys-shape-corner-medium);
  box-shadow: var(--md-sys-elevation-2);
}
```

---

## 🎨 Available Tokens

### Colors (25 tokens)

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

/* Background */
--md-sys-color-background
--md-sys-color-on-background

/* Outline */
--md-sys-color-outline
--md-sys-color-outline-variant

/* Surface tints */
--md-sys-color-surface-tint
--md-sys-color-inverse-surface
```

---

### Typography (60 tokens)

15 type scales × 4 properties each:

```css
/* Display (Large, Medium, Small) */
--md-sys-typescale-display-large-font-size
--md-sys-typescale-display-large-line-height
--md-sys-typescale-display-large-weight
--md-sys-typescale-display-large-letter-spacing

/* Headline (Large, Medium, Small) */
--md-sys-typescale-headline-large-font-size
--md-sys-typescale-headline-large-line-height
/* ... */

/* Title (Large, Medium, Small) */
--md-sys-typescale-title-large-font-size
/* ... */

/* Body (Large, Medium, Small) */
--md-sys-typescale-body-large-font-size
/* ... */

/* Label (Large, Medium, Small) */
--md-sys-typescale-label-large-font-size
/* ... */
```

---

### Elevation (6 levels)

Box shadows for elevation levels 0-5:

```css
--md-sys-elevation-0  /* No shadow */
--md-sys-elevation-1  /* 1dp */
--md-sys-elevation-2  /* 3dp */
--md-sys-elevation-3  /* 6dp */
--md-sys-elevation-4  /* 8dp */
--md-sys-elevation-5  /* 12dp */
```

**Example values:**

```css
--md-sys-elevation-1: 0 1px 2px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.15);
--md-sys-elevation-3: 0 4px 8px rgba(0, 0, 0, 0.2), 0 6px 20px rgba(0, 0, 0, 0.19);
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
--md-sys-motion-duration-short-1: 50ms;
--md-sys-motion-duration-short-2: 100ms;
--md-sys-motion-duration-short-3: 150ms;
--md-sys-motion-duration-short-4: 200ms;
--md-sys-motion-duration-medium-1: 250ms;
--md-sys-motion-duration-medium-2: 300ms;
--md-sys-motion-duration-long-1: 450ms;
--md-sys-motion-duration-long-2: 500ms;
```

**Easing curves:**

```css
--md-sys-motion-easing-standard: cubic-bezier(0.2, 0, 0, 1);
--md-sys-motion-easing-emphasized: cubic-bezier(0.2, 0, 0, 1);
--md-sys-motion-easing-emphasized-decelerate: cubic-bezier(0.05, 0.7, 0.1, 1);
--md-sys-motion-easing-emphasized-accelerate: cubic-bezier(0.3, 0, 0.8, 0.15);
/* ... and 4 more */
```

---

## 🌙 Dark Mode

Dark mode is automatically applied based on system preferences:

```css
/* Light mode (default) */
:root {
  --md-sys-color-primary: #6750a4;
  --md-sys-color-surface: #fffbfe;
}

/* Dark mode (automatic) */
@media (prefers-color-scheme: dark) {
  :root {
    --md-sys-color-primary: #d0bcff;
    --md-sys-color-surface: #1c1b1f;
  }
}
```

**Manual control:**

```html
<!-- Force dark mode -->
<html data-theme="dark">
  <!-- Your content -->
</html>

<!-- Force light mode -->
<html data-theme="light">
  <!-- Your content -->
</html>
```

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
  --md-sys-typescale-body-large-font-size: 18px;

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
        padding: "var(--md-sys-spacing-4)",
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
  box-shadow: var(--md-sys-elevation-2);
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
        box-shadow: var(--md-sys-elevation-2);
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

| Category   | Count   | Description                   |
| ---------- | ------- | ----------------------------- |
| Colors     | 25      | Primary, secondary, surface   |
| Typography | 60      | 15 scales × 4 properties      |
| Elevation  | 6       | Shadow levels 0-5             |
| Shape      | 7       | Border radius values          |
| Motion     | 16      | Durations + easing curves     |
| **Total**  | **114** | **Complete MD3 token system** |

> **Note:** Some tokens have light/dark variants, bringing the actual CSS variable count to 145.

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
