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
  // Orientation classes
  // ---------------------------------------------------------------------------

  describe("Orientation classes", () => {
    test("applies border-t for horizontal orientation", () => {
      render(<Divider />);
      expect(screen.getByRole("separator")).toHaveClass("border-t");
    });

    test("applies border-l for vertical orientation", () => {
      render(<Divider orientation="vertical" />);
      expect(screen.getByRole("separator")).toHaveClass("border-l");
    });
  });

  // ---------------------------------------------------------------------------
  // Inset classes
  // ---------------------------------------------------------------------------

  describe("Inset variants", () => {
    test('applies ml-4 when inset="start"', () => {
      render(<Divider inset="start" />);
      expect(screen.getByRole("separator")).toHaveClass("ml-4");
    });

    test('applies mr-4 when inset="end"', () => {
      render(<Divider inset="end" />);
      expect(screen.getByRole("separator")).toHaveClass("mr-4");
    });

    test('applies both ml-4 and mr-4 when inset="both"', () => {
      render(<Divider inset="both" />);
      const separator = screen.getByRole("separator");
      expect(separator).toHaveClass("ml-4");
      expect(separator).toHaveClass("mr-4");
    });
  });

  // ---------------------------------------------------------------------------
  // Label / subheader variant
  // ---------------------------------------------------------------------------

  describe("Label / subheader variant", () => {
    test("renders label text when label prop is provided", () => {
      render(<Divider label="Section" />);
      expect(screen.getByText("Section")).toBeInTheDocument();
    });

    test("label text element has text-on-surface-variant and text-label-large classes", () => {
      render(<Divider label="Section" />);
      const labelEl = screen.getByText("Section");
      expect(labelEl).toHaveClass("text-on-surface-variant");
      expect(labelEl).toHaveClass("text-label-large");
    });

    test("with label renders two separator elements plus label span", () => {
      render(<Divider label="Section" />);
      const separators = screen.getAllByRole("separator");
      expect(separators).toHaveLength(2);
      expect(screen.getByText("Section").tagName).toBe("SPAN");
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
  });

  // ---------------------------------------------------------------------------
  // Ref forwarding
  // ---------------------------------------------------------------------------

  describe("Ref forwarding", () => {
    test("forwards ref correctly", () => {
      const ref = createRef<HTMLElement>();
      render(<Divider ref={ref} />);
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

    test("axe: no violations for labeled divider", async () => {
      const { container } = render(<Divider label="Section" />);
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
});
