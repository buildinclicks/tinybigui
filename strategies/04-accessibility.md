# Accessibility Strategy

> **Status**: ✅ Decided  
> **Last Updated**: December 24, 2025

## 🎯 Overview

Accessibility is a **first-class citizen** in TinyBigUI. Every component must meet WCAG 2.1 AA standards out of the box. This document outlines our accessibility implementation strategy using React Aria.

---

## ♿ Accessibility Standards

### Compliance Target

- **WCAG 2.1 Level AA** (minimum requirement)
- **WCAG 2.2 Level AA** (where applicable)
- **ARIA 1.2** specifications
- **Section 508** compliance (US federal standard)

---

## 🛠️ React Aria Integration

### Why React Aria?

| Feature | Benefit |
|---------|---------|
| **Battle-tested** | Used by Adobe in production products |
| **Comprehensive** | Covers all ARIA patterns |
| **Keyboard navigation** | Built-in and spec-compliant |
| **Screen reader support** | Tested with JAWS, NVDA, VoiceOver |
| **Focus management** | Automatic focus handling |
| **Mobile touch** | Touch-friendly interactions |
| **Internationalization** | Built-in i18n support |

### React Aria Hooks We'll Use

#### For Button Components

```typescript
import { 
  useButton,           // Button interactions
  useFocusRing,       // Focus indicators
  useHover,           // Hover states
  usePress            // Press interactions
} from 'react-aria'
```

#### For Input Components

```typescript
import {
  useTextField,       // Text inputs
  useCheckbox,        // Checkboxes
  useRadio,           // Radio buttons
  useSwitch,          // Switches
  useSlider,          // Sliders
  useNumberField      // Number inputs
} from 'react-aria'
```

#### For Selection Components

```typescript
import {
  useSelect,          // Dropdowns
  useMenu,            // Menus
  useComboBox,        // Autocomplete
  useListBox          // List selections
} from 'react-aria'
```

---

## ⌨️ Keyboard Navigation

### Universal Keyboard Support

All interactive components must support:

| Key | Action |
|-----|--------|
| `Tab` | Move focus forward |
| `Shift + Tab` | Move focus backward |
| `Enter` | Activate focused element |
| `Space` | Toggle/activate (where applicable) |
| `Escape` | Close/cancel (for modals, menus) |
| `Arrow keys` | Navigate within component (lists, menus) |

### Component-Specific Patterns

#### Menu Navigation

```
↑/↓     - Navigate items
Home    - First item
End     - Last item
Enter   - Select item
Escape  - Close menu
A-Z     - Type-ahead search
```

#### Slider

```
↑/→     - Increase value
↓/←     - Decrease value
Home    - Minimum value
End     - Maximum value
Page Up - Increase by 10%
Page Down - Decrease by 10%
```

#### Radio Group

```
↑/←     - Previous option
↓/→     - Next option
Space   - Select focused option
```

**Implementation**: React Aria handles all of this automatically! 🎉

---

## 🎨 Focus Management

### Focus Indicators

MD3 specifies focus indicators for all interactive components:

```css
.md-component:focus-visible {
  outline: 2px solid var(--md-sys-color-primary);
  outline-offset: 2px;
}
```

### Focus Ring Hook

```typescript
import { useFocusRing } from 'react-aria'

function Button(props) {
  const { isFocusVisible, focusProps } = useFocusRing()
  
  return (
    <button
      {...focusProps}
      className={cn(
        'md-button',
        isFocusVisible && 'ring-2 ring-primary ring-offset-2'
      )}
    >
      {props.children}
    </button>
  )
}
```

### Focus Trap

For modals and dialogs:

```typescript
import { useDialog } from 'react-aria'

function Dialog(props) {
  const { dialogProps } = useDialog(props, ref)
  // React Aria handles focus trapping automatically
}
```

---

## 🔊 Screen Reader Support

### ARIA Labels

All interactive elements must have accessible labels:

```typescript
// Explicit label
<Button aria-label="Close dialog">
  <CloseIcon />
</Button>

// Labeled by another element
<Button aria-labelledby="dialog-title">
  OK
</Button>

// Descriptive text
<Button aria-describedby="tooltip-1">
  Help
</Button>
```

### ARIA Live Regions

For dynamic content updates:

```typescript
// Snackbar/Toast
<div 
  role="status" 
  aria-live="polite"
  aria-atomic="true"
>
  {message}
</div>

// Error message
<div 
  role="alert"
  aria-live="assertive"
>
  {error}
</div>
```

### ARIA States

Components must reflect their state:

```typescript
<Button
  aria-pressed={isPressed}     // Toggle buttons
  aria-expanded={isExpanded}   // Collapsible content
  aria-selected={isSelected}   // Selectable items
  aria-checked={isChecked}     // Checkboxes
  aria-disabled={isDisabled}   // Disabled state
  aria-invalid={isInvalid}     // Validation errors
/>
```

**Implementation**: React Aria hooks add appropriate ARIA attributes automatically!

---

## 🎯 Component-Specific Accessibility

### Button

```typescript
import { useButton } from 'react-aria'

function Button(props) {
  const ref = useRef(null)
  const { buttonProps } = useButton(props, ref)
  
  // Automatically includes:
  // - role="button" (if not a <button> element)
  // - aria-disabled (if disabled)
  // - Keyboard handlers (Enter, Space)
  // - Pointer event handlers
  
  return <button {...buttonProps} ref={ref} />
}
```

### Checkbox

```typescript
import { useCheckbox } from 'react-aria'
import { useToggleState } from 'react-stately'

function Checkbox(props) {
  const state = useToggleState(props)
  const { inputProps } = useCheckbox(props, state, ref)
  
  // Automatically includes:
  // - role="checkbox"
  // - aria-checked
  // - aria-invalid (if validation fails)
  // - Keyboard support
  
  return <input {...inputProps} type="checkbox" />
}
```

### TextField

```typescript
import { useTextField } from 'react-aria'

function TextField(props) {
  const { labelProps, inputProps, errorMessageProps } = useTextField(props, ref)
  
  // Automatically includes:
  // - aria-labelledby
  // - aria-describedby (for errors/help text)
  // - aria-required
  // - aria-invalid
  
  return (
    <>
      <label {...labelProps}>{props.label}</label>
      <input {...inputProps} />
      {props.errorMessage && (
        <span {...errorMessageProps}>{props.errorMessage}</span>
      )}
    </>
  )
}
```

---

## 🌈 Color Contrast

### WCAG Contrast Requirements

| Content Type | Normal Text | Large Text | UI Components |
|-------------|-------------|------------|---------------|
| **Level AA** | 4.5:1 | 3:1 | 3:1 |
| **Level AAA** | 7:1 | 4.5:1 | 4.5:1 |

**Target**: AA for all components, AAA where possible.

### MD3 Color System Compliance

MD3's color system is designed for accessibility:

- `primary` / `on-primary` = guaranteed 4.5:1+ contrast
- `surface` / `on-surface` = guaranteed 4.5:1+ contrast
- All color pairs tested for WCAG compliance

**Verification**: All custom color schemes will be validated for contrast ratios.

---

## 🧪 Accessibility Testing Strategy

### 1. Automated Testing

#### axe-core Integration

```typescript
// Component test
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

test('Button has no accessibility violations', async () => {
  const { container } = render(<Button>Click me</Button>)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

#### Storybook A11y Addon

```typescript
// .storybook/main.ts
export default {
  addons: [
    '@storybook/addon-a11y',  // Automatic a11y checks in Storybook
  ],
}
```

### 2. Manual Testing Checklist

For each component:

- [ ] **Keyboard navigation** works without mouse
- [ ] **Focus indicators** are visible
- [ ] **Screen reader** announces correctly (test with VoiceOver/NVDA)
- [ ] **Color contrast** meets WCAG AA
- [ ] **Text scaling** to 200% doesn't break layout
- [ ] **Touch targets** are minimum 44x44px
- [ ] **Error messages** are announced to screen readers
- [ ] Works with **browser zoom** at 200%

### 3. Screen Reader Testing

Test with:
- **macOS/iOS**: VoiceOver
- **Windows**: NVDA (free, most common)
- **Windows**: JAWS (if available)
- **Android**: TalkBack

### 4. Continuous A11y Monitoring

```typescript
// CI/CD pipeline
- Run axe tests on all components
- Check color contrast ratios
- Validate ARIA usage
- Fail build if violations found
```

---

## 📱 Touch Accessibility

### Touch Target Sizes

**WCAG 2.2 Success Criterion 2.5.8**: Touch targets must be at least 24×24 CSS pixels.

**Our Standard**: **44×44 pixels** (iOS guideline, more generous)

```css
.md-button {
  min-height: 44px;
  min-width: 44px;
  padding: 0 16px; /* Add padding to increase hit area */
}

/* Icon-only buttons */
.md-icon-button {
  width: 48px;   /* MD3 spec + our accessibility standard */
  height: 48px;
}
```

### Touch Gesture Support

React Aria provides touch gesture support:

```typescript
import { usePress } from 'react-aria'

function Button(props) {
  const { pressProps } = usePress({
    onPress: props.onPress,
    // Handles touch, mouse, and keyboard uniformly
  })
  
  return <button {...pressProps}>{props.children}</button>
}
```

---

## 🌍 Internationalization (i18n)

React Aria includes i18n support:

```typescript
import { I18nProvider } from 'react-aria'

<I18nProvider locale="en-US">
  <App />
</I18nProvider>

// React Aria automatically:
// - Formats dates/numbers per locale
// - Adjusts keyboard navigation for RTL
// - Provides localized ARIA labels
```

**Decision**: We'll leverage React Aria's i18n. Users can wrap app in `I18nProvider`.

---

## 🚨 Error Handling & Validation

### Accessible Error Messages

```typescript
function TextField(props) {
  const { inputProps, errorMessageProps } = useTextField(props, ref)
  
  return (
    <>
      <input 
        {...inputProps}
        aria-invalid={props.isInvalid}
        aria-errormessage={props.isInvalid ? errorId : undefined}
      />
      {props.isInvalid && (
        <span 
          {...errorMessageProps}
          id={errorId}
          role="alert"  // Announced immediately
        >
          {props.errorMessage}
        </span>
      )}
    </>
  )
}
```

### Validation Announcements

Use live regions for validation:

```typescript
<div role="alert" aria-live="assertive">
  {validationErrors.map(error => (
    <div key={error.field}>{error.message}</div>
  ))}
</div>
```

---

## 📚 Documentation Requirements

Every component's documentation must include:

### Accessibility Section

1. **Keyboard Support Table**
   - List all supported keyboard shortcuts
   
2. **ARIA Information**
   - Roles, states, and properties used
   
3. **Screen Reader Testing**
   - What screen readers announce
   
4. **Focus Management**
   - How focus is managed
   
5. **Examples**
   - Accessible usage examples

### Example Documentation Template

````markdown
## Accessibility

### Keyboard Support

| Key | Function |
|-----|----------|
| Enter | Activates the button |
| Space | Activates the button |

### ARIA Attributes

- `role="button"` - Identifies the element as a button
- `aria-disabled` - Indicates disabled state
- `aria-pressed` - For toggle buttons

### Screen Reader Support

The button is announced as "Button name, button" and its state (pressed/disabled) is communicated.

### Focus Management

The button receives focus via Tab key and displays a visible focus ring.
````

---

## ✅ Accessibility Checklist

Before releasing any component:

### Keyboard
- [ ] All functionality available via keyboard
- [ ] Focus indicator visible and meets contrast requirements
- [ ] Tab order is logical
- [ ] No keyboard traps

### Screen Readers
- [ ] All interactive elements have accessible names
- [ ] State changes are announced
- [ ] Error messages are announced
- [ ] Form labels are properly associated

### Visual
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] Information not conveyed by color alone
- [ ] Focus indicators are visible
- [ ] Text can scale to 200% without loss of content

### Mobile/Touch
- [ ] Touch targets are minimum 44×44 pixels
- [ ] Gestures work consistently
- [ ] No hover-only content

### Testing
- [ ] Passes automated axe tests
- [ ] Tested with keyboard only
- [ ] Tested with screen reader
- [ ] Tested at 200% zoom

---

## 🎓 Team Knowledge

### Required Reading

All contributors should read:
1. [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
2. [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
3. [React Aria Documentation](https://react-spectrum.adobe.com/react-aria/)

### A11y Champions

Designate team members as accessibility champions to:
- Review all PRs for accessibility
- Stay updated on a11y best practices
- Conduct screen reader testing

---

## 🔗 References

- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/Understanding/)
- [ARIA 1.2](https://www.w3.org/TR/wai-aria-1.2/)
- [React Aria](https://react-spectrum.adobe.com/react-aria/)
- [axe-core](https://github.com/dequelabs/axe-core)
- [WebAIM](https://webaim.org/)
- [A11y Project](https://www.a11yproject.com/)

