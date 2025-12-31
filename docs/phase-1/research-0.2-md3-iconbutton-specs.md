# Research 0.2: Material Design 3 IconButton Specifications

**Date**: 2025-12-31  
**Source**: Material Design 3 Guidelines (m3.material.io)  
**Component**: Icon Button

---

## 📚 Overview

Material Design 3 IconButtons are compact, square buttons that contain only an icon. They are used for actions that can be clearly represented with a single icon and are space-efficient alternatives to regular buttons.

**Official Documentation**: https://m3.material.io/components/icon-buttons/overview

---

## 🎨 IconButton Variants

### 1. **Standard Icon Button** (Default)

**Visual Characteristics:**
- Transparent background by default
- Icon color matches primary (uses `--md-sys-color-on-surface-variant`)
- No border, no elevation
- State layers on interaction
- Square shape (40×40px default)

**Use Cases:**
- App bars and toolbars
- Actions within cards
- Overflow menus
- Navigation actions
- Quick actions

**States:**
- Default: Icon only, transparent background
- Hover: 8% state layer overlay
- Focus: Focus ring visible
- Pressed: 12% state layer overlay
- Disabled: 38% opacity
- Selected: Different icon or color (for toggles)

**Token Mapping:**
```css
background: transparent;
color: var(--md-sys-color-on-surface-variant);
width: 40px;
height: 40px;
border-radius: var(--md-sys-shape-corner-full); /* Circular */
```

---

### 2. **Filled Icon Button**

**Visual Characteristics:**
- Solid background color (uses `--md-sys-color-primary`)
- Contrasting icon color (uses `--md-sys-color-on-primary`)
- No border
- No elevation by default
- Circular shape

**Use Cases:**
- Primary action in a toolbar
- Most important icon action
- When icon needs maximum emphasis
- Floating action alternatives for small spaces

**States:**
- Default: Filled with primary color
- Hover: State layer + slight elevation
- Focus: Focus ring visible
- Pressed: State layer overlay
- Disabled: 12% opacity background, 38% icon
- Selected: Uses primary-container color

**Token Mapping:**
```css
background: var(--md-sys-color-primary);
color: var(--md-sys-color-on-primary);
width: 40px;
height: 40px;
border-radius: var(--md-sys-shape-corner-full);
```

---

### 3. **Filled Tonal Icon Button**

**Visual Characteristics:**
- Secondary container background (uses `--md-sys-color-secondary-container`)
- On-secondary-container icon (uses `--md-sys-color-on-secondary-container`)
- No border, no elevation
- Circular shape

**Use Cases:**
- Alternative to filled when less emphasis needed
- Related actions of equal importance
- When filled is too strong visually

**States:**
- Default: Tonal background
- Hover: State layer overlay
- Focus: Focus ring visible
- Pressed: Darker state layer
- Disabled: 12% opacity background, 38% icon
- Selected: Uses tertiary-container color

**Token Mapping:**
```css
background: var(--md-sys-color-secondary-container);
color: var(--md-sys-color-on-secondary-container);
width: 40px;
height: 40px;
border-radius: var(--md-sys-shape-corner-full);
```

---

### 4. **Outlined Icon Button**

**Visual Characteristics:**
- Transparent background
- 1px border (uses `--md-sys-color-outline`)
- Icon color matches on-surface-variant
- No elevation
- Circular shape

**Use Cases:**
- Medium emphasis icon actions
- When boundary needs to be defined
- Alternative to standard for more visual weight

**States:**
- Default: Outlined with no fill
- Hover: State layer inside border
- Focus: Focus ring visible
- Pressed: State layer overlay
- Disabled: 12% opacity border, 38% icon
- Selected: Filled with inverse-surface

**Token Mapping:**
```css
background: transparent;
border: 1px solid var(--md-sys-color-outline);
color: var(--md-sys-color-on-surface-variant);
width: 40px;
height: 40px;
border-radius: var(--md-sys-shape-corner-full);
```

---

## 📏 Dimensions & Spacing

### **Container Size**

**Fixed dimensions** (icon buttons are always square):

```
Standard: 40×40px (default)
Small: 32×32px (dense UIs)
Large: 48×48px (accessibility, touch priority)
```

**Touch Target:**
```
Minimum: 48×48px (can be achieved with margin/padding)
Visual size can be 40×40px if touch area is 48×48px
```

---

### **Icon Size**

**Icon dimensions within container:**

```
Standard (40×40px container): 24×24px icon
Small (32×32px container): 20×20px icon
Large (48×48px container): 28×28px icon
```

**Spacing:**
```
Icon is centered within container
Padding adjusts automatically based on container size
```

---

### **Padding**

```
Standard: 8px all sides (40px - 24px icon = 16px / 2)
Small: 6px all sides (32px - 20px icon = 12px / 2)
Large: 10px all sides (48px - 28px icon = 20px / 2)
```

---

## 🎭 States & Interactions

### **State Layers**

Same as regular buttons, using opacity overlays:

```css
/* Hover State */
opacity: 0.08; /* 8% overlay */

/* Focus State */
opacity: 0.12; /* 12% overlay */

/* Pressed State */
opacity: 0.12; /* 12% overlay */
```

**Implementation:**
```css
.icon-button:hover::before {
  content: '';
  position: absolute;
  inset: 0;
  background: currentColor;
  opacity: 0.08;
  border-radius: inherit;
}
```

---

### **Disabled State**

```css
/* Icon */
opacity: 0.38; /* 38% opacity */

/* Container (if filled/tonal) */
background: rgba(current-color, 0.12); /* 12% opacity */

/* Behavior */
pointer-events: none;
cursor: not-allowed;
```

---

### **Toggle State (Optional)**

Icon buttons can act as toggle buttons:

**Unselected:**
```css
background: transparent; /* or variant background */
color: var(--md-sys-color-on-surface-variant);
```

**Selected:**
```css
background: var(--md-sys-color-inverse-surface); /* for outlined */
/* or different icon/color for filled variants */
color: var(--md-sys-color-inverse-on-surface);
```

**ARIA:**
```html
<button aria-pressed="true" aria-label="Bold (enabled)">
  <IconBold />
</button>
```

---

## ♿ Accessibility Requirements

### **Mandatory Requirements**

**1. Always Require aria-label**

Since IconButtons have no visible text, they MUST have labels:

```html
<!-- ✅ CORRECT -->
<button aria-label="Delete item">
  <IconDelete />
</button>

<!-- ❌ WRONG - No label -->
<button>
  <IconDelete />
</button>
```

**Why:**
- Screen readers need text to announce
- Icon meaning isn't always clear
- Required for WCAG compliance

---

**2. Touch Targets**

**Minimum size:**
- 48×48px minimum touch area
- Visual size can be smaller (40×40px)
- Use margin/padding to reach 48×48px

**Example:**
```css
/* Visual: 40×40px, Touch: 48×48px */
.icon-button {
  width: 40px;
  height: 40px;
  margin: 4px; /* Creates 48×48px touch area */
}
```

---

**3. Keyboard Navigation**

**Required keys:**
- `Enter`: Activate button
- `Space`: Activate button
- `Tab`: Move focus to/from button

**Focus indicator:**
```css
.icon-button:focus-visible {
  outline: 2px solid var(--md-sys-color-primary);
  outline-offset: 2px;
}
```

---

**4. Color Contrast**

**WCAG 2.1 AA Requirements:**
- Icon vs background: 3:1 minimum (non-text contrast)
- Focus indicator: 3:1 minimum

**MD3 tokens ensure compliance:**
- Standard: `on-surface-variant` has sufficient contrast
- Filled: `on-primary` vs `primary` always passes
- Outlined: Border has 3:1 contrast

---

### **Toggle Button Specific**

For toggle icon buttons:

```html
<button 
  aria-pressed="false"
  aria-label="Mark as favorite"
>
  <IconStarOutline />
</button>

<!-- When toggled: -->
<button 
  aria-pressed="true"
  aria-label="Remove from favorites"
>
  <IconStarFilled />
</button>
```

**Best practices:**
- Change icon when toggled (outline ↔ filled)
- Update aria-label to reflect state
- Use aria-pressed (not aria-checked)
- Provide visual feedback (color/icon change)

---

### **Tooltip Recommendation**

While not required, tooltips are HIGHLY recommended:

```html
<button aria-label="Delete item" title="Delete">
  <IconDelete />
</button>
```

**Why:**
- Helps sighted users understand action
- Shows on hover (desktop)
- Especially important for unfamiliar icons
- Complements aria-label (doesn't replace it)

---

## 🎨 Icon Guidelines

### **Icon Selection**

**Use icons that are:**
- ✅ Universally recognized (delete, edit, close, search)
- ✅ Part of Material Symbols
- ✅ Consistent style across app
- ✅ Clear at small sizes (24×24px)

**Avoid icons that are:**
- ❌ Ambiguous or unclear
- ❌ Brand-specific without context
- ❌ Too complex/detailed
- ❌ Inconsistent style

---

### **Icon States**

**Different states may use different icons:**

```tsx
// Example: Favorite toggle
{isFavorite ? (
  <IconStarFilled /> // Filled star when active
) : (
  <IconStarOutline /> // Outline star when inactive
)}

// Example: Play/Pause
{isPlaying ? (
  <IconPause />
) : (
  <IconPlay />
)}
```

---

### **Icon Colors**

**Standard variant:**
```css
color: var(--md-sys-color-on-surface-variant); /* Gray */
```

**Selected/Active state:**
```css
color: var(--md-sys-color-primary); /* Brand color */
```

**On colored backgrounds:**
```css
color: var(--md-sys-color-on-primary); /* High contrast */
```

---

## 🎯 Use Cases & Patterns

### **App Bar / Toolbar**

Most common use case:

```
[☰ Menu] [Title]           [🔍 Search] [⋮ More]
```

**Characteristics:**
- Standard or outlined variant
- Left: Navigation (menu, back)
- Right: Actions (search, settings, more)
- 8-16px spacing between buttons

---

### **Card Actions**

Actions within cards:

```
┌──────────────────────┐
│ Card Title           │
│ Card content here... │
│                      │
│ [❤] [💾] [📤]       │
└──────────────────────┘
```

**Characteristics:**
- Standard variant (no background)
- Aligned to corners or edges
- 8px spacing between icons
- Use sparingly (max 3-4 actions)

---

### **FAB Alternative**

For small actions:

```
[+] (Filled icon button)
```

**When to use:**
- Action doesn't need label
- Space constrained
- Secondary quick action
- Alternative to mini FAB

---

### **Toggle Controls**

For binary options:

```
[B] [I] [U]  (Bold, Italic, Underline)
```

**Characteristics:**
- Use aria-pressed
- Change icon or background when selected
- Often grouped together
- Clear visual feedback

---

### **List Item Actions**

Trailing actions in lists:

```
Item name                    [✓] [✏] [🗑]
```

**Characteristics:**
- Standard variant
- Right-aligned
- Appear on hover (desktop)
- Always visible (mobile)

---

## 🎨 Visual Specifications

### **Shape**

**Always circular:**
```css
border-radius: var(--md-sys-shape-corner-full); /* 9999px */
/* Creates perfect circle for square containers */
```

**Why circular?**
- Distinctive MD3 style
- Differentiates from regular buttons
- Works for all icon button sizes
- Consistent with FAB shape

---

### **Ripple Effect**

Same as regular buttons:

**Characteristics:**
- Emanates from touch/click point
- Circular ripple bounded to container
- Duration: 450ms
- Easing: emphasized-decelerate
- Opacity: 0.12 → 0

---

### **Elevation**

**Generally no elevation:**
- Standard: No elevation
- Filled: No elevation (unless hovered)
- Outlined: No elevation
- Tonal: No elevation

**Exception:**
- Filled variant on hover: Level 1 elevation (optional)

---

## 🔄 Comparison with Regular Button

| Aspect | IconButton | Regular Button |
|--------|------------|----------------|
| **Shape** | Circular | Pill-shaped (fully rounded) |
| **Size** | Square (40×40px) | Variable width, fixed height |
| **Content** | Icon only | Text ± icon |
| **Label** | aria-label required | Text is label |
| **Use Case** | Compact actions | Primary actions with text |
| **Space** | Minimal (40px) | More space (text width) |
| **Recognition** | Icon must be clear | Text clarifies action |

---

## 📱 Responsive Behavior

### **Mobile**
- Minimum 48×48px touch target CRITICAL
- Standard 40×40px visual with 4px margin
- More spacing between buttons (16px)
- Tooltips less useful (no hover)
- Labels more important

### **Tablet**
- Standard sizing (40×40px)
- Standard spacing (8px)
- Tooltips on long press

### **Desktop**
- Standard sizing
- Hover states important
- Tooltips on hover recommended
- Keyboard focus indicators critical

---

## 🎯 Implementation Checklist

When implementing MD3 IconButton:

### **Visual**
- [ ] 4 variants (standard, filled, tonal, outlined)
- [ ] 3 sizes (small 32px, medium 40px, large 48px)
- [ ] Circular shape (border-radius: 9999px)
- [ ] State layers for hover/focus/pressed
- [ ] Proper icon sizing (24px default)
- [ ] Ripple effect on press
- [ ] Toggle state support (selected/unselected)

### **Functional**
- [ ] onClick handler works
- [ ] Keyboard navigation (Enter/Space)
- [ ] Disabled state prevents interaction
- [ ] Toggle mode with aria-pressed
- [ ] Icon can be any React node
- [ ] Href support for link buttons

### **Accessibility**
- [ ] aria-label REQUIRED (enforced by types)
- [ ] 48×48px minimum touch target
- [ ] Focus indicator visible
- [ ] Color contrast WCAG AA
- [ ] Keyboard accessible
- [ ] Screen reader announces with label
- [ ] aria-pressed for toggles
- [ ] Disabled uses disabled attribute

### **Responsive**
- [ ] Works on mobile (touch)
- [ ] Works on desktop (hover)
- [ ] Touch target always 48×48px
- [ ] Tooltips on hover (desktop)
- [ ] Visual feedback on press

---

## 🎓 Key Takeaways

1. **Always Require aria-label** - No exceptions for icon-only buttons
2. **Circular Shape** - Distinctive MD3 style, always round
3. **48×48px Touch Target** - Visual can be 40×40px with margin
4. **Four Variants** - Standard, filled, tonal, outlined
5. **Icon Size Matters** - 24×24px default, scales with container
6. **Toggle Support** - Use aria-pressed, change icon/color
7. **Tooltips Recommended** - Help users understand action
8. **State Layers** - Use overlays, not color changes
9. **No Text Content** - Icon only, text goes in aria-label
10. **Compact Alternative** - Use when space limited or action clear

---

## ⚠️ Common Mistakes to Avoid

### **1. Missing aria-label**
```tsx
// ❌ WRONG
<IconButton>
  <IconDelete />
</IconButton>

// ✅ CORRECT
<IconButton aria-label="Delete item">
  <IconDelete />
</IconButton>
```

---

### **2. Text Content**
```tsx
// ❌ WRONG - Use regular Button instead
<IconButton aria-label="Delete">
  <IconDelete />
  Delete
</IconButton>

// ✅ CORRECT
<IconButton aria-label="Delete">
  <IconDelete />
</IconButton>
```

---

### **3. Touch Target Too Small**
```css
/* ❌ WRONG */
.icon-button {
  width: 32px;
  height: 32px;
  /* No margin = 32×32px touch area (too small!) */
}

/* ✅ CORRECT */
.icon-button {
  width: 40px;
  height: 40px;
  margin: 4px; /* Creates 48×48px touch area */
}
```

---

### **4. Using aria-checked Instead of aria-pressed**
```html
<!-- ❌ WRONG -->
<button aria-checked="true">
  <IconBold />
</button>

<!-- ✅ CORRECT -->
<button aria-pressed="true" aria-label="Bold (active)">
  <IconBold />
</button>
```

---

### **5. Unclear Icons**
```tsx
// ❌ WRONG - Ambiguous icon
<IconButton aria-label="Do something">
  <IconMysterySymbol />
</IconButton>

// ✅ CORRECT - Clear, recognized icon
<IconButton aria-label="Delete">
  <IconDelete />
</IconButton>
```

---

## 📚 References

- **MD3 Icon Buttons**: https://m3.material.io/components/icon-buttons/overview
- **Material Symbols**: https://fonts.google.com/icons
- **ARIA Button Pattern**: https://www.w3.org/WAI/ARIA/apg/patterns/button/
- **WCAG Touch Targets**: https://www.w3.org/WAI/WCAG21/Understanding/target-size.html
- **MD3 Design Tokens**: https://m3.material.io/foundations/design-tokens

---

## 🔄 Relationship to Other Components

### **vs. Button**
- IconButton: Icon only, circular, compact
- Button: Text ± icon, pill-shaped, more space

### **vs. FAB**
- IconButton: Any action, toolbar/card placement
- FAB: Primary action only, floating placement

### **vs. Checkbox/Radio**
- IconButton: Actions (do something)
- Checkbox/Radio: Selection (choose option)

### **Use IconButton + aria-pressed for toggle controls**
- Similar to checkbox but for actions not selections
- Example: Bold/Italic in text editor

---

## 🎯 Design Decision: Icon Selection

**Good icon choices:**
- ✅ Delete (trash can)
- ✅ Edit (pencil)
- ✅ Close (X)
- ✅ Search (magnifying glass)
- ✅ Menu (hamburger)
- ✅ More (three dots)
- ✅ Share (share symbol)
- ✅ Favorite (heart/star)

**Icons that need text (use Button instead):**
- ❌ Save (floppy disk is outdated)
- ❌ Settings (gear is generic)
- ❌ Profile (person is ambiguous)
- ❌ Advanced features (context-specific)

---

**Research Status**: ✅ Complete  
**Next Step**: Task 0.3 (Research FAB specs)

