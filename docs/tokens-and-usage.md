# TinyBigUI — Motion Tokens & Usage Guide

This guide covers the complete Material Design 3 motion token system as implemented in `@tinybigui/tokens`. It explains every token variable, the corresponding Tailwind utility class, when to use each, and how to combine them for real-world UI patterns.

---

## Table of Contents

1. [The Two Motion Systems](#1-the-two-motion-systems)
2. [Legacy Duration Tokens](#2-legacy-duration-tokens)
3. [Legacy Easing Tokens](#3-legacy-easing-tokens)
4. [Spring-Based Motion Tokens — Expressive](#4-spring-based-motion-tokens--expressive)
5. [Spring-Based Motion Tokens — Standard](#5-spring-based-motion-tokens--standard)
6. [Composite Animation Utilities](#6-composite-animation-utilities)
7. [Keyframes Reference](#7-keyframes-reference)
8. [Applying Easing & Duration — Pairing Rules](#8-applying-easing--duration--pairing-rules)
9. [Transition Pattern Recipes](#9-transition-pattern-recipes)
10. [Common UI Effect Combinations](#10-common-ui-effect-combinations)
11. [Reduce-Motion Accessibility](#11-reduce-motion-accessibility)

---

## 1. The Two Motion Systems

M3 provides two overlapping motion systems:

| System | Purpose | When to use |
|--------|---------|------------|
| **Legacy easing + duration** | Page transitions (enter/exit/shared-axis) | Navigation between screens, dialogs, drawers sliding in/out |
| **Spring-based (cubic-bezier web conversion)** | Component animations | Buttons, FABs, chips, cards, menus, and all in-place UI animations |

> **Key insight:** The spring-based system replaced fixed easing curves for _component_ animations in M3 Expressive (May 2025). The legacy easing tokens are still valid for _transition patterns_ (page-level enter and exit). Both coexist.

### Spatial vs. Effects

Within the spring system, every token comes in two types:

- **Spatial** — animates position (`transform: translate/scale`), size, or shape. Springs may overshoot slightly, giving a physical, alive feel.
- **Effects** — animates opacity, color, or blur. Must _not_ overshoot (opacity > 1 or out-of-gamut colors break the UI visually).

### Expressive vs. Standard Personality

- **Expressive** — energetic, playful, with noticeable overshoot on spatial animations. Use for high-emphasis components and moments of delight (FABs, hero buttons, morphing shapes, expanding cards).
- **Standard** — calm, purposeful, no overshoot. Use for utility animations, navigation, content transitions, and secondary elements (drawers, nav bars, content fading in).

---

## 2. Legacy Duration Tokens

### CSS custom properties

```css
/* Short — micro-interactions, state feedback */
--md-sys-motion-duration-short1:      50ms
--md-sys-motion-duration-short2:     100ms
--md-sys-motion-duration-short3:     150ms
--md-sys-motion-duration-short4:     200ms

/* Medium — most component animations */
--md-sys-motion-duration-medium1:    250ms
--md-sys-motion-duration-medium2:    300ms
--md-sys-motion-duration-medium3:    350ms
--md-sys-motion-duration-medium4:    400ms

/* Long — large components, complex transitions */
--md-sys-motion-duration-long1:      450ms
--md-sys-motion-duration-long2:      500ms
--md-sys-motion-duration-long3:      550ms
--md-sys-motion-duration-long4:      600ms

/* Extra-long — full-screen transitions, complex sequences */
--md-sys-motion-duration-extra-long1: 700ms
--md-sys-motion-duration-extra-long2: 800ms
--md-sys-motion-duration-extra-long3: 900ms
--md-sys-motion-duration-extra-long4: 1000ms
```

### Tailwind utility classes

| Utility class | Duration |
|---|---|
| `duration-short1` | 50ms |
| `duration-short2` | 100ms |
| `duration-short3` | 150ms |
| `duration-short4` | 200ms |
| `duration-medium1` | 250ms |
| `duration-medium2` | 300ms |
| `duration-medium3` | 350ms |
| `duration-medium4` | 400ms |
| `duration-long1` | 450ms |
| `duration-long2` | 500ms |
| `duration-long3` | 550ms |
| `duration-long4` | 600ms |
| `duration-extra-long1` | 700ms |
| `duration-extra-long2` | 800ms |
| `duration-extra-long3` | 900ms |
| `duration-extra-long4` | 1000ms |

---

## 3. Legacy Easing Tokens

### CSS custom properties

```css
/* Standard family — utility animations */
--md-sys-motion-easing-standard:             cubic-bezier(0.2, 0, 0, 1)
--md-sys-motion-easing-standard-decelerate:  cubic-bezier(0, 0, 0, 1)
--md-sys-motion-easing-standard-accelerate:  cubic-bezier(0.3, 0, 1, 1)

/* Emphasized family — high-prominence transitions */
--md-sys-motion-easing-emphasized:            cubic-bezier(0.2, 0, 0, 1)
--md-sys-motion-easing-emphasized-decelerate: cubic-bezier(0.05, 0.7, 0.1, 1)
--md-sys-motion-easing-emphasized-accelerate: cubic-bezier(0.3, 0, 0.8, 0.15)
```

### Tailwind utility classes

| Utility class | Curve | Use |
|---|---|---|
| `ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | Element moves within the same screen |
| `ease-standard-decelerate` | `cubic-bezier(0, 0, 0, 1)` | Element enters the screen |
| `ease-standard-accelerate` | `cubic-bezier(0.3, 0, 1, 1)` | Element exits the screen |
| `ease-emphasized` | `cubic-bezier(0.2, 0, 0, 1)` | High-prominence on-screen movement |
| `ease-emphasized-decelerate` | `cubic-bezier(0.05, 0.7, 0.1, 1)` | High-prominence element enters |
| `ease-emphasized-accelerate` | `cubic-bezier(0.3, 0, 0.8, 0.15)` | High-prominence element exits |

### Recommended legacy pairings (MD3 spec)

| Easing | Duration | Transition type |
|--------|----------|-----------------|
| `ease-emphasized` | `duration-long2` (500ms) | Begin and end on screen |
| `ease-emphasized-decelerate` | `duration-medium4` (400ms) | Enter the screen |
| `ease-emphasized-accelerate` | `duration-short4` (200ms) | Exit the screen |
| `ease-standard` | `duration-medium2` (300ms) | Begin and end on screen (utility) |
| `ease-standard-decelerate` | `duration-medium1` (250ms) | Enter screen (utility) |
| `ease-standard-accelerate` | `duration-short4` (200ms) | Exit screen (utility) |

---

## 4. Spring-Based Motion Tokens — Expressive

Use expressive motion for high-emphasis, branded moments. The overshoot on spatial springs gives components a physical, alive quality.

### Spatial tokens (position, size, shape — overshoot allowed)

```css
/* Fast — small components: buttons, chips, badges */
--md-sys-motion-expressive-fast-spatial-easing:   cubic-bezier(0.42, 1.67, 0.21, 0.90)
--md-sys-motion-expressive-fast-spatial-duration:  350ms

/* Default — standard components: dialogs, cards, sheets */
--md-sys-motion-expressive-default-spatial-easing: cubic-bezier(0.38, 1.21, 0.22, 1.00)
--md-sys-motion-expressive-default-spatial-duration: 500ms

/* Slow — large/full-screen elements */
--md-sys-motion-expressive-slow-spatial-easing:   cubic-bezier(0.39, 1.29, 0.35, 0.98)
--md-sys-motion-expressive-slow-spatial-duration:  650ms
```

#### Tailwind utility classes

| Easing utility | Duration utility | Duration |
|---|---|---|
| `ease-expressive-fast-spatial` | `duration-expressive-fast-spatial` | 350ms |
| `ease-expressive-default-spatial` | `duration-expressive-default-spatial` | 500ms |
| `ease-expressive-slow-spatial` | `duration-expressive-slow-spatial` | 650ms |

### Effects tokens (opacity, color, blur — no overshoot)

```css
/* Fast — rapid feedback: icon color, badge flash */
--md-sys-motion-expressive-fast-effects-easing:   cubic-bezier(0.31, 0.94, 0.34, 1.00)
--md-sys-motion-expressive-fast-effects-duration:  150ms

/* Default — standard fade-in on prominent elements */
--md-sys-motion-expressive-default-effects-easing: cubic-bezier(0.34, 0.80, 0.34, 1.00)
--md-sys-motion-expressive-default-effects-duration: 200ms

/* Slow — fade-in on large or full-screen expressive elements */
--md-sys-motion-expressive-slow-effects-easing:   cubic-bezier(0.34, 0.88, 0.34, 1.00)
--md-sys-motion-expressive-slow-effects-duration:  300ms
```

#### Tailwind utility classes

| Easing utility | Duration utility | Duration |
|---|---|---|
| `ease-expressive-fast-effects` | `duration-expressive-fast-effects` | 150ms |
| `ease-expressive-default-effects` | `duration-expressive-default-effects` | 200ms |
| `ease-expressive-slow-effects` | `duration-expressive-slow-effects` | 300ms |

---

## 5. Spring-Based Motion Tokens — Standard

Use standard motion for utility and secondary UI. No overshoot — feels calm and purposeful.

### Spatial tokens (position, size, shape)

```css
/* Fast — small components or quick utility moves */
--md-sys-motion-standard-fast-spatial-easing:   cubic-bezier(0.27, 1.06, 0.18, 1.00)
--md-sys-motion-standard-fast-spatial-duration:  350ms

/* Default — navigation and content animations */
--md-sys-motion-standard-default-spatial-easing: cubic-bezier(0.27, 1.06, 0.18, 1.00)
--md-sys-motion-standard-default-spatial-duration: 500ms

/* Slow — large layout shifts and full-screen transitions */
--md-sys-motion-standard-slow-spatial-easing:   cubic-bezier(0.27, 1.06, 0.18, 1.00)
--md-sys-motion-standard-slow-spatial-duration:  750ms
```

#### Tailwind utility classes

| Easing utility | Duration utility | Duration |
|---|---|---|
| `ease-spring-standard-fast-spatial` | `duration-spring-standard-fast-spatial` | 350ms |
| `ease-spring-standard-default-spatial` | `duration-spring-standard-default-spatial` | 500ms |
| `ease-spring-standard-slow-spatial` | `duration-spring-standard-slow-spatial` | 750ms |

### Effects tokens (opacity, color, blur)

```css
/* Fast — quick opacity/color changes on utility elements */
--md-sys-motion-standard-fast-effects-easing:   cubic-bezier(0.31, 0.94, 0.34, 1.00)
--md-sys-motion-standard-fast-effects-duration:  150ms

/* Default — nav and content fade, tab indicator */
--md-sys-motion-standard-default-effects-easing: cubic-bezier(0.34, 0.80, 0.34, 1.00)
--md-sys-motion-standard-default-effects-duration: 200ms

/* Slow — opacity changes on large/full-screen areas */
--md-sys-motion-standard-slow-effects-easing:   cubic-bezier(0.34, 0.88, 0.34, 1.00)
--md-sys-motion-standard-slow-effects-duration:  300ms
```

#### Tailwind utility classes

| Easing utility | Duration utility | Duration |
|---|---|---|
| `ease-spring-standard-fast-effects` | `duration-spring-standard-fast-effects` | 150ms |
| `ease-spring-standard-default-effects` | `duration-spring-standard-default-effects` | 200ms |
| `ease-spring-standard-slow-effects` | `duration-spring-standard-slow-effects` | 300ms |

---

## 6. Composite Animation Utilities

These `animate-*` classes are pre-built combinations of a keyframe, duration, and easing — ready to drop on an element.

| Utility class | Keyframe | Duration | Easing | Use case |
|---|---|---|---|---|
| `animate-md-ripple` | `md-ripple` | 450ms | emphasized | Press/click ripple feedback |
| `animate-md-fade-in` | `md-fade-in` | 200ms | expressive default effects | Content appearing, dialog overlay |
| `animate-md-fade-out` | `md-fade-out` | 150ms | standard fast effects | Content disappearing |
| `animate-md-scale-in` | `md-scale-in` | 350ms | expressive fast spatial | Menu/dialog entering |
| `animate-md-scale-out` | `md-scale-out` | 200ms | emphasized accelerate | Menu/dialog exiting |
| `animate-md-slide-in-bottom` | `md-slide-in-bottom` | 500ms | standard default spatial | Sheet/nav bar entering from below |
| `animate-md-slide-out-bottom` | `md-slide-out-bottom` | 200ms | emphasized accelerate | Sheet/nav bar exiting below |
| `animate-md-slide-in-right` | `md-slide-in-right` | 500ms | standard default spatial | Forward navigation, drawer (LTR) |
| `animate-md-slide-out-right` | `md-slide-out-right` | 200ms | emphasized accelerate | Back navigation exit |
| `animate-md-slide-in-left` | `md-slide-in-left` | 500ms | standard default spatial | Navigation drawer, back-nav enter |
| `animate-md-slide-out-left` | `md-slide-out-left` | 200ms | emphasized accelerate | Drawer closing |
| `animate-md-slide-in-top` | `md-slide-in-top` | 500ms | standard default spatial | Notifications, banners |
| `animate-md-slide-out-top` | `md-slide-out-top` | 200ms | emphasized accelerate | Top app bar hiding on scroll |
| `animate-md-skeleton-pulse` | `md-skeleton-pulse` | 700ms | ease-in-out | Skeleton loading shimmer |

### Usage example

```tsx
// Dialog entering
<div className="animate-md-scale-in">...</div>

// Skeleton loader
<div className="animate-md-skeleton-pulse bg-surface-container rounded-md h-4 w-full" />

// Bottom sheet entering
<div className="animate-md-slide-in-bottom">...</div>
```

---

## 7. Keyframes Reference

All keyframes are defined globally (outside `@theme`) and available to any custom animation.

| Keyframe | Description |
|---|---|
| `md-ripple` | Ripple expands from 0 to full size, fades to transparent |
| `md-fade-in` | opacity 0 → 1 |
| `md-fade-out` | opacity 1 → 0 |
| `md-scale-in` | opacity 0 + scale(0.85) → opacity 1 + scale(1) |
| `md-scale-out` | opacity 1 + scale(1) → opacity 0 + scale(0.85) |
| `md-slide-in-bottom` | translateY(100%) + opacity 0 → translateY(0) + opacity 1 |
| `md-slide-out-bottom` | translateY(0) + opacity 1 → translateY(100%) + opacity 0 |
| `md-slide-in-right` | translateX(100%) + opacity 0 → translateX(0) + opacity 1 |
| `md-slide-out-right` | translateX(0) + opacity 1 → translateX(100%) + opacity 0 |
| `md-slide-in-left` | translateX(-100%) + opacity 0 → translateX(0) + opacity 1 |
| `md-slide-out-left` | translateX(0) + opacity 1 → translateX(-100%) + opacity 0 |
| `md-slide-in-top` | translateY(-100%) + opacity 0 → translateY(0) + opacity 1 |
| `md-slide-out-top` | translateY(0) + opacity 1 → translateY(-100%) + opacity 0 |
| `md-skeleton-pulse` | opacity 1 → 0.4 → 1 (infinite loop) |

### Custom animation using raw tokens

```css
.my-card {
  animation: md-scale-in
    var(--md-sys-motion-expressive-default-spatial-duration)
    var(--md-sys-motion-expressive-default-spatial-easing)
    forwards;
}
```

---

## 8. Applying Easing & Duration — Pairing Rules

### Rule 1: Enter uses decelerate, exit uses accelerate

Elements entering the screen decelerate to rest (starting fast). Elements exiting accelerate away (starting slow). Elements already on screen use a standard or emphasized curve.

```tsx
// Button state — stays on screen, uses standard
<button className="transition-all duration-short4 ease-standard" />

// Dialog enter
<div className="transition-all duration-medium4 ease-emphasized-decelerate" />

// Dialog exit
<div className="transition-all duration-short4 ease-emphasized-accelerate" />
```

### Rule 2: Match speed to component size

| Component size | Spring speed tier | Example |
|---|---|---|
| Small (< 48dp) | `fast` | Buttons, chips, badges |
| Standard | `default` | Dialogs, cards, sheets |
| Large / full-screen | `slow` | Full-screen transitions |

### Rule 3: Use effects tokens for opacity/color, spatial for position/size

```tsx
// Correct — opacity uses effects token
<div
  className="transition-opacity"
  style={{ transitionDuration: 'var(--md-sys-motion-expressive-default-effects-duration)',
           transitionTimingFunction: 'var(--md-sys-motion-expressive-default-effects-easing)' }}
/>

// Correct — transform uses spatial token
<div
  className="transition-transform"
  style={{ transitionDuration: 'var(--md-sys-motion-expressive-fast-spatial-duration)',
           transitionTimingFunction: 'var(--md-sys-motion-expressive-fast-spatial-easing)' }}
/>
```

### Rule 4: Expressive for prominent, standard for utility

```tsx
// Expressive — FAB, a hero button: bouncy overshoot
<button className="transition-transform duration-expressive-fast-spatial ease-expressive-fast-spatial" />

// Standard — drawer, navigation: calm and purposeful
<nav className="transition-transform duration-spring-standard-default-spatial ease-spring-standard-default-spatial" />
```

---

## 9. Transition Pattern Recipes

These six patterns cover the most common MD3 screen transitions.

---

### Pattern 1: Container Transform

**Use for:** Card → detail page, List item → full screen, FAB → sheet, Search box expanding.

**How it works:** A persistent container (the card or element) morphs from its starting size and position to fill the destination. The strongest relationship between two screens.

**Motion:** Entry uses `ease-emphasized-decelerate` / `duration-medium4` (400ms). Exit uses `ease-emphasized-accelerate` / `duration-short4` (200ms). The container's `transform` and `border-radius` animate simultaneously.

```tsx
// Enter state — container transforms to fill screen
<div className="transition-all duration-medium4 ease-emphasized-decelerate rounded-md" />

// Exit state — container collapses back
<div className="transition-all duration-short4 ease-emphasized-accelerate" />
```

---

### Pattern 2: Forward and Backward

**Use for:** Inbox → message thread, List item → detail, any hierarchical navigation.

**How it works:** Horizontal sliding motion. Forward = new screen slides in from the right, current screen slides out to the left. Backward = reverse.

**Motion:** Spring standard default spatial (500ms / `cubic-bezier(0.27, 1.06, 0.18, 1.00)`) for entering. Emphasized accelerate (200ms) for exiting. Combine with a simultaneous fade.

```tsx
// Entering screen (forward)
<div className="animate-md-slide-in-right" />

// Exiting screen (forward)
<div className="animate-md-slide-out-left" />
```

---

### Pattern 3: Lateral (Peer Navigation)

**Use for:** Tabs, carousels, image galleries, swiping between peer content.

**How it works:** Horizontal sliding without fade or parallax. Elements slide in unison, creating a strong peer-group relationship.

**Motion:** Use standard default spatial (500ms). No opacity change — the slide alone communicates peer relationship.

```tsx
// Tab content entering from the right (next tab)
<div
  className="transition-transform duration-spring-standard-default-spatial ease-spring-standard-default-spatial"
  style={{ transform: isActive ? 'translateX(0)' : 'translateX(100%)' }}
/>
```

---

### Pattern 4: Top Level (Fade Through)

**Use for:** Navigation bar / rail / drawer destination changes.

**How it works:** The current screen fades out quickly, then the new screen fades in. No spatial relationship implied — content is unrelated.

**Motion:** Fade out with standard fast effects (150ms). Then fade in with standard default effects (200ms). Two-step sequence.

```tsx
// Exiting screen
<div className="animate-md-fade-out" />

// Entering screen (starts after exit completes or after a short delay)
<div className="animate-md-fade-in" />
```

---

### Pattern 5: Enter and Exit

#### Within screen bounds (dialogs, menus, snackbars, FABs)

**Motion:** Scale + fade on entry using expressive fast spatial (350ms). Fade-only on exit using emphasized accelerate (200ms). Direction of expansion is informed by screen edge proximity.

```tsx
// Menu entering
<div className="animate-md-scale-in origin-top-left" />

// Snackbar entering from bottom
<div className="animate-md-slide-in-bottom" />

// Dialog entering
<div className="animate-md-scale-in" />
```

#### Beyond screen bounds (drawers, sheets, app bars)

**Motion:** Slide in/out from the relevant screen edge. Sheet from bottom, drawer from left (LTR), notifications from top. Use standard default spatial (500ms) for entry, emphasized accelerate (200ms) for exit.

```tsx
// Bottom sheet entering
<div className="animate-md-slide-in-bottom" />

// Navigation drawer entering (LTR)
<div className="animate-md-slide-in-left" />

// Top app bar hiding on scroll
<div className="animate-md-slide-out-top" />
```

---

### Pattern 6: Skeleton Loaders

**Use for:** Transitioning from loading state to loaded content.

**How it works:** Skeleton shapes pulse to indicate indeterminate loading. Once content loads, it fades in quickly over the skeleton.

**Motion:** Skeleton uses `md-skeleton-pulse` (700ms infinite). Content fade-in uses standard fast effects (150ms).

```tsx
// Skeleton placeholder
<div className="animate-md-skeleton-pulse bg-surface-container rounded-md h-4 w-48" />

// Content revealing after load
<div className="animate-md-fade-in" />
```

---

## 10. Common UI Effect Combinations

### Ripple press effect

```tsx
<button className="relative overflow-hidden">
  {/* Button content */}
  <span
    className="absolute animate-md-ripple rounded-full bg-on-primary opacity-12"
    style={{ width: '200%', paddingTop: '200%', left: '50%', top: '50%' }}
  />
</button>
```

### State layer hover / focus

State layers use opacity tokens (not motion), but transition them in with a short ease:

```tsx
// Hover state layer fades in
<div className="absolute inset-0 bg-on-surface transition-opacity duration-short2 ease-standard opacity-0 group-hover:opacity-8" />
```

### FAB (Floating Action Button) enter

The FAB enters with the expressive fast spatial spring — a noticeable bounce that makes it feel lively:

```tsx
<button className="transition-transform duration-expressive-fast-spatial ease-expressive-fast-spatial scale-0 data-[visible=true]:scale-100">
  {/* FAB icon */}
</button>
```

### Dialog (basic) enter and exit

```tsx
// Enter: scale + fade in over 400ms
<div className="animate-md-scale-in" />

// Exit: fade + scale out over 200ms
<div className="animate-md-scale-out" />
```

### Navigation drawer slide

```tsx
// Opening — slide in from left
<nav className="animate-md-slide-in-left" />

// Closing — slide out to left
<nav className="animate-md-slide-out-left" />
```

### Tab indicator sliding between tabs (lateral)

The tab indicator slides horizontally with the standard default spatial spring. No fade — pure positional movement communicates the peer relationship:

```tsx
<div
  className="absolute bottom-0 h-0.5 bg-primary transition-transform duration-spring-standard-default-spatial ease-spring-standard-default-spatial"
  style={{ transform: `translateX(${activeIndex * 100}%)`, width: '100%' }}
/>
```

### Snackbar enter from bottom

```tsx
<div className="animate-md-slide-in-bottom" />
```

### Top app bar hiding on scroll

```tsx
<header
  className="transition-transform duration-short4 ease-standard-accelerate"
  style={{ transform: isScrolled ? 'translateY(-100%)' : 'translateY(0)' }}
/>
```

### Tooltip fade in

```tsx
<div className="animate-md-fade-in" />
```

### Navigation bar hiding on scroll (bottom)

```tsx
<nav
  className="transition-transform duration-short4 ease-standard-accelerate"
  style={{ transform: isScrollingDown ? 'translateY(100%)' : 'translateY(0)' }}
/>
```

### Bottom sheet expanding

```tsx
<div className="animate-md-slide-in-bottom" />
```

---

## 11. Reduce-Motion Accessibility

Always respect user preferences for reduced motion. Wrap animated content in a media query check:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

In React, check the preference with `window.matchMedia`:

```tsx
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

<div className={prefersReducedMotion ? '' : 'animate-md-scale-in'}>
  {children}
</div>
```

Or use the [React Aria `useReducedMotion`](https://react-spectrum.adobe.com/react-aria/useReducedMotion.html) hook:

```tsx
import { useReducedMotion } from 'react-aria';

function Dialog() {
  const reducedMotion = useReducedMotion();
  return (
    <div className={reducedMotion ? '' : 'animate-md-scale-in'}>
      {/* content */}
    </div>
  );
}
```

---

## Quick-Reference Cheat Sheet

```
LEGACY PAIRS (transitions)
  Enter prominent  →  ease-emphasized-decelerate  +  duration-medium4  (400ms)
  Exit prominent   →  ease-emphasized-accelerate  +  duration-short4   (200ms)
  On-screen        →  ease-emphasized             +  duration-long2    (500ms)
  Enter utility    →  ease-standard-decelerate    +  duration-medium1  (250ms)
  Exit utility     →  ease-standard-accelerate    +  duration-short4   (200ms)

SPRING EXPRESSIVE (components — bouncy)
  Small spatial    →  ease-expressive-fast-spatial    +  duration-expressive-fast-spatial    (350ms)
  Default spatial  →  ease-expressive-default-spatial +  duration-expressive-default-spatial (500ms)
  Large spatial    →  ease-expressive-slow-spatial    +  duration-expressive-slow-spatial    (650ms)
  Fast fade/color  →  ease-expressive-fast-effects    +  duration-expressive-fast-effects    (150ms)
  Default fade     →  ease-expressive-default-effects +  duration-expressive-default-effects (200ms)
  Slow fade        →  ease-expressive-slow-effects    +  duration-expressive-slow-effects    (300ms)

SPRING STANDARD (components — calm)
  Small spatial    →  ease-spring-standard-fast-spatial    +  duration-spring-standard-fast-spatial    (350ms)
  Default spatial  →  ease-spring-standard-default-spatial +  duration-spring-standard-default-spatial (500ms)
  Large spatial    →  ease-spring-standard-slow-spatial    +  duration-spring-standard-slow-spatial    (750ms)
  Fast fade/color  →  ease-spring-standard-fast-effects    +  duration-spring-standard-fast-effects    (150ms)
  Default fade     →  ease-spring-standard-default-effects +  duration-spring-standard-default-effects (200ms)
  Slow fade        →  ease-spring-standard-slow-effects    +  duration-spring-standard-slow-effects    (300ms)
```

---

*Spec references:*
- *[M3 Motion overview & specs](https://m3.material.io/styles/motion/overview/specs)*
- *[Easing and duration tokens](https://m3.material.io/styles/motion/easing-and-duration/tokens-specs)*
- *[Applying easing and duration](https://m3.material.io/styles/motion/easing-and-duration/applying-easing-and-duration)*
- *[Transition patterns](https://m3.material.io/styles/motion/transitions/transition-patterns)*
- *[Applying transitions](https://m3.material.io/styles/motion/transitions/applying-transitions)*
