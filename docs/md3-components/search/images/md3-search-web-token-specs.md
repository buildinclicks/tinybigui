# Material Design 3 Search: Web Token Specification Matrix

Source component: **Material Design 3 Search**  
Scope: **Search Bar** and **Search View**  
Target platform: **Web only**  
Purpose: Token/spec reference for a React Material Design 3 component library

---

## 1. Scope

This document defines the token specification matrix for Material Design 3 Search on the **Web platform only**.

It covers:

- **Search Bar**: the collapsed or unfocused search entry component.
- **Search View**: the expanded or focused search experience.
- **Theme contexts**: Light and Dark.
- **Contrast contexts**: Default, Medium contrast, and High contrast.
- **Motion contexts**: Standard and Expressive.

It intentionally excludes:

- Android-specific implementation notes.
- iOS-specific implementation notes.
- Jetpack Compose-specific implementation notes.
- CSS examples.
- Component implementation examples.

---

## 2. Context dimensions

For Web, the meaningful context dimensions are:

| Dimension | Values |
|---|---|
| Platform | Web |
| Theme | Light, Dark |
| Contrast | Default, Medium contrast, High contrast |
| Motion scheme | Standard, Expressive |

Total Web contexts:

| Calculation | Total |
|---|---:|
| 1 platform × 2 themes × 3 contrast levels × 2 motion schemes | 12 contexts |

---

## 3. Important resolution rule

The **component token names and component specs stay the same** across all 12 Web contexts.

What changes by context is the **resolved value** of the semantic system token.

Example:

| Component token | Semantic system token | What changes by context? |
|---|---|---|
| Search Bar container color | SurfaceContainerHigh | The final resolved color changes between light, dark, default contrast, medium contrast, and high contrast. |
| Search View header input text color | OnSurface | The final resolved color changes between light, dark, default contrast, medium contrast, and high contrast. |
| Search Bar container height | 56px | Does not change by theme, contrast, or motion scheme. |
| Search View fullscreen header height | 72px | Does not change by theme, contrast, or motion scheme. |

Motion scheme affects **transition behavior**, not the static color, shape, size, or typography token table.

---

## 4. Search Bar: Web token specification

Search Bar represents the collapsed/unfocused search affordance.

| Token group | Component token | Web spec value | Token category | Context behavior |
|---|---|---:|---|---|
| Avatar | Avatar shape | CornerFull | Shape | Static across all Web contexts |
| Avatar | Avatar size | 30px | Size | Static across all Web contexts |
| Container | Container color | SurfaceContainerHigh | Color | Resolves by theme + contrast |
| Container | Container elevation | Level3 | Elevation | Static token; visual rendering may depend on elevation system |
| Container | Container height | 56px | Size | Static across all Web contexts |
| Container | Container shape | CornerFull | Shape | Static across all Web contexts |
| Focus | Focus indicator color | Secondary | Color | Resolves by theme + contrast |
| Input | Input text color | OnSurface | Color | Resolves by theme + contrast |
| Input | Input text font | BodyLarge | Typography | Static typography role |
| Leading icon | Leading icon color | OnSurface | Color | Resolves by theme + contrast |
| Supporting text | Supporting text color | OnSurfaceVariant | Color | Resolves by theme + contrast |
| Supporting text | Supporting text font | BodyLarge | Typography | Static typography role |
| Supporting text state | Hover supporting text color | OnSurfaceVariant | Color | Resolves by theme + contrast |
| Supporting text state | Pressed supporting text color | OnSurfaceVariant | Color | Resolves by theme + contrast |
| Trailing icon | Trailing icon color | OnSurfaceVariant | Color | Resolves by theme + contrast |

---

## 5. Search View: Web token specification

Search View represents the expanded/focused search experience.

| Token group | Component token | Web spec value | Token category | Context behavior |
|---|---|---:|---|---|
| Container | Container color | SurfaceContainerHigh | Color | Resolves by theme + contrast |
| Container | Container elevation | Level3 | Elevation | Static token; visual rendering may depend on elevation system |
| Divider | Divider color | Outline | Color | Resolves by theme + contrast |
| Docked container | Docked container shape | CornerExtraLarge | Shape | Static across all Web contexts |
| Docked header | Docked header container height | 56px | Size | Static across all Web contexts |
| Fullscreen container | Fullscreen container shape | CornerNone | Shape | Static across all Web contexts |
| Fullscreen header | Fullscreen header container height | 72px | Size | Static across all Web contexts |
| Header input | Header input text color | OnSurface | Color | Resolves by theme + contrast |
| Header input | Header input text font | BodyLarge | Typography | Static typography role |
| Header leading icon | Header leading icon color | OnSurface | Color | Resolves by theme + contrast |
| Header supporting text | Header supporting text color | OnSurfaceVariant | Color | Resolves by theme + contrast |
| Header supporting text | Header supporting text font | BodyLarge | Typography | Static typography role |
| Header trailing icon | Header trailing icon color | OnSurfaceVariant | Color | Resolves by theme + contrast |

---

## 6. Web context matrix

Each context below uses the Search Bar token specification from section 4 and the Search View token specification from section 5.

### 6.1 Light theme contexts

| Context ID | Platform | Theme | Contrast | Motion scheme | Search Bar spec | Search View spec |
|---:|---|---|---|---|---|---|
| W-01 | Web | Light | Default | Standard | Section 4 | Section 5 |
| W-02 | Web | Light | Medium contrast | Standard | Section 4 | Section 5 |
| W-03 | Web | Light | High contrast | Standard | Section 4 | Section 5 |
| W-04 | Web | Light | Default | Expressive | Section 4 | Section 5 |
| W-05 | Web | Light | Medium contrast | Expressive | Section 4 | Section 5 |
| W-06 | Web | Light | High contrast | Expressive | Section 4 | Section 5 |

### 6.2 Dark theme contexts

| Context ID | Platform | Theme | Contrast | Motion scheme | Search Bar spec | Search View spec |
|---:|---|---|---|---|---|---|
| W-07 | Web | Dark | Default | Standard | Section 4 | Section 5 |
| W-08 | Web | Dark | Medium contrast | Standard | Section 4 | Section 5 |
| W-09 | Web | Dark | High contrast | Standard | Section 4 | Section 5 |
| W-10 | Web | Dark | Default | Expressive | Section 4 | Section 5 |
| W-11 | Web | Dark | Medium contrast | Expressive | Section 4 | Section 5 |
| W-12 | Web | Dark | High contrast | Expressive | Section 4 | Section 5 |

---

## 7. Context behavior details

### 7.1 Theme behavior

| Theme | Expected behavior |
|---|---|
| Light | Resolve color roles using the light Material 3 color scheme. |
| Dark | Resolve color roles using the dark Material 3 color scheme. |

### 7.2 Contrast behavior

| Contrast | Expected behavior |
|---|---|
| Default | Use the default Material 3 generated color scheme. |
| Medium contrast | Use the medium contrast Material 3 generated color scheme. |
| High contrast | Use the high contrast Material 3 generated color scheme. |

### 7.3 Motion scheme behavior

| Motion scheme | Static token effect | Expected behavior |
|---|---|---|
| Standard | No change to Search Bar or Search View static tokens | Use standard MD3 motion behavior for search activation, expansion, collapse, focus movement, and content appearance. |
| Expressive | No change to Search Bar or Search View static tokens | Use expressive MD3 motion behavior for search activation, expansion, collapse, focus movement, and content appearance. |

---

## 8. Context-specific token resolution

The following table shows which tokens are context-sensitive and which remain static.

| Component | Token | Static or context-sensitive? | Depends on theme? | Depends on contrast? | Depends on motion scheme? |
|---|---|---|---|---|---|
| Search Bar | Avatar shape | Static | No | No | No |
| Search Bar | Avatar size | Static | No | No | No |
| Search Bar | Container color | Context-sensitive | Yes | Yes | No |
| Search Bar | Container elevation | Static | No | No | No |
| Search Bar | Container height | Static | No | No | No |
| Search Bar | Container shape | Static | No | No | No |
| Search Bar | Focus indicator color | Context-sensitive | Yes | Yes | No |
| Search Bar | Input text color | Context-sensitive | Yes | Yes | No |
| Search Bar | Input text font | Static | No | No | No |
| Search Bar | Leading icon color | Context-sensitive | Yes | Yes | No |
| Search Bar | Supporting text color | Context-sensitive | Yes | Yes | No |
| Search Bar | Supporting text font | Static | No | No | No |
| Search Bar | Hover supporting text color | Context-sensitive | Yes | Yes | No |
| Search Bar | Pressed supporting text color | Context-sensitive | Yes | Yes | No |
| Search Bar | Trailing icon color | Context-sensitive | Yes | Yes | No |
| Search View | Container color | Context-sensitive | Yes | Yes | No |
| Search View | Container elevation | Static | No | No | No |
| Search View | Divider color | Context-sensitive | Yes | Yes | No |
| Search View | Docked container shape | Static | No | No | No |
| Search View | Docked header container height | Static | No | No | No |
| Search View | Fullscreen container shape | Static | No | No | No |
| Search View | Fullscreen header container height | Static | No | No | No |
| Search View | Header input text color | Context-sensitive | Yes | Yes | No |
| Search View | Header input text font | Static | No | No | No |
| Search View | Header leading icon color | Context-sensitive | Yes | Yes | No |
| Search View | Header supporting text color | Context-sensitive | Yes | Yes | No |
| Search View | Header supporting text font | Static | No | No | No |
| Search View | Header trailing icon color | Context-sensitive | Yes | Yes | No |

---

## 9. Complete context profiles

### W-01: Web / Light / Default contrast / Standard motion

| Component | Token specification |
|---|---|
| Search Bar | Use Search Bar Web token specification from section 4. Resolve color roles using Light + Default contrast scheme. |
| Search View | Use Search View Web token specification from section 5. Resolve color roles using Light + Default contrast scheme. |
| Motion | Use Standard motion behavior. |

### W-02: Web / Light / Medium contrast / Standard motion

| Component | Token specification |
|---|---|
| Search Bar | Use Search Bar Web token specification from section 4. Resolve color roles using Light + Medium contrast scheme. |
| Search View | Use Search View Web token specification from section 5. Resolve color roles using Light + Medium contrast scheme. |
| Motion | Use Standard motion behavior. |

### W-03: Web / Light / High contrast / Standard motion

| Component | Token specification |
|---|---|
| Search Bar | Use Search Bar Web token specification from section 4. Resolve color roles using Light + High contrast scheme. |
| Search View | Use Search View Web token specification from section 5. Resolve color roles using Light + High contrast scheme. |
| Motion | Use Standard motion behavior. |

### W-04: Web / Light / Default contrast / Expressive motion

| Component | Token specification |
|---|---|
| Search Bar | Use Search Bar Web token specification from section 4. Resolve color roles using Light + Default contrast scheme. |
| Search View | Use Search View Web token specification from section 5. Resolve color roles using Light + Default contrast scheme. |
| Motion | Use Expressive motion behavior. |

### W-05: Web / Light / Medium contrast / Expressive motion

| Component | Token specification |
|---|---|
| Search Bar | Use Search Bar Web token specification from section 4. Resolve color roles using Light + Medium contrast scheme. |
| Search View | Use Search View Web token specification from section 5. Resolve color roles using Light + Medium contrast scheme. |
| Motion | Use Expressive motion behavior. |

### W-06: Web / Light / High contrast / Expressive motion

| Component | Token specification |
|---|---|
| Search Bar | Use Search Bar Web token specification from section 4. Resolve color roles using Light + High contrast scheme. |
| Search View | Use Search View Web token specification from section 5. Resolve color roles using Light + High contrast scheme. |
| Motion | Use Expressive motion behavior. |

### W-07: Web / Dark / Default contrast / Standard motion

| Component | Token specification |
|---|---|
| Search Bar | Use Search Bar Web token specification from section 4. Resolve color roles using Dark + Default contrast scheme. |
| Search View | Use Search View Web token specification from section 5. Resolve color roles using Dark + Default contrast scheme. |
| Motion | Use Standard motion behavior. |

### W-08: Web / Dark / Medium contrast / Standard motion

| Component | Token specification |
|---|---|
| Search Bar | Use Search Bar Web token specification from section 4. Resolve color roles using Dark + Medium contrast scheme. |
| Search View | Use Search View Web token specification from section 5. Resolve color roles using Dark + Medium contrast scheme. |
| Motion | Use Standard motion behavior. |

### W-09: Web / Dark / High contrast / Standard motion

| Component | Token specification |
|---|---|
| Search Bar | Use Search Bar Web token specification from section 4. Resolve color roles using Dark + High contrast scheme. |
| Search View | Use Search View Web token specification from section 5. Resolve color roles using Dark + High contrast scheme. |
| Motion | Use Standard motion behavior. |

### W-10: Web / Dark / Default contrast / Expressive motion

| Component | Token specification |
|---|---|
| Search Bar | Use Search Bar Web token specification from section 4. Resolve color roles using Dark + Default contrast scheme. |
| Search View | Use Search View Web token specification from section 5. Resolve color roles using Dark + Default contrast scheme. |
| Motion | Use Expressive motion behavior. |

### W-11: Web / Dark / Medium contrast / Expressive motion

| Component | Token specification |
|---|---|
| Search Bar | Use Search Bar Web token specification from section 4. Resolve color roles using Dark + Medium contrast scheme. |
| Search View | Use Search View Web token specification from section 5. Resolve color roles using Dark + Medium contrast scheme. |
| Motion | Use Expressive motion behavior. |

### W-12: Web / Dark / High contrast / Expressive motion

| Component | Token specification |
|---|---|
| Search Bar | Use Search Bar Web token specification from section 4. Resolve color roles using Dark + High contrast scheme. |
| Search View | Use Search View Web token specification from section 5. Resolve color roles using Dark + High contrast scheme. |
| Motion | Use Expressive motion behavior. |

---

## 10. React library implementation contract

For a React Material Design 3 Web library, the clean implementation contract should be:

| Layer | Responsibility |
|---|---|
| Component token layer | Defines Search Bar and Search View tokens. |
| System token layer | Defines semantic roles such as SurfaceContainerHigh, OnSurface, OnSurfaceVariant, Outline, Secondary, BodyLarge, CornerFull, and Level3. |
| Theme layer | Resolves semantic roles for Light/Dark and Default/Medium/High contrast. |
| Motion layer | Applies Standard or Expressive motion behavior without changing static token values. |

---

## 11. Notes

1. Web is the only platform covered in this refined specification.
2. Search Bar and Search View use different token sets.
3. Theme and contrast affect resolved semantic color values.
4. Motion scheme does not change static token values.
5. Size tokens are expressed as pixel-equivalent Web values.
6. Concrete hex colors are not listed because they depend on the generated Material 3 color scheme.
7. This file is intended as a clean design-system specification, not an implementation guide.

---

## 12. References

- Material Design 3 Search specs: https://m3.material.io/components/search/specs
- AndroidX Material 3 SearchBarTokens source: https://raw.githubusercontent.com/androidx/androidx/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/SearchBarTokens.kt
- AndroidX Material 3 SearchViewTokens source: https://raw.githubusercontent.com/androidx/androidx/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/SearchViewTokens.kt
- Material Web theming documentation: https://github.com/material-components/material-web/blob/main/docs/theming/README.md
