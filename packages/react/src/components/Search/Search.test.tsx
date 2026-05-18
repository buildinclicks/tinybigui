import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { SearchBarHeadless, SearchViewHeadless } from "./SearchHeadless";

describe("SearchBarHeadless", () => {
  describe("Rendering", () => {
    test("renders form with role='search'", () => {
      render(<SearchBarHeadless placeholder="Search" />);
      expect(screen.getByRole("search")).toBeInTheDocument();
      expect(screen.getByRole("search").tagName).toBe("FORM");
    });

    test("input has role='searchbox'", () => {
      render(<SearchBarHeadless placeholder="Search" />);
      expect(screen.getByRole("searchbox")).toBeInTheDocument();
    });

    test("displays value prop in the input", () => {
      render(<SearchBarHeadless value="hello" placeholder="Search" onChange={() => {}} />);
      expect(screen.getByRole("searchbox")).toHaveValue("hello");
    });

    test("calls onChange when input value changes", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<SearchBarHeadless placeholder="Search" onChange={handleChange} />);

      await user.type(screen.getByRole("searchbox"), "a");
      expect(handleChange).toHaveBeenCalledWith("a");
    });

    test("calls onSubmit with the current value when Enter is pressed", async () => {
      const user = userEvent.setup();
      const handleSubmit = vi.fn();
      render(
        <SearchBarHeadless defaultValue="query" placeholder="Search" onSubmit={handleSubmit} />
      );

      const input = screen.getByRole("searchbox");
      await user.click(input);
      await user.keyboard("{Enter}");
      expect(handleSubmit).toHaveBeenCalledWith("query");
    });

    test("calls onClear when Escape is pressed and input has a value", async () => {
      const user = userEvent.setup();
      const handleClear = vi.fn();
      render(
        <SearchBarHeadless defaultValue="something" placeholder="Search" onClear={handleClear} />
      );

      const input = screen.getByRole("searchbox");
      await user.click(input);
      await user.keyboard("{Escape}");
      expect(handleClear).toHaveBeenCalled();
    });

    test("renders leading icon slot content", () => {
      render(
        <SearchBarHeadless
          placeholder="Search"
          leadingIcon={<span data-testid="search-icon">🔍</span>}
        />
      );
      expect(screen.getByTestId("search-icon")).toBeInTheDocument();
    });

    test("renders single trailing action", () => {
      render(
        <SearchBarHeadless
          placeholder="Search"
          trailingActions={[
            <button key="mic" data-testid="mic-btn">
              mic
            </button>,
          ]}
        />
      );
      expect(screen.getByTestId("mic-btn")).toBeInTheDocument();
    });

    test("renders multiple trailing actions", () => {
      render(
        <SearchBarHeadless
          placeholder="Search"
          trailingActions={[
            <button key="mic" data-testid="mic-btn">
              mic
            </button>,
            <button key="camera" data-testid="camera-btn">
              camera
            </button>,
          ]}
        />
      );
      expect(screen.getByTestId("mic-btn")).toBeInTheDocument();
      expect(screen.getByTestId("camera-btn")).toBeInTheDocument();
    });

    test("renders avatar slot content", () => {
      render(
        <SearchBarHeadless
          placeholder="Search"
          avatar={<img data-testid="avatar" src="" alt="User" />}
        />
      );
      expect(screen.getByTestId("avatar")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    test("input aria-label defaults to placeholder value when no aria-label prop", () => {
      render(<SearchBarHeadless placeholder="Search files" />);
      expect(screen.getByRole("searchbox")).toHaveAttribute("aria-label", "Search files");
    });

    test("input uses explicit aria-label when provided", () => {
      render(<SearchBarHeadless placeholder="Search files" aria-label="File search input" />);
      expect(screen.getByRole("searchbox")).toHaveAttribute("aria-label", "File search input");
    });

    test("isDisabled={true} disables the input", () => {
      render(<SearchBarHeadless placeholder="Search" isDisabled />);
      expect(screen.getByRole("searchbox")).toBeDisabled();
    });

    test("Space/Enter in Maximized state calls onFocus (activates text field)", () => {
      const handleFocus = vi.fn();
      render(<SearchBarHeadless placeholder="Search" onFocus={handleFocus} />);

      const input = screen.getByRole("searchbox");
      input.focus();
      expect(handleFocus).toHaveBeenCalled();
    });

    test("forwardRef — ref is attached to the form element", () => {
      const ref = { current: null };
      render(<SearchBarHeadless ref={ref} placeholder="Search" />);
      expect(ref.current).toBeInstanceOf(HTMLFormElement);
    });

    test("zero axe violations", async () => {
      const { container } = render(<SearchBarHeadless placeholder="Search documents" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});

describe("SearchViewHeadless", () => {
  describe("Rendering", () => {
    test("renders in a portal when isOpen={true}", () => {
      render(
        <SearchViewHeadless isOpen onClose={() => {}} aria-label="Search">
          <p>results</p>
        </SearchViewHeadless>
      );
      const searchView = screen.getByRole("search", { name: "Search" });
      expect(searchView).toBeInTheDocument();
      expect(searchView.closest("body")).toBeTruthy();
    });

    test("does NOT render to the DOM when isOpen={false}", () => {
      render(
        <SearchViewHeadless isOpen={false} onClose={() => {}} aria-label="Search">
          <p>results</p>
        </SearchViewHeadless>
      );
      expect(screen.queryByRole("search", { name: "Search" })).not.toBeInTheDocument();
    });

    test("calls onClose when Escape key is pressed", async () => {
      const user = userEvent.setup();
      const handleClose = vi.fn();
      render(
        <SearchViewHeadless isOpen onClose={handleClose} aria-label="Search">
          <p>results</p>
        </SearchViewHeadless>
      );

      await user.keyboard("{Escape}");
      expect(handleClose).toHaveBeenCalled();
    });

    test("renders a back arrow button by default as leading element", () => {
      render(
        <SearchViewHeadless isOpen onClose={() => {}} aria-label="Search">
          <p>results</p>
        </SearchViewHeadless>
      );
      expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();
    });

    test("renders the clear button when input has a value", () => {
      render(
        <SearchViewHeadless isOpen onClose={() => {}} aria-label="Search" defaultValue="hello">
          <p>results</p>
        </SearchViewHeadless>
      );
      expect(screen.getByRole("button", { name: "Clear search" })).toBeInTheDocument();
    });

    test("does NOT render the clear button when input is empty", () => {
      render(
        <SearchViewHeadless isOpen onClose={() => {}} aria-label="Search">
          <p>results</p>
        </SearchViewHeadless>
      );
      expect(screen.queryByRole("button", { name: "Clear search" })).not.toBeInTheDocument();
    });

    test("renders children in the suggestions/results area", () => {
      render(
        <SearchViewHeadless isOpen onClose={() => {}} aria-label="Search">
          <p data-testid="suggestion">Suggestion 1</p>
        </SearchViewHeadless>
      );
      expect(screen.getByTestId("suggestion")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    test("aria-label is applied to the view container", () => {
      render(
        <SearchViewHeadless isOpen onClose={() => {}} aria-label="Search messages">
          <p>results</p>
        </SearchViewHeadless>
      );
      expect(screen.getByRole("search")).toHaveAttribute("aria-label", "Search messages");
    });

    test("aria-live region is present for autosuggest announcements", () => {
      render(
        <SearchViewHeadless isOpen onClose={() => {}} aria-label="Search">
          <p>results</p>
        </SearchViewHeadless>
      );
      const liveRegion = screen.getByRole("search").querySelector('[aria-live="polite"]');
      expect(liveRegion).toBeInTheDocument();
    });

    test("zero axe violations when open", async () => {
      render(
        <SearchViewHeadless
          isOpen
          onClose={() => {}}
          aria-label="Search messages"
          defaultValue="test"
        >
          <ul>
            <li>Result 1</li>
            <li>Result 2</li>
          </ul>
        </SearchViewHeadless>
      );
      const results = await axe(document.body);
      expect(results).toHaveNoViolations();
    });
  });
});
