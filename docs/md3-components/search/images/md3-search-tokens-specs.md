# Material Design 3 Search Tokens & Specs Matrix

Source component: **Material Design 3 Search**  
Scope: **Search – Bar** and **Search – View**  
Prepared for: React / web component library implementation

> Important: This file uses **semantic Material 3 token values**, not hard-coded hex colors. In MD3, concrete color values depend on the selected color scheme, theme, contrast level, and dynamic color generation. For a React library, components should consume semantic CSS variables and let the theme engine resolve them.

---

## 1. Context dimensions covered

This document covers every combination of the following context dimensions:

```ts
type Theme = "light" | "dark";
type Platform = "compose" | "web" | "ios" | "android";
type MotionScheme = "standard" | "expressive";
type Contrast = "default" | "medium" | "high";
```

Total combinations:

```txt
2 themes × 4 platforms × 2 motion schemes × 3 contrast levels = 48 contexts
```

For every context, the same component token names are used. The resolved value of color roles can change by theme and contrast.

---

## 2. Recommended React implementation rule

Use component tokens as CSS variables, then map them to MD3 system tokens:

```css
.search-bar {
  background: var(--md-sys-color-surface-container-high);
  color: var(--md-sys-color-on-surface);
  border-radius: var(--md-sys-shape-corner-full);
  height: 56px;
}
```

Do **not** hardcode colors inside components.

---

## 3. Search Bar — canonical token spec

The Material 3 search bar token set is mainly for the **unfocused / collapsed search bar**.

| Token | Semantic value | React CSS variable suggestion | Notes |
|---|---:|---|---|
| Avatar shape | `CornerFull` | `--md-search-bar-avatar-shape` | Optional avatar / profile affordance |
| Avatar size | `30dp` | `--md-search-bar-avatar-size` | Use `30px` on web unless density scaling is supported |
| Container color | `SurfaceContainerHigh` | `--md-search-bar-container-color` | Should resolve by theme + contrast |
| Container elevation | `Level3` | `--md-search-bar-container-elevation` | MD3 token says Level3; Compose defaults may flatten tonal elevation in some implementations |
| Container height | `56dp` | `--md-search-bar-container-height` | Use `56px` on web |
| Container shape | `CornerFull` | `--md-search-bar-container-shape` | Fully rounded pill shape |
| Focus indicator color | `Secondary` | `--md-search-bar-focus-indicator-color` | Useful when implementing focused state affordance |
| Hover supporting text color | `OnSurfaceVariant` | `--md-search-bar-hover-supporting-text-color` | Web pointer state |
| Input text color | `OnSurface` | `--md-search-bar-input-text-color` | Query text |
| Input text font | `BodyLarge` | `--md-search-bar-input-text-font` | 16sp/24sp equivalent |
| Leading icon color | `OnSurface` | `--md-search-bar-leading-icon-color` | Search icon / navigation icon |
| Pressed supporting text color | `OnSurfaceVariant` | `--md-search-bar-pressed-supporting-text-color` | Pressed state |
| Supporting text color | `OnSurfaceVariant` | `--md-search-bar-supporting-text-color` | Placeholder / hint text |
| Supporting text font | `BodyLarge` | `--md-search-bar-supporting-text-font` | Placeholder / hint typography |
| Trailing icon color | `OnSurfaceVariant` | `--md-search-bar-trailing-icon-color` | Mic, clear, profile, etc. |

### Search Bar CSS variable mapping

```css
:root {
  --md-search-bar-avatar-shape: var(--md-sys-shape-corner-full);
  --md-search-bar-avatar-size: 30px;
  --md-search-bar-container-color: var(--md-sys-color-surface-container-high);
  --md-search-bar-container-elevation: var(--md-sys-elevation-level3);
  --md-search-bar-container-height: 56px;
  --md-search-bar-container-shape: var(--md-sys-shape-corner-full);
  --md-search-bar-focus-indicator-color: var(--md-sys-color-secondary);
  --md-search-bar-hover-supporting-text-color: var(--md-sys-color-on-surface-variant);
  --md-search-bar-input-text-color: var(--md-sys-color-on-surface);
  --md-search-bar-input-text-font: var(--md-sys-typescale-body-large-font);
  --md-search-bar-leading-icon-color: var(--md-sys-color-on-surface);
  --md-search-bar-pressed-supporting-text-color: var(--md-sys-color-on-surface-variant);
  --md-search-bar-supporting-text-color: var(--md-sys-color-on-surface-variant);
  --md-search-bar-supporting-text-font: var(--md-sys-typescale-body-large-font);
  --md-search-bar-trailing-icon-color: var(--md-sys-color-on-surface-variant);
}
```

---

## 4. Search View — canonical token spec

The search view token set is for the **focused / expanded search UI**.

| Token | Semantic value | React CSS variable suggestion | Notes |
|---|---:|---|---|
| Container color | `SurfaceContainerHigh` | `--md-search-view-container-color` | Background of expanded search view |
| Container elevation | `Level3` | `--md-search-view-container-elevation` | Use elevation token, not fixed shadow |
| Divider color | `Outline` | `--md-search-view-divider-color` | Divider below header / input area |
| Docked container shape | `CornerExtraLarge` | `--md-search-view-docked-container-shape` | Used when view is docked / not fullscreen |
| Docked header container height | `56dp` | `--md-search-view-docked-header-container-height` | Web equivalent: `56px` |
| Fullscreen container shape | `CornerNone` | `--md-search-view-fullscreen-container-shape` | Fullscreen search should not be rounded |
| Fullscreen header container height | `72dp` | `--md-search-view-fullscreen-header-container-height` | Web equivalent: `72px` |
| Header input text color | `OnSurface` | `--md-search-view-header-input-text-color` | Search query text |
| Header input text font | `BodyLarge` | `--md-search-view-header-input-text-font` | Header field typography |
| Header leading icon color | `OnSurface` | `--md-search-view-header-leading-icon-color` | Back/search icon |
| Header supporting text color | `OnSurfaceVariant` | `--md-search-view-header-supporting-text-color` | Placeholder / hint |
| Header supporting text font | `BodyLarge` | `--md-search-view-header-supporting-text-font` | Placeholder typography |
| Header trailing icon color | `OnSurfaceVariant` | `--md-search-view-header-trailing-icon-color` | Clear/mic/action icons |

### Search View CSS variable mapping

```css
:root {
  --md-search-view-container-color: var(--md-sys-color-surface-container-high);
  --md-search-view-container-elevation: var(--md-sys-elevation-level3);
  --md-search-view-divider-color: var(--md-sys-color-outline);
  --md-search-view-docked-container-shape: var(--md-sys-shape-corner-extra-large);
  --md-search-view-docked-header-container-height: 56px;
  --md-search-view-fullscreen-container-shape: var(--md-sys-shape-corner-none);
  --md-search-view-fullscreen-header-container-height: 72px;
  --md-search-view-header-input-text-color: var(--md-sys-color-on-surface);
  --md-search-view-header-input-text-font: var(--md-sys-typescale-body-large-font);
  --md-search-view-header-leading-icon-color: var(--md-sys-color-on-surface);
  --md-search-view-header-supporting-text-color: var(--md-sys-color-on-surface-variant);
  --md-search-view-header-supporting-text-font: var(--md-sys-typescale-body-large-font);
  --md-search-view-header-trailing-icon-color: var(--md-sys-color-on-surface-variant);
}
```

---

## 5. Context resolution rules

### 5.1 Theme

| Theme | Token behavior |
|---|---|
| Light | Resolve color roles from the light color scheme |
| Dark | Resolve color roles from the dark color scheme |

### 5.2 Contrast

| Contrast | Token behavior |
|---|---|
| Default | Use default MD3 generated scheme |
| Medium | Use medium contrast generated scheme |
| High | Use high contrast generated scheme |

### 5.3 Platform

| Platform | Implementation guidance |
|---|---|
| Compose | Use `dp`, Compose typography, Compose color scheme roles |
| Web | Use `px`, CSS variables, semantic tokens |
| iOS | Use points, native text styles where possible, same semantic roles |
| Android | Use `dp`, Material Components / Compose mapping |

### 5.4 Motion scheme

| Motion scheme | Static token impact | Implementation guidance |
|---|---|---|
| Standard | No change to static color / size tokens | Use standard MD3 motion durations/easing for expand/collapse |
| Expressive | No change to static color / size tokens | Use expressive motion for search view expansion, shape morph, content fade, and icon movement |

---

## 6. All context combinations

Each context below uses the same canonical Search Bar and Search View token mapping from sections 3 and 4. The difference is in how semantic system tokens resolve.

### 6.1 Light theme contexts

| ID | Theme | Platform | Motion Scheme | Contrast | Search Bar token set | Search View token set |
|---:|---|---|---|---|---|---|
| 1 | Light | Compose | Standard | Default | Section 3 | Section 4 |
| 2 | Light | Compose | Standard | Medium | Section 3 | Section 4 |
| 3 | Light | Compose | Standard | High | Section 3 | Section 4 |
| 4 | Light | Compose | Expressive | Default | Section 3 | Section 4 |
| 5 | Light | Compose | Expressive | Medium | Section 3 | Section 4 |
| 6 | Light | Compose | Expressive | High | Section 3 | Section 4 |
| 7 | Light | Web | Standard | Default | Section 3 | Section 4 |
| 8 | Light | Web | Standard | Medium | Section 3 | Section 4 |
| 9 | Light | Web | Standard | High | Section 3 | Section 4 |
| 10 | Light | Web | Expressive | Default | Section 3 | Section 4 |
| 11 | Light | Web | Expressive | Medium | Section 3 | Section 4 |
| 12 | Light | Web | Expressive | High | Section 3 | Section 4 |
| 13 | Light | iOS | Standard | Default | Section 3 | Section 4 |
| 14 | Light | iOS | Standard | Medium | Section 3 | Section 4 |
| 15 | Light | iOS | Standard | High | Section 3 | Section 4 |
| 16 | Light | iOS | Expressive | Default | Section 3 | Section 4 |
| 17 | Light | iOS | Expressive | Medium | Section 3 | Section 4 |
| 18 | Light | iOS | Expressive | High | Section 3 | Section 4 |
| 19 | Light | Android | Standard | Default | Section 3 | Section 4 |
| 20 | Light | Android | Standard | Medium | Section 3 | Section 4 |
| 21 | Light | Android | Standard | High | Section 3 | Section 4 |
| 22 | Light | Android | Expressive | Default | Section 3 | Section 4 |
| 23 | Light | Android | Expressive | Medium | Section 3 | Section 4 |
| 24 | Light | Android | Expressive | High | Section 3 | Section 4 |

### 6.2 Dark theme contexts

| ID | Theme | Platform | Motion Scheme | Contrast | Search Bar token set | Search View token set |
|---:|---|---|---|---|---|---|
| 25 | Dark | Compose | Standard | Default | Section 3 | Section 4 |
| 26 | Dark | Compose | Standard | Medium | Section 3 | Section 4 |
| 27 | Dark | Compose | Standard | High | Section 3 | Section 4 |
| 28 | Dark | Compose | Expressive | Default | Section 3 | Section 4 |
| 29 | Dark | Compose | Expressive | Medium | Section 3 | Section 4 |
| 30 | Dark | Compose | Expressive | High | Section 3 | Section 4 |
| 31 | Dark | Web | Standard | Default | Section 3 | Section 4 |
| 32 | Dark | Web | Standard | Medium | Section 3 | Section 4 |
| 33 | Dark | Web | Standard | High | Section 3 | Section 4 |
| 34 | Dark | Web | Expressive | Default | Section 3 | Section 4 |
| 35 | Dark | Web | Expressive | Medium | Section 3 | Section 4 |
| 36 | Dark | Web | Expressive | High | Section 3 | Section 4 |
| 37 | Dark | iOS | Standard | Default | Section 3 | Section 4 |
| 38 | Dark | iOS | Standard | Medium | Section 3 | Section 4 |
| 39 | Dark | iOS | Standard | High | Section 3 | Section 4 |
| 40 | Dark | iOS | Expressive | Default | Section 3 | Section 4 |
| 41 | Dark | iOS | Expressive | Medium | Section 3 | Section 4 |
| 42 | Dark | iOS | Expressive | High | Section 3 | Section 4 |
| 43 | Dark | Android | Standard | Default | Section 3 | Section 4 |
| 44 | Dark | Android | Standard | Medium | Section 3 | Section 4 |
| 45 | Dark | Android | Standard | High | Section 3 | Section 4 |
| 46 | Dark | Android | Expressive | Default | Section 3 | Section 4 |
| 47 | Dark | Android | Expressive | Medium | Section 3 | Section 4 |
| 48 | Dark | Android | Expressive | High | Section 3 | Section 4 |

---

## 7. Practical implementation checklist for a React MD3 library

### SearchBar component

Required slots:

- leading icon
- input / placeholder
- trailing icons
- optional avatar

Required states:

- enabled
- hover
- pressed
- focused
- disabled, if your library supports disabled search affordance

Required static specs:

```ts
const searchBarSpecs = {
  height: "56px",
  shape: "var(--md-sys-shape-corner-full)",
  containerColor: "var(--md-sys-color-surface-container-high)",
  inputTextColor: "var(--md-sys-color-on-surface)",
  supportingTextColor: "var(--md-sys-color-on-surface-variant)",
  leadingIconColor: "var(--md-sys-color-on-surface)",
  trailingIconColor: "var(--md-sys-color-on-surface-variant)",
  typography: "var(--md-sys-typescale-body-large-font)",
};
```

### SearchView component

Required variants:

- docked search view
- fullscreen search view

Required slots:

- header leading icon
- header input / placeholder
- header trailing icons
- divider
- content area for suggestions / results

Required static specs:

```ts
const searchViewSpecs = {
  containerColor: "var(--md-sys-color-surface-container-high)",
  elevation: "var(--md-sys-elevation-level3)",
  dividerColor: "var(--md-sys-color-outline)",
  dockedShape: "var(--md-sys-shape-corner-extra-large)",
  dockedHeaderHeight: "56px",
  fullscreenShape: "var(--md-sys-shape-corner-none)",
  fullscreenHeaderHeight: "72px",
  headerInputTextColor: "var(--md-sys-color-on-surface)",
  headerSupportingTextColor: "var(--md-sys-color-on-surface-variant)",
  headerLeadingIconColor: "var(--md-sys-color-on-surface)",
  headerTrailingIconColor: "var(--md-sys-color-on-surface-variant)",
  typography: "var(--md-sys-typescale-body-large-font)",
};
```

---

## 8. Suggested TypeScript theme API

```ts
export type MD3ThemeMode = "light" | "dark";
export type MD3Platform = "compose" | "web" | "ios" | "android";
export type MD3MotionScheme = "standard" | "expressive";
export type MD3Contrast = "default" | "medium" | "high";

export interface MD3Context {
  theme: MD3ThemeMode;
  platform: MD3Platform;
  motionScheme: MD3MotionScheme;
  contrast: MD3Contrast;
}
```

Recommended provider:

```tsx
<MD3ThemeProvider
  context={{
    theme: "light",
    platform: "web",
    motionScheme: "expressive",
    contrast: "default",
  }}
>
  <App />
</MD3ThemeProvider>
```

---

## 9. Suggested CSS variable contract

```css
[data-md3-theme="light"][data-md3-contrast="default"] {
  --md-sys-color-surface-container-high: /* generated light default value */;
  --md-sys-color-on-surface: /* generated light default value */;
  --md-sys-color-on-surface-variant: /* generated light default value */;
  --md-sys-color-outline: /* generated light default value */;
  --md-sys-color-secondary: /* generated light default value */;
}

[data-md3-theme="dark"][data-md3-contrast="high"] {
  --md-sys-color-surface-container-high: /* generated dark high contrast value */;
  --md-sys-color-on-surface: /* generated dark high contrast value */;
  --md-sys-color-on-surface-variant: /* generated dark high contrast value */;
  --md-sys-color-outline: /* generated dark high contrast value */;
  --md-sys-color-secondary: /* generated dark high contrast value */;
}
```

---

## 10. Notes and limitations

1. Static component tokens such as height, shape, typography role, and semantic color role remain stable across the 48 contexts.
2. Concrete color values are intentionally not listed because MD3 colors are generated from a theme source color / dynamic color scheme and then adjusted by theme and contrast.
3. Platform mainly changes units and native implementation details, not the semantic token contract.
4. Motion scheme affects animation behavior, not the static search token table.
5. For a React library, the strongest architecture is: component token → system token → generated theme value.

---

## 11. Source references

- Material Design 3 Search specs: https://m3.material.io/components/search/specs
- AndroidX SearchBarTokens source: https://raw.githubusercontent.com/androidx/androidx/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/SearchBarTokens.kt
- AndroidX SearchViewTokens source: https://raw.githubusercontent.com/androidx/androidx/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/SearchViewTokens.kt
- Material Web theming docs: https://github.com/material-components/material-web/blob/main/docs/theming/README.md
- Jetpack Compose Search Bar docs: https://developer.android.com/develop/ui/compose/components/search-bar
