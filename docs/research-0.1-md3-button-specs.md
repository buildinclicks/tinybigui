# Research 0.1: Material Design 3 Button Specifications

**Date**: 2025-12-31  
**Source**: Material Design 3 Guidelines (m3.material.io)  
**Component**: Common Buttons (Button, Text Button, Outlined Button, etc.)

---

## 📚 Overview

Material Design 3 Buttons are interactive components that trigger actions. They come in five distinct variants, each with specific use cases and visual treatments.

**Official Documentation**: https://m3.material.io/components/buttons/overview

---

## 🎨 Button Variants

### 1. **Filled Button** (Highest Emphasis)

**Visual Characteristics:**
- Solid background color (uses `--md-sys-color-primary`)
- White or contrasting text color (uses `--md-sys-color-on-primary`)
- Elevation level 0 (flat by default)
- Elevation level 1 on hover
- Container shape: fully rounded corners (--md-sys-shape-corner-full)

**Use Cases:**
- Primary action in a view
- Final action in a flow (e.g., "Submit", "Save", "Continue")
- Most important action that users should take

**States:**
- Default: Filled with primary color
- Hover: Slight elevation (1dp shadow)
- Focus: Focus ring visible
- Pressed: Darker overlay (state layer)
- Disabled: Reduced opacity, no interaction

**Token Mapping:**
```css
background: var(--md-sys-color-primary);
color: var(--md-sys-color-on-primary);
border-radius: var(--md-sys-shape-corner-full);
```

---

### 2. **Outlined Button** (Medium Emphasis)

**Visual Characteristics:**
- Transparent background
- 1px border (uses `--md-sys-color-outline`)
- Text color matches primary (uses `--md-sys-color-primary`)
- No elevation
- Container shape: fully rounded corners

**Use Cases:**
- Secondary actions
- Alternative to filled button when less emphasis needed
- Multiple actions of equal importance

**States:**
- Default: Outlined with no fill
- Hover: Surface tint overlay
- Focus: Focus ring visible
- Pressed: State layer overlay
- Disabled: Reduced opacity border and text

**Token Mapping:**
```css
background: transparent;
border: 1px solid var(--md-sys-color-outline);
color: var(--md-sys-color-primary);
border-radius: var(--md-sys-shape-corner-full);
```

---

### 3. **Text Button** (Low Emphasis)

**Visual Characteristics:**
- Completely transparent background
- No border
- Text color matches primary
- No elevation
- Container shape: fully rounded corners (for interactive area)

**Use Cases:**
- Tertiary actions
- Actions in dialogs
- Inline actions
- Actions that shouldn't dominate the interface

**States:**
- Default: Text only, no background
- Hover: Subtle state layer
- Focus: Focus ring visible
- Pressed: State layer overlay
- Disabled: Reduced opacity text

**Token Mapping:**
```css
background: transparent;
border: none;
color: var(--md-sys-color-primary);
padding: 10px 12px; /* Less padding than filled */
```

---

### 4. **Elevated Button** (Alternative Emphasis)

**Visual Characteristics:**
- Light surface color background (uses `--md-sys-color-surface`)
- Colored text (uses `--md-sys-color-primary`)
- Elevation level 1 (1dp shadow)
- Elevation level 2 on hover
- Container shape: fully rounded corners

**Use Cases:**
- Actions that need to stand out from a patterned background
- Alternative to filled button for less visual weight
- When button needs elevation but not color emphasis

**States:**
- Default: Level 1 elevation
- Hover: Level 2 elevation
- Focus: Focus ring visible
- Pressed: Level 1 elevation with state layer
- Disabled: No elevation, reduced opacity

**Token Mapping:**
```css
background: var(--md-sys-color-surface);
color: var(--md-sys-color-primary);
box-shadow: var(--md-sys-elevation-1);
border-radius: var(--md-sys-shape-corner-full);
```

---

### 5. **Tonal Button** (Medium Emphasis, Alternative)

**Visual Characteristics:**
- Secondary container color (uses `--md-sys-color-secondary-container`)
- On-secondary-container text (uses `--md-sys-color-on-secondary-container`)
- No elevation
- Container shape: fully rounded corners

**Use Cases:**
- Alternative to filled button
- Related actions of equal importance
- Actions that need emphasis but not primary color

**States:**
- Default: Tonal background
- Hover: State layer overlay
- Focus: Focus ring visible
- Pressed: Darker state layer
- Disabled: Reduced opacity

**Token Mapping:**
```css
background: var(--md-sys-color-secondary-container);
color: var(--md-sys-color-on-secondary-container);
border-radius: var(--md-sys-shape-corner-full);
```

---

## 🎨 Color Schemes

Buttons support multiple color schemes through semantic tokens:

### **Primary** (Default)
```css
--md-sys-color-primary
--md-sys-color-on-primary
--md-sys-color-primary-container
--md-sys-color-on-primary-container
```

### **Secondary**
```css
--md-sys-color-secondary
--md-sys-color-on-secondary
--md-sys-color-secondary-container
--md-sys-color-on-secondary-container
```

### **Tertiary**
```css
--md-sys-color-tertiary
--md-sys-color-on-tertiary
--md-sys-color-tertiary-container
--md-sys-color-on-tertiary-container
```

### **Error**
```css
--md-sys-color-error
--md-sys-color-on-error
--md-sys-color-error-container
--md-sys-color-on-error-container
```

---

## 📏 Dimensions & Spacing

### **Height (Fixed)**
```
- Small: 32px (rare, custom)
- Medium: 40px (default, most common)
- Large: 48px (touch targets, accessibility)
```

### **Padding**
```
- Horizontal: 24px (default)
- With icon: 16px leading, 24px trailing
- Icon-only: 8px all sides (creates 40×40px touch target)
```

### **Min Width**
```
- Default: 64px minimum
- No maximum, expands with content
```

### **Icon Size**
```
- Default: 18px × 18px
- Large buttons: 24px × 24px
```

### **Typography**
```
Font: var(--md-sys-typescale-label-large-font)
Size: 14px (label-large)
Weight: 500 (medium)
Letter-spacing: 0.1px
Line-height: 20px
Text-transform: none (respect original case)
```

---

## 🎭 States & Interactions

### **State Layers**

MD3 uses state layers (overlays) to indicate interaction states:

```css
/* Hover State */
opacity: 0.08; /* 8% overlay of on-surface color */

/* Focus State */
opacity: 0.12; /* 12% overlay */

/* Pressed State */
opacity: 0.12; /* 12% overlay */

/* Dragged State (rare) */
opacity: 0.16; /* 16% overlay */
```

**Implementation:**
```css
.button:hover::before {
  content: '';
  position: absolute;
  inset: 0;
  background: currentColor;
  opacity: 0.08;
}
```

---

### **Disabled State**

```css
opacity: 0.38; /* 38% opacity for text and icons */
background: rgba(0, 0, 0, 0.12); /* 12% opacity for container */
pointer-events: none;
cursor: not-allowed;
```

**Behavior:**
- No hover/focus/pressed states
- No interaction
- Lower contrast (still readable)
- Should use `disabled` attribute, not `aria-disabled`

---

### **Loading State**

Not officially specified in MD3, but common pattern:

```
- Show spinner or progress indicator
- Disable interaction (similar to disabled)
- Keep original styling (not grayed out)
- Optional: Show "Loading..." text
```

---

## ♿ Accessibility Requirements

### **Keyboard Navigation**

**Required keys:**
- `Enter`: Activate button
- `Space`: Activate button
- `Tab`: Move focus to/from button
- `Shift+Tab`: Move focus backwards

**Focus indicator:**
```css
/* Must be visible and distinct */
outline: 2px solid var(--md-sys-color-primary);
outline-offset: 2px;
```

---

### **ARIA Attributes**

**Required:**
```html
<button type="button">
  <!-- Type defaults to "submit" in forms, be explicit -->
</button>
```

**Conditional:**
```html
<!-- If icon-only, must have label -->
<button aria-label="Delete item">
  <IconTrash />
</button>

<!-- If loading -->
<button aria-busy="true">
  Submitting...
</button>

<!-- If disabled -->
<button disabled>
  <!-- Use disabled attribute, NOT aria-disabled for buttons -->
  Submit
</button>

<!-- If toggle button -->
<button aria-pressed="true">
  Bold
</button>
```

---

### **Touch Targets**

**Minimum size:**
- 48×48px minimum for touch devices
- Can be achieved through padding/margin
- Interactive area, not just visual size

**Example:**
```css
/* Visual size: 40×40px */
/* Touch target: 48×48px */
.button {
  height: 40px;
  padding: 0 24px;
  /* Add 4px margin to reach 48px */
  margin: 4px;
}
```

---

### **Color Contrast**

**WCAG 2.1 AA Requirements:**
- Normal text: 4.5:1 minimum
- Large text (14px+ bold): 3:1 minimum
- Non-text (icons): 3:1 minimum

**MD3 tokens guarantee these ratios:**
- `on-primary` vs `primary`: ≥4.5:1
- `on-secondary` vs `secondary`: ≥4.5:1
- All semantic pairs meet standards

---

## 🔤 Content Guidelines

### **Text Content**

**Best Practices:**
- Use sentence case ("Sign up", not "Sign Up")
- Be concise (1-2 words ideal)
- Use verbs ("Save", "Delete", "Continue")
- Avoid ambiguity ("OK" → "Save changes")
- Match user's language

**Examples:**
- ✅ Good: "Continue", "Save draft", "Delete account"
- ❌ Bad: "OK", "Submit", "Click here"

---

### **Icon Usage**

**With Text:**
```html
<!-- Leading icon (recommended) -->
<button>
  <Icon name="add" />
  Add item
</button>

<!-- Trailing icon (rare) -->
<button>
  Download
  <Icon name="download" />
</button>
```

**Icon Only:**
```html
<!-- Must have aria-label -->
<button aria-label="Add new item">
  <Icon name="add" />
</button>
```

**Icon Requirements:**
- Always provide tooltip on hover
- Must convey meaning independently
- Use familiar icons (standard Material icons)

---

## 🎨 Visual Specifications

### **Ripple Effect**

MD3 uses ripple effects for press feedback:

**Characteristics:**
- Emanates from touch/click point
- Uses state layer color
- Duration: 450ms (emphasized-decelerate easing)
- Opacity: 0.12 → 0
- Bounded to button container

**CSS Animation:**
```css
@keyframes ripple {
  from {
    transform: scale(0);
    opacity: 0.12;
  }
  to {
    transform: scale(4);
    opacity: 0;
  }
}

animation: ripple 450ms var(--md-sys-motion-easing-emphasized-decelerate);
```

---

### **Shape & Corners**

**Container Shape:**
```css
border-radius: var(--md-sys-shape-corner-full); /* 9999px */
```

**Why fully rounded?**
- Distinctive MD3 style
- Pill-shaped appearance
- Works with any button width
- Consistent with MD3 design language

---

### **Elevation**

**Shadow Tokens:**
```css
/* Elevated Button */
--md-sys-elevation-1: /* default */
--md-sys-elevation-2: /* hover */

/* Filled Button (hover) */
--md-sys-elevation-1: /* hover only */
```

**Values:**
- Level 0: No shadow (most buttons)
- Level 1: Subtle shadow (elevated buttons, hover)
- Level 2: More pronounced (elevated hover)

---

## 🔄 Button Combinations

### **Button Groups**

**Horizontal:**
```
[Outlined] [Outlined] [Filled]
```
- Primary action (filled) on right
- Secondary actions (outlined) on left
- Consistent spacing (8px gap)

**Vertical (Mobile):**
```
[Filled]
[Outlined]
[Text]
```
- Primary on top
- Stack in order of importance
- Full width on mobile

---

### **Icon Buttons vs Regular Buttons**

**Use Icon Button when:**
- Action is universally recognized (delete, edit, close)
- Space is limited (toolbars, app bars)
- Repeated frequently in UI

**Use Regular Button when:**
- Action needs text label for clarity
- Primary action in a flow
- First time users encounter action

---

## 📱 Responsive Behavior

### **Mobile**
- Minimum 48×48px touch target
- Often full width
- Larger text (16px) optional
- More padding (vertical space)

### **Tablet**
- Standard sizing (40px height)
- Flexible width
- Standard spacing

### **Desktop**
- Standard sizing
- Hover states important
- Focus visible for keyboard users
- Smaller minimum width acceptable

---

## 🎯 Implementation Checklist

When implementing MD3 Button, ensure:

### **Visual**
- [ ] All 5 variants implemented (filled, outlined, text, elevated, tonal)
- [ ] All 4 color schemes work (primary, secondary, tertiary, error)
- [ ] State layers for hover/focus/pressed
- [ ] Proper elevation shadows
- [ ] Fully rounded corners (pill shape)
- [ ] Ripple effect on press
- [ ] Loading state with spinner

### **Functional**
- [ ] onClick handler works
- [ ] Keyboard navigation (Enter/Space)
- [ ] Disabled state prevents interaction
- [ ] Form submission works (type="submit")
- [ ] Can contain icon + text
- [ ] Can be icon-only

### **Accessibility**
- [ ] Minimum 48×48px touch target
- [ ] Focus indicator visible
- [ ] ARIA labels for icon-only
- [ ] Color contrast WCAG AA
- [ ] Keyboard accessible
- [ ] Screen reader announces correctly
- [ ] Disabled uses disabled attribute

### **Responsive**
- [ ] Works on mobile (touch)
- [ ] Works on tablet
- [ ] Works on desktop (hover)
- [ ] Scales appropriately
- [ ] Full width option available

---

## 📚 References

- **MD3 Buttons**: https://m3.material.io/components/buttons/overview
- **MD3 Guidelines**: https://m3.material.io/foundations
- **MD3 Tokens**: https://m3.material.io/foundations/design-tokens
- **Accessibility**: https://www.w3.org/WAI/ARIA/apg/patterns/button/
- **Material Symbols**: https://fonts.google.com/icons

---

## 🎓 Key Takeaways

1. **Five Variants**: Each has specific use case and visual treatment
2. **State Layers**: Use opacity overlays, not color changes
3. **Fully Rounded**: Distinctive MD3 pill shape (border-radius: 9999px)
4. **Accessibility First**: 48×48px touch targets, keyboard nav, ARIA labels
5. **Color Schemes**: Support primary, secondary, tertiary, error
6. **Typography**: Label-large (14px, 500 weight, 0.1px spacing)
7. **Ripple Effect**: 450ms emanating from touch point
8. **Elevation**: Only for elevated variant and hover states
9. **Icon Support**: Leading/trailing icons, icon-only with aria-label
10. **Responsive**: Minimum 48×48px, full width option on mobile

---

**Research Status**: ✅ Complete  
**Next Step**: Task 0.2 (Research IconButton specs)

