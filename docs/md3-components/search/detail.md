# Search Component
Search let's people enter a keyword or phrase to get relevant information.

## Overview

- Use search for navigating a product with queries
- A search bar can include a leading search icon, hinted search text, and optional trailing icons
- Search can display suggested keywords or phrases as a person types
- A search bar displays search suggestions or results in a list (Lists are continuous, vertical indexes of text and images. We already have `List` component for this.)
- Use a search app bar (App bars contain page navigation and information at the top of a screen. We already have `AppBar` component for this.) to provide an emphasized, global entry-point
- When inputting text, search suggestions or results appear below the search bar

### Different States of Search Component

1. Maximized State `/docs/md3-components/search/images/default-open.png`
2. Focused State `/docs/md3-components/search/images/focused.png`

Below is more detail about these states:

#### Maximized State

- The search component will show with its max width defined
- The left side will be one icon (search icon default) with text placeholder and right side horizontally stacked icon/avatar buttons
- When user click on this, it will go to the `Focused State`

#### Focused State

- The search component will grow wider little a bit with an ease effect
- As user input text then search result wil show just below that and it will be an overlay (popover)
- Also, all the right side icon buttons will be replaced by a close icon button. Clicking this will reset the search component but will keep in the focus state
- Also, the left side icon button will be replaced with the back arrow button and clicking on that will take the search component to its Maximized State back

### M3 Expressive Update

Search has a new visual style, motion, and more flexibility for trailing icons.

#### Naming

- Search bar and search view are now collectively named search

#### Configurations

- Styles: Search can be contained (recommended) or divided
- Gaps can separate results into groups

#### Motion

- The search bar grows wider when focused

## Specs

### Variant

When a person executes a search, results appear in a list below the search bar `/docs/md3-components/search/images/focused.png`

- It has only one variant "Search"

### Configurations

#### Style

Search comes in two styles:

- Contained: Has an `expressive` `docs/md3-components/search/images/expressive.png` (M3 Expressive is a major update to Material 3, adding visually stunning features, components, and variants, plus updates to the shape, motion, and typography systems.) look and feel. It uses a filled container to separate a search bar from a list of suggestions or results
- Divided `baseline` `docs/md3-components/search/images/baseline.png` (Baseline variants and styles are the original M3 component designs. They may not have the latest features introduced in M3 Expressive, like updated motion, shapes, type, and styles.): Doesn’t have the latest visual style, motion, or flexibility

More info:
- The contained style has a persistent, filled container, expressive motion, and rounded shape
- The divided (baseline) style uses a divider to separate the search bar from suggestions and results

#### Layout

Search suggestions and results appear in customizable lists, with two layout options: full-screen and docked.

- Full-screen Layout in the contained style (Ref. `docs/md3-components/search/images/full-screen-layout.png`)
- Docked Layout in the contained style (Ref. `docs/md3-components/search/images/docked-layout.png`)
- Full-screen Layout in the divided style (Ref. `docs/md3-components/search/images/full-screen-layout-divided.png`)
- Docked Layout in the divided style (Ref. `docs/md3-components/search/images/docked-layout-divided.png`)


- `docs/md3-components/search/tokens/layout-text.md`

## Anatomy

Search includes a search bar and a container for suggestions and results. The container is empty by default. Use the list component to add content. In the divided (baseline) style, a divider separates the search bar and results.

Read this anatomy image: `docs/md3-components/search/images/anatomy.png`

and here are is detail of the marked numbers in the above anatomy image:

1. Search bar container
2. Leading icon
3. Supporting text
4. Trailing icon and avatar (optional)
5. Input text
6. Container for search suggestions or results

### Examples

Read this examples image: `docs/md3-components/search/images/examples.png`

and in the above examples image, marked numbers represent following:

1. With avatar
2. With one trailing icon button
3. With two trailing icon buttons
4. With trailing icon button and avatar


## Color

Color values are implemented through design tokens. For designers, this means working with color values that correspond with tokens. In implementation, a color value will be a token that references a value.

### Full-screen layout

Read this image `docs/md3-components/search/images/color-anatomy.png`

Full-screen search color roles used in light and dark themes:

1. Surface container low
2. On surface variant
3. On surface variant
4. Surface container high
5. On surface variant
6. On surface

### Docked Layout

Read this image `docs/md3-components/search/images/color-docked-layout.png`

Docked search color roles used in light and dark themes:

1. Surface container high 
2. On surface variant
3. On surface variant
4. Surface container high
5. On surface variant
6. On surface

## States

States are visual representations used to communicate the status of a component or an interactive element. In focused search, individual elements maintain their own interaction states. Learn more about interaction states

### Search bar

Read this image: `docs/md3-components/search/images/state-search-bar.png`

1. Enabled
2. Hovered
3. Focused
4. Pressed (ripple)

### Search Suggestions & Results

Search includes a container for suggestions and results. The container is empty by default. Use the list component to add content.

Read this image: `docs/md3-components/search/images/state-search-suggestions.png`

1. Enabled
2. Hovered
3. Focused
4. Pressed (ripple)

## Measurements

### Search bar

Read Following Images: 

1. Unfocused searchbar with leading and trailing icon measurements `docs/md3-components/search/images/measurements-search-bar.png`
2. Unfocused search bar with avatar measurements `docs/md3-components/search/images/measurements-search-bar-1.png`
3. In M3 Expressive, the search bar expands when focused. The margins change from 24dp to 12dp. `docs/md3-components/search/images/m3-expressive-margin.png`
4. `docs/md3-components/search/images/measurements.png`

### Focused search

Read following images:

1. Full-screen search padding and size measurements for contained style `docs/md3-components/search/images/measurement-contained-style-1.png`
2. Docked search padding and size measurements for contained style `docs/md3-components/search/images/measurement-contained-style-2.png`
3. `docs/md3-components/search/images/measurement-contained-style.png`
4. Full-screen search padding and size measurements for divided style `docs/md3-components/search/images/measurement-divided-style-1.png`
5. Docked search padding and size measurements for divided style ``docs/md3-components/search/images/measurement-divided-style-2.png`

### Important

Read layout and text token details from `docs/md3-components/search/tokens/layout-text.md`

## Accessibility

### Interaction & Style

#### Autosuggest
When search suggestions and results appear, the screen reader must announce the change. This lets people know list items are available for selection.

### Initial Focus

Initial focus lands on the first interactive element. This is often a leading icon button or text field. A leading icon button usually activates search directly or opens a navigation component.

- Initial focus can land on a leading icon
- If there's no leading icon, focus lands on the text field

### Keyboard Navigation

#### Keys: `Tab` or `Shift + Tab`

Action: Navigate between interactive elements

#### Keys: Space or Enter

Action: Activate the search text field for input

#### Keys: Arrows

Action: Navigate between search result items

### Labeling Elements

1. The hinted search text should be used as the accessibilty label describing the search bar.Check the image for better understanding: `docs/md3-components/search/images/labeling-elements-1.png`
2. Leading and trailing icon buttons should be labeled according to their accessibility guidance. Check the image for better understanding: `docs/md3-components/search/images/labeling-elements-2.png`
3. Search suggestions and results use the list component. Screen readers automatically announce the results as a list. For accessibility labels, follow the list accessibility guidelines.

