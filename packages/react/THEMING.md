# Theming Guide — @tinybigui/react

TinyBigUI is built on a three-layer token system that makes full brand customization possible by overriding CSS custom properties. This guide explains how to set up Tailwind CSS v4 correctly and how to customize every aspect of the design system.

---

## How the Token System Works

Tokens are structured in three layers:

```
Layer 1: Reference Palette  --md-ref-palette-primary40: #6750a4
              ↓ (referenced by)
Layer 2: System Colors      --md-sys-color-primary: var(--md-ref-palette-primary40)
              ↓ (mapped to Tailwind by)
Layer 3: @theme Bridge       --color-primary: var(--md-sys-color-primary)
              ↓ (generates)
         Tailwind Utility    .bg-primary { background-color: var(--color-primary); }
```

Override Layer 1 (palette) to retheme everything at once. Override Layer 2 (system) for surgical per-role adjustments.

---

## Required CSS Setup

TinyBigUI requires **Tailwind CSS v4** to generate utility classes. Set up your app's CSS entry file before importing the library.

### Next.js

```css
/* app/globals.css */
@import "tailwindcss";
@source "../node_modules/@tinybigui/react/dist";
@import "@tinybigui/react/styles.css";
```

```tsx
/* app/layout.tsx */
import "./globals.css";
```

### Vite / React

```css
/* src/index.css */
@import "tailwindcss";
@source "./node_modules/@tinybigui/react/dist";
@import "@tinybigui/react/styles.css";
```

```tsx
/* src/main.tsx */
import "./index.css";
```

### Remix

```css
/* app/root.css */
@import "tailwindcss";
@source "../node_modules/@tinybigui/react/dist";
@import "@tinybigui/react/styles.css";
```

> **Why is `@source` required?**
> Tailwind CSS v4 uses JIT (Just-In-Time) compilation and does not scan `node_modules` by default. The `@source` directive tells Tailwind to scan the compiled library output so it generates utility classes like `bg-primary`, `shadow-elevation-1`, `text-label-large`, etc. Without it, components will not render correctly.

---

## Custom Theme

### Method 1: Override the Palette (Recommended)

Override `--md-ref-palette-*` variables. Because all semantic color roles reference the palette, a small number of overrides reshapes every component's colors automatically.

```css
/* app/globals.css */
@import "tailwindcss";
@source "../node_modules/@tinybigui/react/dist";
@import "@tinybigui/react/styles.css";

/* Brand theme — teal primary color */
:root {
  /* Primary tonal stops used by both light and dark modes */
  --md-ref-palette-primary0: #000000;
  --md-ref-palette-primary10: #002020;
  --md-ref-palette-primary20: #003737;
  --md-ref-palette-primary30: #004f4f;
  --md-ref-palette-primary40: #006a6a; /* light mode primary (bg-primary) */
  --md-ref-palette-primary50: #008585;
  --md-ref-palette-primary60: #00a1a1;
  --md-ref-palette-primary70: #23bdbd;
  --md-ref-palette-primary80: #4ddada; /* dark mode primary (bg-primary in dark) */
  --md-ref-palette-primary90: #b2fefe; /* light primary-container */
  --md-ref-palette-primary95: #d6fffe;
  --md-ref-palette-primary99: #f5fffe;
  --md-ref-palette-primary100: #ffffff;
}
```

> Use the [Material Theme Builder](https://m3.material.io/theme-builder) to generate a full palette from a single seed color. You can also override secondary, tertiary, error, neutral, and neutral-variant palettes the same way.

### Method 2: Override System Colors (Surgical)

Override individual `--md-sys-color-*` roles when you need targeted control without changing the full palette.

```css
:root {
  /* Change only the primary color role */
  --md-sys-color-primary: #006a6a;
  --md-sys-color-on-primary: #ffffff;
  --md-sys-color-primary-container: #b2fefe;
  --md-sys-color-on-primary-container: #002020;
}
```

---

## Dark Mode

The library ships with light/dark mode support out of the box. Three mechanisms are supported.

### OS Preference (automatic)

No code needed. The library automatically switches to dark colors when `prefers-color-scheme: dark` is active and no `.light` class is on the root element.

### Manual Class Toggle

Add `.dark` or `.light` to `<html>` or `<body>` to force a mode:

```tsx
// Force dark mode
document.documentElement.classList.add("dark");
document.documentElement.classList.remove("light");

// Force light mode
document.documentElement.classList.add("light");
document.documentElement.classList.remove("dark");
```

### Dark Mode Custom Palette Overrides

When overriding palette tokens, also provide dark mode overrides:

```css
/* Light mode palette */
:root {
  --md-ref-palette-primary40: #006a6a;
  --md-ref-palette-primary80: #4ddada;
  --md-ref-palette-primary90: #b2fefe;
}

/* Dark mode overrides — class-based */
.dark {
  /* Dark mode picks the 80-stop for primary text/icons */
  --md-ref-palette-primary40: #006a6a;
  --md-ref-palette-primary80: #4ddada;
}

/* Dark mode overrides — OS preference */
@media (prefers-color-scheme: dark) {
  :root:not(.light) {
    --md-ref-palette-primary40: #006a6a;
    --md-ref-palette-primary80: #4ddada;
  }
}
```

---

## Typography Customization

```css
:root {
  /* Change the brand font family */
  --md-sys-typescale-font-family-brand: "Playfair Display", serif;
  --md-sys-typescale-font-family-plain: "Inter", system-ui, sans-serif;

  /* Adjust individual type scale sizes */
  --md-sys-typescale-display-large-size: 4rem;
  --md-sys-typescale-display-large-line-height: 4.5rem;

  /* Adjust body text */
  --md-sys-typescale-body-medium-size: 1rem;
  --md-sys-typescale-body-medium-line-height: 1.625rem;
}
```

Tailwind utility classes (`text-display-large`, `text-body-medium`, etc.) automatically reflect these overrides at runtime.

---

## Shape Customization

```css
:root {
  /* Sharper brand — reduce all corner radii */
  --md-sys-shape-corner-extra-small: 2px;
  --md-sys-shape-corner-small: 4px;
  --md-sys-shape-corner-medium: 6px;
  --md-sys-shape-corner-large: 8px;
  --md-sys-shape-corner-extra-large: 12px;

  /* Or rounder brand */
  --md-sys-shape-corner-extra-small: 8px;
  --md-sys-shape-corner-small: 12px;
  --md-sys-shape-corner-medium: 16px;
  --md-sys-shape-corner-large: 24px;
  --md-sys-shape-corner-extra-large: 36px;
}
```

---

## Elevation Customization

```css
:root {
  /* Softer shadows */
  --md-sys-elevation-level-1: 0 1px 3px rgba(0, 0, 0, 0.1);
  --md-sys-elevation-level-2: 0 2px 6px rgba(0, 0, 0, 0.1);

  /* Stronger shadows */
  --md-sys-elevation-level-1: 0 2px 8px rgba(0, 0, 0, 0.25), 0 1px 3px rgba(0, 0, 0, 0.15);
}
```

---

## Granular Imports (Advanced)

If you manage tokens separately or need fine-grained control:

```css
/* app/globals.css */
@import "tailwindcss";
@source "../node_modules/@tinybigui/react/dist";

/* Only the tokens you need */
@import "@tinybigui/tokens/palette.css"; /* reference palette (--md-ref-palette-*) */
@import "@tinybigui/tokens/color.css"; /* semantic color roles (--md-sys-color-*) */
@import "@tinybigui/tokens/typography.css"; /* type scale (--md-sys-typescale-*) */
@import "@tinybigui/tokens/shape.css"; /* corner radii (--md-sys-shape-corner-*) */
@import "@tinybigui/tokens/elevation.css"; /* shadows (--md-sys-elevation-level-*) */
@import "@tinybigui/tokens/motion.css"; /* animation tokens (--md-sys-motion-*) */
@import "@tinybigui/tokens/theme.css"; /* Tailwind @theme bridge (utility classes) */
```

---

## Available CSS Variable Namespaces

| Namespace                    | Controls                          | Example                                 |
| ---------------------------- | --------------------------------- | --------------------------------------- |
| `--md-ref-palette-*`         | Raw tonal palette (hex values)    | `--md-ref-palette-primary40`            |
| `--md-sys-color-*`           | Semantic color roles              | `--md-sys-color-primary`                |
| `--md-sys-typescale-*`       | Font sizes, line-heights, weights | `--md-sys-typescale-display-large-size` |
| `--md-sys-shape-corner-*`    | Border radius scale               | `--md-sys-shape-corner-medium`          |
| `--md-sys-elevation-level-*` | Box shadow values                 | `--md-sys-elevation-level-2`            |
| `--md-sys-motion-*`          | Animation durations and easings   | `--md-sys-motion-duration-medium2`      |
