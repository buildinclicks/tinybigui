import { createRef } from "react";
import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Divider } from "./Divider";
import { DividerHeadless } from "./DividerHeadless";

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

describe("Divider", () => {
  describe("Default rendering", () => {
    test('renders horizontal divider with role="separator" by default', () => {
      render(<Divider />);
      expect(screen.getByRole("separator")).toBeInTheDocument();
    });

    test('renders aria-orientation="horizontal" by default', () => {
      render(<Divider />);
      expect(screen.getByRole("separator")).toHaveAttribute("aria-orientation", "horizontal");
    });

    test('renders aria-orientation="vertical" when orientation="vertical"', () => {
      render(<Divider orientation="vertical" />);
      expect(screen.getByRole("separator")).toHaveAttribute("aria-orientation", "vertical");
    });
  });

  // ---------------------------------------------------------------------------
  // Orientation classes (bg-fill approach, CSS-var thickness)
  // ---------------------------------------------------------------------------

  describe("Orientation classes", () => {
    test("applies bg-outline-variant as the fill color", () => {
      render(<Divider />);
      expect(screen.getByRole("separator")).toHaveClass("bg-outline-variant");
    });

    test("applies horizontal size class for horizontal orientation", () => {
      render(<Divider />);
      const el = screen.getByRole("separator");
      expect(el).toHaveClass("w-full");
    });

    test("applies vertical size class for vertical orientation", () => {
      render(<Divider orientation="vertical" />);
      const el = screen.getByRole("separator");
      expect(el).toHaveClass("self-stretch");
    });

    test("does not apply border-t for horizontal orientation", () => {
      render(<Divider />);
      expect(screen.getByRole("separator")).not.toHaveClass("border-t");
    });

    test("does not apply border-l for vertical orientation", () => {
      render(<Divider orientation="vertical" />);
      expect(screen.getByRole("separator")).not.toHaveClass("border-l");
    });
  });

  // ---------------------------------------------------------------------------
  // Inset classes — logical inline properties (RTL-aware)
  // ---------------------------------------------------------------------------

  describe("Inset variants", () => {
    test('applies ms-4 when inset="start"', () => {
      render(<Divider inset="start" />);
      expect(screen.getByRole("separator")).toHaveClass("ms-4");
    });

    test('applies me-4 when inset="end"', () => {
      render(<Divider inset="end" />);
      expect(screen.getByRole("separator")).toHaveClass("me-4");
    });

    test('applies both ms-4 and me-4 when inset="both"', () => {
      render(<Divider inset="both" />);
      const separator = screen.getByRole("separator");
      expect(separator).toHaveClass("ms-4");
      expect(separator).toHaveClass("me-4");
    });

    test('applies no inset classes when inset="none"', () => {
      render(<Divider inset="none" />);
      const separator = screen.getByRole("separator");
      expect(separator).not.toHaveClass("ms-4");
      expect(separator).not.toHaveClass("me-4");
    });
  });

  // ---------------------------------------------------------------------------
  // className passthrough
  // ---------------------------------------------------------------------------

  describe("Custom className", () => {
    test("accepts and applies custom className to horizontal divider", () => {
      render(<Divider className="my-custom-class" />);
      expect(screen.getByRole("separator")).toHaveClass("my-custom-class");
    });

    test("accepts and applies custom className to vertical divider", () => {
      render(<Divider orientation="vertical" className="my-custom-class" />);
      expect(screen.getByRole("separator")).toHaveClass("my-custom-class");
    });
  });

  // ---------------------------------------------------------------------------
  // Ref forwarding
  // ---------------------------------------------------------------------------

  describe("Ref forwarding", () => {
    test("forwards ref correctly for horizontal divider", () => {
      const ref = createRef<HTMLElement>();
      render(<Divider ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLElement);
    });

    test("forwards ref correctly for vertical divider", () => {
      const ref = createRef<HTMLElement>();
      render(<Divider ref={ref} orientation="vertical" />);
      expect(ref.current).toBeInstanceOf(HTMLElement);
    });
  });

  // ---------------------------------------------------------------------------
  // Accessibility (axe)
  // ---------------------------------------------------------------------------

  describe("Accessibility", () => {
    test("axe: no violations for horizontal divider", async () => {
      const { container } = render(<Divider />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("axe: no violations for vertical divider", async () => {
      const { container } = render(
        <div style={{ display: "flex", height: "48px" }}>
          <Divider orientation="vertical" />
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("axe: no violations for inset divider", async () => {
      const { container } = render(<Divider inset="start" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});

// ---------------------------------------------------------------------------
// DividerHeadless — layer 2 primitive tests
// ---------------------------------------------------------------------------

describe("DividerHeadless", () => {
  test("renders an hr element for horizontal orientation", () => {
    render(<DividerHeadless />);
    expect(screen.getByRole("separator").tagName).toBe("HR");
  });

  test("renders a div element for vertical orientation", () => {
    render(<DividerHeadless orientation="vertical" />);
    expect(screen.getByRole("separator").tagName).toBe("DIV");
  });

  test("accepts and applies custom className", () => {
    render(<DividerHeadless className="test-class" />);
    expect(screen.getByRole("separator")).toHaveClass("test-class");
  });
});
