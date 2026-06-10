// Layer 3 — Styled
export { SearchBar } from "./SearchBar";
export { SearchView } from "./SearchView";
export { Search } from "./Search";

// Layer 2 — Headless
export { SearchBarHeadless, SearchViewHeadless } from "./SearchHeadless";

// CVA — bar slots
export {
  searchBarRootVariants,
  searchBarStateLayerVariants,
  searchBarFocusRingVariants,
  searchBarLeadingIconVariants,
  searchBarTrailingActionVariants,
  searchBarAvatarVariants,
  searchBarInputVariants,
} from "./Search.variants";

// CVA — view slots
export {
  searchViewVariants,
  searchViewHeaderVariants,
  searchViewBackButtonVariants,
  searchViewClearButtonVariants,
  searchViewTrailingActionVariants,
  searchViewInputVariants,
  searchViewDividerVariants,
  searchViewContentVariants,
} from "./Search.variants";

// Types
export type {
  SearchStyle,
  SearchLayout,
  SearchBarProps,
  SearchViewProps,
  SearchProps,
  SearchBarHeadlessProps,
  SearchViewHeadlessProps,
} from "./Search.types";
