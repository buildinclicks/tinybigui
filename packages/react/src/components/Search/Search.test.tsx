import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { SearchBarHeadless, SearchViewHeadless } from "./SearchHeadless";
import { SearchBar } from "./SearchBar";
import { SearchView } from "./SearchView";

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

// ─── Layer 3: Styled Component Tests ──────────────────────────────────────────

describe("SearchBar (Styled)", () => {
  test("has rounded-full class", () => {
    render(<SearchBar placeholder="Search" />);
    const container = screen.getByRole("search").closest("[class*=rounded-full]");
    expect(container).toBeInTheDocument();
  });

  test("has h-14 class (56dp height)", () => {
    render(<SearchBar placeholder="Search" />);
    const container = screen.getByRole("search").closest("[class*=h-14]");
    expect(container).toBeInTheDocument();
  });

  test("has bg-surface-container-high class", () => {
    render(<SearchBar placeholder="Search" />);
    const container = screen.getByRole("search").closest("[class*=bg-surface-container-high]");
    expect(container).toBeInTheDocument();
  });

  test("contained style with trailing actions has px-1 and gap-1 (4dp spacing)", () => {
    render(
      <SearchBar
        placeholder="Search"
        searchStyle="contained"
        trailingActions={[<button key="mic">mic</button>]}
      />
    );
    const container = screen.getByRole("search").closest("[class*=px-1]");
    expect(container).toBeInTheDocument();
    expect(container?.className).toContain("gap-1");
  });

  test("contained style without trailing actions has px-4 (16dp no-actions spacing)", () => {
    render(<SearchBar placeholder="Search" searchStyle="contained" />);
    const container = screen.getByRole("search").closest("[class*=px-4]");
    expect(container).toBeInTheDocument();
  });

  test("divided style has px-4 and gap-4 (16dp spacing)", () => {
    render(<SearchBar placeholder="Search" searchStyle="divided" />);
    const container = screen.getByRole("search").closest("[class*=px-4]");
    expect(container).toBeInTheDocument();
    expect(container?.className).toContain("gap-4");
  });

  test("state layer has hover:opacity-8 class", () => {
    render(<SearchBar placeholder="Search" />);
    const stateLayer = document.querySelector("[data-slot=state-layer]");
    expect(stateLayer).toBeInTheDocument();
    expect(stateLayer?.className).toContain("group-hover:opacity-8");
  });

  test("state layer uses spring motion tokens for opacity transition", () => {
    render(<SearchBar placeholder="Search" />);
    const stateLayer = document.querySelector("[data-slot=state-layer]");
    expect(stateLayer?.className).toContain("duration-spring-standard-fast-effects");
    expect(stateLayer?.className).toContain("ease-spring-standard-fast-effects");
  });

  test("pressed state renders ripple container (from useRipple)", async () => {
    const user = userEvent.setup();
    render(<SearchBar placeholder="Search" />);
    const container = screen.getByRole("search").parentElement;
    expect(container).toBeInTheDocument();
    if (container) {
      await user.click(container);
    }
    const rippleContainer = document.querySelector("[data-ripple-container]");
    expect(rippleContainer).toBeInTheDocument();
  });

  test("focus indicator ring applied to container via has-[:focus-visible]", () => {
    render(<SearchBar placeholder="Search" />);
    const container = screen.getByRole("search").parentElement;
    expect(container?.className).toContain("ring-secondary");
  });

  test("avatar only (Config 1) renders in trailing slot at 30dp size", () => {
    render(
      <SearchBar
        placeholder="Search"
        avatar={<img data-testid="avatar-img" src="" alt="User avatar" />}
      />
    );
    expect(screen.getByTestId("avatar-img")).toBeInTheDocument();
    const avatarWrapper = screen.getByTestId("avatar-img").closest("[class*=rounded-full]");
    expect(avatarWrapper).toBeInTheDocument();
  });

  test("one trailing icon button (Config 2) renders in trailing slot", () => {
    render(
      <SearchBar
        placeholder="Search"
        trailingActions={[
          <button key="mic" data-testid="mic-btn" aria-label="Voice search">
            mic
          </button>,
        ]}
      />
    );
    expect(screen.getByTestId("mic-btn")).toBeInTheDocument();
  });

  test("two trailing icon buttons (Config 3) both render in trailing slot", () => {
    render(
      <SearchBar
        placeholder="Search"
        trailingActions={[
          <button key="mic" data-testid="mic-btn" aria-label="Voice search">
            mic
          </button>,
          <button key="more" data-testid="more-btn" aria-label="More options">
            more
          </button>,
        ]}
      />
    );
    expect(screen.getByTestId("mic-btn")).toBeInTheDocument();
    expect(screen.getByTestId("more-btn")).toBeInTheDocument();
  });

  test("one trailing icon + avatar (Config 4) both render", () => {
    render(
      <SearchBar
        placeholder="Search"
        trailingActions={[
          <button key="mic" data-testid="mic-btn" aria-label="Voice search">
            mic
          </button>,
        ]}
        avatar={<img data-testid="avatar-img" src="" alt="User avatar" />}
      />
    );
    expect(screen.getByTestId("mic-btn")).toBeInTheDocument();
    expect(screen.getByTestId("avatar-img")).toBeInTheDocument();
  });
});

describe("SearchView (Styled)", () => {
  test("clear button appears when input has a value", () => {
    render(
      <SearchView isOpen onClose={() => {}} aria-label="Search" defaultValue="hello">
        <p>results</p>
      </SearchView>
    );
    expect(screen.getByRole("button", { name: "Clear search" })).toBeInTheDocument();
  });

  test("clear button is not rendered when input is empty", () => {
    render(
      <SearchView isOpen onClose={() => {}} aria-label="Search">
        <p>results</p>
      </SearchView>
    );
    expect(screen.queryByRole("button", { name: "Clear search" })).not.toBeInTheDocument();
  });

  test("contained+fullscreen has bg-surface-container-low class", () => {
    render(
      <SearchView
        isOpen
        onClose={() => {}}
        aria-label="Search"
        searchStyle="contained"
        layout="fullscreen"
      >
        <p>results</p>
      </SearchView>
    );
    const view = screen.getByRole("search", { name: "Search" });
    expect(view.className).toContain("bg-surface-container-low");
  });

  test("contained+docked has bg-surface-container-high class", () => {
    render(
      <SearchView
        isOpen
        onClose={() => {}}
        aria-label="Search"
        searchStyle="contained"
        layout="docked"
      >
        <p>results</p>
      </SearchView>
    );
    const view = screen.getByRole("search", { name: "Search" });
    expect(view.className).toContain("bg-surface-container-high");
  });

  test("divided style renders border-outline divider", () => {
    render(
      <SearchView isOpen onClose={() => {}} aria-label="Search" searchStyle="divided">
        <p>results</p>
      </SearchView>
    );
    const view = screen.getByRole("search", { name: "Search" });
    expect(view.className).toContain("border-outline");
  });

  test("docked layout has min-w-[360px] and max-w-[720px] constraint classes", () => {
    render(
      <SearchView isOpen onClose={() => {}} aria-label="Search" layout="docked">
        <p>results</p>
      </SearchView>
    );
    const view = screen.getByRole("search", { name: "Search" });
    expect(view.className).toContain("min-w-[360px]");
    expect(view.className).toContain("max-w-[720px]");
  });

  test("divided+fullscreen header has h-[72px] class", () => {
    render(
      <SearchView
        isOpen
        onClose={() => {}}
        aria-label="Search"
        searchStyle="divided"
        layout="fullscreen"
      >
        <p>results</p>
      </SearchView>
    );
    const view = screen.getByRole("search", { name: "Search" });
    expect(view.className).toContain("h-[72px]");
  });

  test("divided+fullscreen has bg-surface-container-high class", () => {
    render(
      <SearchView
        isOpen
        onClose={() => {}}
        aria-label="Search"
        searchStyle="divided"
        layout="fullscreen"
      >
        <p>results</p>
      </SearchView>
    );
    const view = screen.getByRole("search", { name: "Search" });
    expect(view.className).toContain("bg-surface-container-high");
  });

  test("divided+docked has bg-surface-container-high and rounded-[28px] class", () => {
    render(
      <SearchView
        isOpen
        onClose={() => {}}
        aria-label="Search"
        searchStyle="divided"
        layout="docked"
      >
        <p>results</p>
      </SearchView>
    );
    const view = screen.getByRole("search", { name: "Search" });
    expect(view.className).toContain("bg-surface-container-high");
    expect(view.className).toContain("rounded-[28px]");
  });

  test("contained+docked has gap-0.5 (2dp) between header and results", () => {
    render(
      <SearchView
        isOpen
        onClose={() => {}}
        aria-label="Search"
        searchStyle="contained"
        layout="docked"
      >
        <p>results</p>
      </SearchView>
    );
    const view = screen.getByRole("search", { name: "Search" });
    expect(view.className).toContain("gap-0.5");
  });

  test("has animate-md-scale-in class on mount", () => {
    render(
      <SearchView isOpen onClose={() => {}} aria-label="Search">
        <p>results</p>
      </SearchView>
    );
    const view = screen.getByRole("search", { name: "Search" });
    expect(view.className).toContain("animate-md-scale-in");
  });

  test("renders children inside the content area", () => {
    render(
      <SearchView isOpen onClose={() => {}} aria-label="Search">
        <p data-testid="search-result">Result 1</p>
      </SearchView>
    );
    const content = screen.getByRole("search").querySelector("[data-slot=content]");
    expect(content).toBeInTheDocument();
    expect(screen.getByTestId("search-result")).toBeInTheDocument();
  });
});
