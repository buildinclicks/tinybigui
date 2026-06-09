/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { axe } from "vitest-axe";
import { AppBar } from "./AppBar";
import { AppBarHeadless } from "./AppBarHeadless";
import React from "react";
import { isKeyboardAccessible } from "../../../test/helpers";

// Mock icon components for testing
const IconMenu = (): React.ReactElement => <svg data-testid="icon-menu" aria-hidden="true" />;
const IconSearch = (): React.ReactElement => <svg data-testid="icon-search" aria-hidden="true" />;

const NavIcon = (): React.ReactElement => (
  <button aria-label="Open navigation menu" type="button">
    <IconMenu />
  </button>
);

const ActionIcon = ({ label }: { label: string }): React.ReactElement => (
  <button aria-label={label} type="button">
    <IconSearch />
  </button>
);

describe("AppBar", () => {
  describe("Rendering", () => {
    test("renders with required title prop", () => {
      render(<AppBar title="Page Title" />);
      expect(screen.getByText("Page Title")).toBeInTheDocument();
    });

    test("renders as header element with role=banner", () => {
      render(<AppBar title="Page Title" />);
      expect(screen.getByRole("banner")).toBeInTheDocument();
    });

    test("renders small variant by default", () => {
      render(<AppBar title="Page Title" />);
      const header = screen.getByRole("banner");
      expect(header).toHaveClass("h-appbar-small");
    });

    test("renders with navigationIcon slot", () => {
      render(<AppBar title="Page Title" navigationIcon={<NavIcon />} />);
      expect(screen.getByTestId("icon-menu")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Open navigation menu" })).toBeInTheDocument();
    });

    test("renders without navigationIcon when not provided", () => {
      render(<AppBar title="Page Title" />);
      expect(screen.queryByTestId("icon-menu")).not.toBeInTheDocument();
    });

    test("renders with single action icon", () => {
      render(<AppBar title="Page Title" actions={<ActionIcon label="Search" />} />);
      expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
    });

    test("renders with multiple action icons", () => {
      render(
        <AppBar
          title="Page Title"
          actions={
            <>
              <ActionIcon label="Search" />
              <ActionIcon label="Share" />
              <ActionIcon label="More options" />
            </>
          }
        />
      );
      expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Share" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "More options" })).toBeInTheDocument();
    });

    test("renders without actions when not provided", () => {
      render(<AppBar title="Page Title" />);
      expect(screen.queryAllByRole("button")).toHaveLength(0);
    });

    test("merges custom className", () => {
      render(<AppBar title="Page Title" className="custom-class" />);
      const header = screen.getByRole("banner");
      expect(header).toHaveClass("custom-class");
    });

    test("renders title as ReactNode", () => {
      render(<AppBar title={<span data-testid="custom-title">Custom Title</span>} />);
      expect(screen.getByTestId("custom-title")).toBeInTheDocument();
    });

    test("forwards ref to header element", () => {
      const ref = React.createRef<HTMLElement>();
      render(<AppBar title="Page Title" ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLElement);
      expect(ref.current?.tagName.toLowerCase()).toBe("header");
    });
  });

  describe("Variants", () => {
    test("renders small variant with correct height class", () => {
      render(<AppBar title="Page Title" variant="small" />);
      const header = screen.getByRole("banner");
      expect(header).toHaveClass("h-appbar-small");
    });

    test("renders center-aligned variant with correct height class", () => {
      render(<AppBar title="Page Title" variant="center-aligned" />);
      const header = screen.getByRole("banner");
      expect(header).toHaveClass("h-appbar-small");
    });

    test("renders medium variant with min-height class", () => {
      render(<AppBar title="Page Title" variant="medium" />);
      const header = screen.getByRole("banner");
      expect(header).toHaveClass("min-h-appbar-medium");
    });

    test("renders large variant with min-height class", () => {
      render(<AppBar title="Page Title" variant="large" />);
      const header = screen.getByRole("banner");
      expect(header).toHaveClass("min-h-appbar-large");
    });

    test("renders small variant with surface background", () => {
      render(<AppBar title="Page Title" variant="small" />);
      const header = screen.getByRole("banner");
      expect(header).toHaveClass("bg-surface");
    });

    test("renders center-aligned variant with centered title headline block", () => {
      render(<AppBar title="Page Title" variant="center-aligned" />);
      const header = screen.getByRole("banner");
      const topRow = header.querySelector("[data-slot='top-row']");
      // The headline block inside the top row has text-center for center-aligned
      const headlineBlock = topRow?.querySelector(".text-center");
      expect(headlineBlock).toBeInTheDocument();
    });

    test("renders medium variant with title in bottom area", () => {
      render(<AppBar title="Bottom Title" variant="medium" />);
      expect(screen.getByText("Bottom Title")).toBeInTheDocument();
    });

    test("renders large variant with title in bottom area", () => {
      render(<AppBar title="Large Title" variant="large" />);
      expect(screen.getByText("Large Title")).toBeInTheDocument();
    });

    test("title in small variant has title-large typography class", () => {
      render(<AppBar title="Page Title" variant="small" />);
      const titleEl = screen.getByTestId("appbar-title");
      expect(titleEl).toHaveClass("text-title-large");
    });

    test("title in center-aligned variant has title-large typography class", () => {
      render(<AppBar title="Page Title" variant="center-aligned" />);
      const titleEl = screen.getByTestId("appbar-title");
      expect(titleEl).toHaveClass("text-title-large");
    });

    test("title in medium variant has headline-medium typography class", () => {
      render(<AppBar title="Page Title" variant="medium" />);
      const titleEl = screen.getByTestId("appbar-title");
      expect(titleEl).toHaveClass("text-headline-medium");
    });

    test("title in large variant has display-small typography class", () => {
      render(<AppBar title="Page Title" variant="large" />);
      const titleEl = screen.getByTestId("appbar-title");
      expect(titleEl).toHaveClass("text-display-small");
    });
  });

  describe("Subtitle", () => {
    test("renders subtitle when provided", () => {
      render(<AppBar title="Title" subtitle="Subtitle text" />);
      expect(screen.getByTestId("appbar-subtitle")).toBeInTheDocument();
      expect(screen.getByText("Subtitle text")).toBeInTheDocument();
    });

    test("does not render subtitle element when not provided", () => {
      render(<AppBar title="Title" />);
      expect(screen.queryByTestId("appbar-subtitle")).not.toBeInTheDocument();
    });

    test("does not render subtitle element when null", () => {
      render(<AppBar title="Title" subtitle={null} />);
      expect(screen.queryByTestId("appbar-subtitle")).not.toBeInTheDocument();
    });

    test("sets data-with-subtitle attribute when subtitle is provided", () => {
      render(<AppBar title="Title" subtitle="Sub" />);
      const header = screen.getByRole("banner");
      expect(header).toHaveAttribute("data-with-subtitle", "");
    });

    test("does not set data-with-subtitle attribute when subtitle is absent", () => {
      render(<AppBar title="Title" />);
      const header = screen.getByRole("banner");
      expect(header).not.toHaveAttribute("data-with-subtitle");
    });

    // ── M3 Expressive Flexible subtitle type scales ──

    test("subtitle in small variant has label-medium typography class", () => {
      render(<AppBar title="Title" subtitle="Sub" variant="small" />);
      const subtitleEl = screen.getByTestId("appbar-subtitle");
      expect(subtitleEl).toHaveClass("text-label-medium");
    });

    test("subtitle in small variant has on-surface-variant color class", () => {
      render(<AppBar title="Title" subtitle="Sub" variant="small" />);
      const subtitleEl = screen.getByTestId("appbar-subtitle");
      expect(subtitleEl).toHaveClass("text-on-surface-variant");
    });

    test("subtitle in center-aligned variant has label-medium typography class", () => {
      render(<AppBar title="Title" subtitle="Sub" variant="center-aligned" />);
      const subtitleEl = screen.getByTestId("appbar-subtitle");
      expect(subtitleEl).toHaveClass("text-label-medium");
    });

    test("subtitle in center-aligned variant has on-surface-variant color class", () => {
      render(<AppBar title="Title" subtitle="Sub" variant="center-aligned" />);
      const subtitleEl = screen.getByTestId("appbar-subtitle");
      expect(subtitleEl).toHaveClass("text-on-surface-variant");
    });

    test("subtitle in medium variant has label-large typography class", () => {
      render(<AppBar title="Title" subtitle="Sub" variant="medium" />);
      const subtitleEl = screen.getByTestId("appbar-subtitle");
      expect(subtitleEl).toHaveClass("text-label-large");
    });

    test("subtitle in medium variant has on-surface-variant color class", () => {
      render(<AppBar title="Title" subtitle="Sub" variant="medium" />);
      const subtitleEl = screen.getByTestId("appbar-subtitle");
      expect(subtitleEl).toHaveClass("text-on-surface-variant");
    });

    test("subtitle in large variant has title-medium typography class", () => {
      render(<AppBar title="Title" subtitle="Sub" variant="large" />);
      const subtitleEl = screen.getByTestId("appbar-subtitle");
      expect(subtitleEl).toHaveClass("text-title-medium");
    });

    test("subtitle in large variant has on-surface-variant color class", () => {
      render(<AppBar title="Title" subtitle="Sub" variant="large" />);
      const subtitleEl = screen.getByTestId("appbar-subtitle");
      expect(subtitleEl).toHaveClass("text-on-surface-variant");
    });

    test("renders subtitle as ReactNode", () => {
      render(
        <AppBar title="Title" subtitle={<span data-testid="custom-subtitle">Rich subtitle</span>} />
      );
      expect(screen.getByTestId("custom-subtitle")).toBeInTheDocument();
    });

    test("subtitle appears in expanded area for medium variant", () => {
      render(<AppBar title="Title" subtitle="Sub" variant="medium" />);
      const header = screen.getByRole("banner");
      const expandedRow = header.querySelector("[data-slot='expanded-title']");
      expect(expandedRow).toBeInTheDocument();
      expect(expandedRow).toHaveTextContent("Sub");
    });

    test("subtitle appears in expanded area for large variant", () => {
      render(<AppBar title="Title" subtitle="Sub" variant="large" />);
      const header = screen.getByRole("banner");
      const expandedRow = header.querySelector("[data-slot='expanded-title']");
      expect(expandedRow).toBeInTheDocument();
      expect(expandedRow).toHaveTextContent("Sub");
    });

    test("subtitle appears in top row for small variant", () => {
      render(<AppBar title="Title" subtitle="Sub" variant="small" />);
      const header = screen.getByRole("banner");
      const topRow = header.querySelector("[data-slot='top-row']");
      expect(topRow).toBeInTheDocument();
      expect(topRow).toHaveTextContent("Sub");
    });

    test("subtitle appears in top row for center-aligned variant", () => {
      render(<AppBar title="Title" subtitle="Sub" variant="center-aligned" />);
      const header = screen.getByRole("banner");
      const topRow = header.querySelector("[data-slot='top-row']");
      expect(topRow).toBeInTheDocument();
      expect(topRow).toHaveTextContent("Sub");
    });

    // ── With-subtitle height growth (M3 Expressive flexible) ──

    test("medium variant with subtitle has with-subtitle height group-data class", () => {
      render(<AppBar title="Title" subtitle="Sub" variant="medium" />);
      const header = screen.getByRole("banner");
      // data-with-subtitle drives group-data-[with-subtitle]/appbar:min-h-appbar-medium-subtitle
      expect(header).toHaveAttribute("data-with-subtitle", "");
      expect(header).toHaveClass("min-h-appbar-medium");
    });

    test("large variant with subtitle has with-subtitle height group-data class", () => {
      render(<AppBar title="Title" subtitle="Sub" variant="large" />);
      const header = screen.getByRole("banner");
      expect(header).toHaveAttribute("data-with-subtitle", "");
      expect(header).toHaveClass("min-h-appbar-large");
    });
  });

  describe("Scroll State", () => {
    test("renders without scrolled attribute by default (unscrolled)", () => {
      render(<AppBar title="Page Title" />);
      const header = screen.getByRole("banner");
      expect(header).not.toHaveAttribute("data-scrolled");
    });

    test("renders with data-scrolled attribute when scrolled={true}", () => {
      render(<AppBar title="Page Title" scrolled={true} />);
      const header = screen.getByRole("banner");
      expect(header).toHaveAttribute("data-scrolled", "");
    });

    test("does not have data-scrolled attribute when scrolled={false}", () => {
      render(<AppBar title="Page Title" scrolled={false} />);
      const header = screen.getByRole("banner");
      expect(header).not.toHaveAttribute("data-scrolled");
    });

    test("has shadow-elevation-0 base class at rest", () => {
      render(<AppBar title="Page Title" scrolled={false} />);
      const header = screen.getByRole("banner");
      expect(header).toHaveClass("shadow-elevation-0");
    });

    test("has bg-surface base class at rest", () => {
      render(<AppBar title="Page Title" scrolled={false} />);
      const header = screen.getByRole("banner");
      expect(header).toHaveClass("bg-surface");
    });

    test("has MD3 effects spring transition classes for smooth animation", () => {
      render(<AppBar title="Page Title" />);
      const header = screen.getByRole("banner");
      expect(header).toHaveClass("duration-spring-standard-default-effects");
      expect(header).toHaveClass("ease-spring-standard-default-effects");
    });

    test("calls onScrollStateChange when scroll state changes (uncontrolled)", () => {
      const onScrollStateChange = vi.fn();
      render(<AppBar title="Page Title" onScrollStateChange={onScrollStateChange} />);
      fireEvent.scroll(window, { target: { scrollY: 100 } });
      expect(onScrollStateChange).toHaveBeenCalledWith(true);
    });

    test("does not call onScrollStateChange when controlled", () => {
      const onScrollStateChange = vi.fn();
      render(
        <AppBar title="Page Title" scrolled={false} onScrollStateChange={onScrollStateChange} />
      );
      fireEvent.scroll(window, { target: { scrollY: 100 } });
      const header = screen.getByRole("banner");
      expect(header).not.toHaveAttribute("data-scrolled");
    });

    test("transitions from unscrolled to scrolled state", () => {
      const { rerender } = render(<AppBar title="Page Title" scrolled={false} />);
      let header = screen.getByRole("banner");
      expect(header).not.toHaveAttribute("data-scrolled");

      rerender(<AppBar title="Page Title" scrolled={true} />);
      header = screen.getByRole("banner");
      expect(header).toHaveAttribute("data-scrolled", "");
    });
  });

  describe("Accessibility", () => {
    test("header has role=banner landmark", () => {
      render(<AppBar title="Page Title" />);
      expect(screen.getByRole("banner")).toBeInTheDocument();
    });

    test("has no accessibility violations - small variant", async () => {
      const { container } = render(<AppBar title="Page Title" variant="small" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("has no accessibility violations - center-aligned variant", async () => {
      const { container } = render(<AppBar title="Page Title" variant="center-aligned" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("has no accessibility violations - medium variant", async () => {
      const { container } = render(<AppBar title="Page Title" variant="medium" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("has no accessibility violations - large variant", async () => {
      const { container } = render(<AppBar title="Page Title" variant="large" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("has no accessibility violations with navigation icon and actions", async () => {
      const { container } = render(
        <AppBar
          title="Page Title"
          navigationIcon={<NavIcon />}
          actions={<ActionIcon label="Search" />}
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("has no accessibility violations when scrolled", async () => {
      const { container } = render(<AppBar title="Page Title" scrolled={true} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("has no accessibility violations - small with subtitle", async () => {
      const { container } = render(
        <AppBar title="Page Title" subtitle="Subtitle text" variant="small" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("has no accessibility violations - medium with subtitle", async () => {
      const { container } = render(
        <AppBar title="Page Title" subtitle="Subtitle text" variant="medium" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("has no accessibility violations - large with subtitle", async () => {
      const { container } = render(
        <AppBar title="Page Title" subtitle="Subtitle text" variant="large" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("navigation icon slot is keyboard accessible when it contains a button", () => {
      render(<AppBar title="Page Title" navigationIcon={<NavIcon />} />);
      const navBtn = screen.getByRole("button", { name: "Open navigation menu" });
      expect(isKeyboardAccessible(navBtn)).toBe(true);
    });

    test("action buttons in slot are keyboard accessible", () => {
      render(<AppBar title="Page Title" actions={<ActionIcon label="Search" />} />);
      const actionBtn = screen.getByRole("button", { name: "Search" });
      expect(isKeyboardAccessible(actionBtn)).toBe(true);
    });

    test("navigation icon appears first in DOM for leading focus order", () => {
      render(
        <AppBar
          title="Page Title"
          navigationIcon={<NavIcon />}
          actions={<ActionIcon label="Search" />}
        />
      );
      const buttons = screen.getAllByRole("button");
      expect(buttons[0]).toHaveAccessibleName("Open navigation menu");
      expect(buttons[1]).toHaveAccessibleName("Search");
    });
  });

  describe("Layout Structure", () => {
    test("renders navigation icon in leading position", () => {
      render(
        <AppBar
          title="Page Title"
          navigationIcon={<NavIcon />}
          actions={<ActionIcon label="Search" />}
        />
      );
      const header = screen.getByRole("banner");
      const navContainer = header.querySelector("[data-slot='navigation']");
      expect(navContainer).toBeInTheDocument();
    });

    test("renders actions in trailing position", () => {
      render(<AppBar title="Page Title" actions={<ActionIcon label="Search" />} />);
      const header = screen.getByRole("banner");
      const actionsContainer = header.querySelector("[data-slot='actions']");
      expect(actionsContainer).toBeInTheDocument();
    });

    test("renders title with data-testid for targeting", () => {
      render(<AppBar title="My Title" />);
      expect(screen.getByTestId("appbar-title")).toBeInTheDocument();
    });

    test("small and center-aligned render title in top row", () => {
      render(<AppBar title="Top Title" variant="small" />);
      const header = screen.getByRole("banner");
      const topRow = header.querySelector("[data-slot='top-row']");
      expect(topRow).toBeInTheDocument();
      expect(topRow).toHaveTextContent("Top Title");
    });

    test("medium renders title in expanded bottom area", () => {
      render(<AppBar title="Bottom Title" variant="medium" />);
      const header = screen.getByRole("banner");
      const expandedRow = header.querySelector("[data-slot='expanded-title']");
      expect(expandedRow).toBeInTheDocument();
      expect(expandedRow).toHaveTextContent("Bottom Title");
    });

    test("large renders title in expanded bottom area", () => {
      render(<AppBar title="Bottom Title" variant="large" />);
      const header = screen.getByRole("banner");
      const expandedRow = header.querySelector("[data-slot='expanded-title']");
      expect(expandedRow).toBeInTheDocument();
      expect(expandedRow).toHaveTextContent("Bottom Title");
    });
  });

  describe("Edge Cases", () => {
    test("renders with empty string title", () => {
      render(<AppBar title="" />);
      expect(screen.getByRole("banner")).toBeInTheDocument();
    });

    test("renders all four variants without crashing", () => {
      const variants = ["small", "center-aligned", "medium", "large"] as const;
      variants.forEach((variant) => {
        const { unmount } = render(<AppBar title={`${variant} title`} variant={variant} />);
        expect(screen.getByRole("banner")).toBeInTheDocument();
        unmount();
      });
    });

    test("renders all slots populated simultaneously", () => {
      render(
        <AppBar
          title="Full AppBar"
          variant="small"
          navigationIcon={<NavIcon />}
          actions={
            <>
              <ActionIcon label="Search" />
              <ActionIcon label="Share" />
            </>
          }
        />
      );
      expect(screen.getByRole("banner")).toBeInTheDocument();
      expect(screen.getByText("Full AppBar")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Open navigation menu" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Share" })).toBeInTheDocument();
    });

    test("handles null navigationIcon gracefully", () => {
      render(<AppBar title="Page Title" navigationIcon={null} />);
      expect(screen.getByRole("banner")).toBeInTheDocument();
    });

    test("handles null actions gracefully", () => {
      render(<AppBar title="Page Title" actions={null} />);
      expect(screen.getByRole("banner")).toBeInTheDocument();
    });

    test("renders with subtitle and all slots", () => {
      render(
        <AppBar
          title="Full AppBar"
          subtitle="Subtitle"
          variant="medium"
          navigationIcon={<NavIcon />}
          actions={<ActionIcon label="Search" />}
        />
      );
      expect(screen.getByTestId("appbar-title")).toBeInTheDocument();
      expect(screen.getByTestId("appbar-subtitle")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Open navigation menu" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
    });
  });
});

describe("AppBarHeadless", () => {
  test("renders as header element", () => {
    render(<AppBarHeadless>Content</AppBarHeadless>);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  test("renders children", () => {
    render(<AppBarHeadless>Headless Content</AppBarHeadless>);
    expect(screen.getByText("Headless Content")).toBeInTheDocument();
  });

  test("applies className", () => {
    render(<AppBarHeadless className="custom-class">Content</AppBarHeadless>);
    expect(screen.getByRole("banner")).toHaveClass("custom-class");
  });

  test("forwards ref to header element", () => {
    const ref = React.createRef<HTMLElement>();
    render(<AppBarHeadless ref={ref}>Content</AppBarHeadless>);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  test("forwards additional HTML attributes to the header element", () => {
    render(
      <AppBarHeadless data-with-subtitle="" data-testid="headless-header">
        Content
      </AppBarHeadless>
    );
    const header = screen.getByTestId("headless-header");
    expect(header).toHaveAttribute("data-with-subtitle", "");
  });

  test("presence-based data-scrolled: absent when not scrolled", () => {
    render(<AppBarHeadless scrolled={false}>Content</AppBarHeadless>);
    expect(screen.getByRole("banner")).not.toHaveAttribute("data-scrolled");
  });

  test("presence-based data-scrolled: present when scrolled", () => {
    render(<AppBarHeadless scrolled={true}>Content</AppBarHeadless>);
    expect(screen.getByRole("banner")).toHaveAttribute("data-scrolled", "");
  });

  test("manages uncontrolled scroll state internally", () => {
    render(<AppBarHeadless>Content</AppBarHeadless>);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  test("uses controlled scrolled prop when provided", () => {
    const { rerender } = render(<AppBarHeadless scrolled={false}>Content</AppBarHeadless>);
    expect(screen.getByRole("banner")).not.toHaveAttribute("data-scrolled");

    rerender(<AppBarHeadless scrolled={true}>Content</AppBarHeadless>);
    expect(screen.getByRole("banner")).toHaveAttribute("data-scrolled", "");
  });

  test("calls onScrollStateChange when scroll occurs (uncontrolled)", () => {
    const onScrollStateChange = vi.fn();
    render(<AppBarHeadless onScrollStateChange={onScrollStateChange}>Content</AppBarHeadless>);
    fireEvent.scroll(window, { target: { scrollY: 50 } });
    expect(onScrollStateChange).toHaveBeenCalled();
  });

  test("has no accessibility violations", async () => {
    const { container } = render(<AppBarHeadless>Headless</AppBarHeadless>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
