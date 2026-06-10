---
"@tinybigui/react": patch
---

**Snackbar**: MD3 slot-based architecture refactor — visual and motion corrections

**State-layer color fixes (MD3 spec compliance on inverse surface)**

- Action button: replaced shared `Button` (state layer `bg-primary`) with a dedicated `SnackbarActionButton` slot using `bg-inverse-primary` state layer — the MD3-correct color for the inverse-surface container
- Close icon button: replaced shared `IconButton` (state layer `bg-on-surface-variant`) with a dedicated `SnackbarCloseButton` slot using `bg-inverse-on-surface` state layer — the MD3-correct color

**Close button sizing fix**

- Close button was `size="medium"` (56dp), taller than the 48dp snackbar, causing overflow. Now 32dp (`size-8`) — fits within 48dp with 8dp margin on each side.

**Motion migration to spring-standard tokens**

- Enter/exit animation changed from legacy scale/zoom (`ease-emphasized-decelerate` + `duration-medium1`) to position-aware slide + fade using `duration-spring-standard-default-effects` (200ms enter) and `duration-spring-standard-fast-effects` (150ms exit)
- Bottom positions slide up from below; top positions slide down from above
- `prefers-reduced-motion`: translate suppressed — fade-only with no spatial motion

**Other fixes**

- `supportingText`: removed non-spec `opacity-80` reduction; now full `text-inverse-on-surface`
- Two-line density: `min-h-[4.25rem]` (68dp) + `items-start` for two-line; `min-h-12` (48dp) + `items-center` for single-line

**New exports** (action + close slot CVAs): `snackbarActionVariants`, `snackbarActionStateLayerVariants`, `snackbarActionFocusRingVariants`, `snackbarCloseVariants`, `snackbarCloseStateLayerVariants`, `snackbarCloseFocusRingVariants`, `snackbarCloseIconVariants` and their `VariantProps` types.
