// Layer 3 — Styled
export { SearchBar } from "./SearchBar";
export { SearchView } from "./SearchView";
export { Search } from "./Search";

// Layer 2 — Headless
export { SearchBarHeadless, SearchViewHeadless } from "./SearchHeadless";

// CVA
export { searchBarVariants, searchViewVariants, searchViewHeaderVariants } from "./Search.variants";

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
