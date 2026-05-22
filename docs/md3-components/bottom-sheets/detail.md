# Bottom Sheet

Bottom sheets show secondary content anchored to the bottom of the screen

## Overview

- Two variants: standard and modal
- Content should be additional or secondary (not the app’s main content)
- Bottom sheets can be dismissed in order to interact with the main content

### Standard Variant
Standard bottom sheets display supplementary content without blocking access to the screen’s primary content, such as an audio player at the bottom of a music app.

### Modal Variant
Modal bottom sheets appear in front of app content, disabling all other app functionality when they appear, and remaining on screen until confirmed, dismissed, or a required action has been taken.

### Reference image for both variants

Here is reference image: `docs/md3-components/bottom-sheets/images/overview.png`

Where in the image:
- Circle with 1 in the image represents to "Standard Variant"
- Circle with 2 in the image represents to "Modal Variant"

### Additional Figma MD3 Links

1. Standard Variant: https://www.figma.com/design/5DpDntFi57KJ96jZ9qBLLv/Material-3-Design-Kit--Community-?node-id=51827-5860&t=RehhLFdHwzbiGZzA-4
2. Modal Variant: https://www.figma.com/design/5DpDntFi57KJ96jZ9qBLLv/Material-3-Design-Kit--Community-?node-id=51827-5863&t=RehhLFdHwzbiGZzA-4
3. The Bottom Sheet component with both variants: https://www.figma.com/design/5DpDntFi57KJ96jZ9qBLLv/Material-3-Design-Kit--Community-?node-id=51827-5859&t=RehhLFdHwzbiGZzA-4


## Specs

Modal bottom sheets are above a scrim while standard bottom sheets don't have a scrim. Besides this, both variants of bottom sheets have the same specs.

Reference Image: `docs/md3-components/bottom-sheets/images/specs.png`

Where:
- Circle with 1 in it, represents to "Container"
- Circle with 2 in it, represents to "Drag handle" (optional)
- Circle with 3 in it, Scrim

## Tokens and specs

Take all the token values based on the Token Context 1 and Token Context 2 from the file `docs/md3-components/bottom-sheets/tokens.md`

## Measurements

Read measurements detail from `docs/md3-components/bottom-sheets/measurements.md` for Bottom sheet padding and size measurements.

Bottom sheets span the full window width up to 640dp. When the window width exceeds 640dp, bottom sheets adjust to have a top margin of 56dp and side margins of 56dp. 

| Attribute | Value |
|---|---|
| Drag handle alignment (horizontal) | Center |
| Drag handle padding top/bottom | 22dp |
| Top margin | 72dp |
| Top margin (window width > 640dp) | 56dp |
| Start/end margin (window width > 640dp) | 56dp |
| Width | Full width, up to max-width 640dp |
| Height | Variable |

## Accessibility

Users should be able to:
- Resize bottom sheets without having to rely on touch gestures

### Interaction & style

#### Tourch target area

The top 48dp portion of the bottom sheet is interactive when user-initiated resizing is available and the drag handle is present.

To ensure touch target accessibility, the top portion of a bottom sheet can be reserved for resize interactions (see the pink colored area in the `docs/md3-components/bottom-sheets/images/tourch-area.png` for reference)

#### Initial Focus

The optional drag handle can be focused (A focused state communicates when a user has highlighted an element, using an input method such as a keyboard or voice) in the tab order and interacted with using non-touch inputs (Inputs are devices that provide interactive control of an app. Common inputs are a mouse, keyboard, and touchpad), such as keyboard or switch (Switches toggle the state of an item on or off) controls.

Visible focus must be shown on the drag handle affordance

#### Dragging

- Include a single-pointer alternative for any action that can be completed by dragging.
- Drag handles should cycle the bottom sheet through available heights when selected. If a drag handle can’t be used, add a button to do this action.
- Interacting with the drag handle can quickly move a bottom sheet through preset heights
- A bottom sheet can automatically resize to another height after interacting with the drag handle

### Keyboard navigation

| Keys | Actions |
|---|---|
| Tab | Focus lands on drag handle |
| Space / Enter | Toggles between available heights |

### Labeling

Label only the drag handle. The accessibility (Accessible design makes products usable for people with all kinds of abilities) role for the drag handle is “button.”