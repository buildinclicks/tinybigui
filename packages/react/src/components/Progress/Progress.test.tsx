import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Progress } from "./Progress";
import { ProgressHeadless } from "./ProgressHeadless";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const linearDeterminate = (props = {}) =>
  render(<Progress type="linear" value={50} label="Loading" {...props} />);

const linearIndeterminate = (props = {}) =>
  render(<Progress type="linear" indeterminate aria-label="Loading content" {...props} />);

const circularDeterminate = (props = {}) =>
  render(<Progress type="circular" value={75} label="Uploading" {...props} />);

const circularIndeterminate = (props = {}) =>
  render(<Progress type="circular" indeterminate aria-label="Loading" {...props} />);

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

describe("Progress", () => {
  describe("Rendering", () => {
    test("renders linear determinate progress bar", () => {
      linearDeterminate();
      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    test("renders linear indeterminate progress bar", () => {
      linearIndeterminate();
      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    test("renders circular determinate progress bar", () => {
      circularDeterminate();
      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    test("renders circular indeterminate progress bar", () => {
      circularIndeterminate();
      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    test("defaults to linear type when type is omitted", () => {
      render(<Progress value={50} aria-label="Loading" />);
      const bar = screen.getByRole("progressbar");
      expect(bar).toBeInTheDocument();
    });

    test("applies custom className to container", () => {
      render(<Progress type="linear" value={50} aria-label="Loading" className="custom-class" />);
      const bar = screen.getByRole("progressbar");
      expect(bar).toHaveClass("custom-class");
    });

    test("renders SVG for circular variant", () => {
      const { container } = circularDeterminate();
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    test("does not render SVG for linear variant", () => {
      const { container } = linearDeterminate();
      expect(container.querySelector("svg")).not.toBeInTheDocument();
    });

    test("forwards ref to container element", () => {
      const ref = { current: null };
      render(<Progress type="linear" value={50} aria-label="Loading" ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLElement);
    });
  });

  // ---------------------------------------------------------------------------
  // ARIA Attributes
  // ---------------------------------------------------------------------------

  describe("ARIA Attributes", () => {
    test("has role=progressbar", () => {
      linearDeterminate();
      expect(screen.getByRole("progressbar")).toHaveAttribute("role", "progressbar");
    });

    test("sets aria-valuenow for determinate linear", () => {
      render(<Progress type="linear" value={60} aria-label="Loading" />);
      expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "60");
    });

    test("sets aria-valuenow for determinate circular", () => {
      render(<Progress type="circular" value={75} aria-label="Uploading" />);
      expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "75");
    });

    test("sets aria-valuemin to 0 by default", () => {
      linearDeterminate();
      expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuemin", "0");
    });

    test("sets aria-valuemax to 100 by default", () => {
      linearDeterminate();
      expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuemax", "100");
    });

    test("does not set aria-valuenow for indeterminate linear", () => {
      linearIndeterminate();
      expect(screen.getByRole("progressbar")).not.toHaveAttribute("aria-valuenow");
    });

    test("does not set aria-valuenow for indeterminate circular", () => {
      circularIndeterminate();
      expect(screen.getByRole("progressbar")).not.toHaveAttribute("aria-valuenow");
    });

    test("sets custom minValue via aria-valuemin", () => {
      render(
        <Progress type="linear" minValue={10} maxValue={200} value={100} aria-label="Progress" />
      );
      expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuemin", "10");
    });

    test("sets custom maxValue via aria-valuemax", () => {
      render(
        <Progress type="linear" minValue={0} maxValue={200} value={100} aria-label="Progress" />
      );
      expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuemax", "200");
    });

    test("sets aria-labelledby when label prop is provided", () => {
      linearDeterminate();
      const bar = screen.getByRole("progressbar");
      expect(bar).toHaveAttribute("aria-labelledby");
    });

    test("sets aria-label when aria-label prop is passed", () => {
      render(<Progress type="linear" indeterminate aria-label="Loading files" />);
      expect(screen.getByRole("progressbar")).toHaveAttribute("aria-label", "Loading files");
    });
  });

  // ---------------------------------------------------------------------------
  // Label
  // ---------------------------------------------------------------------------

  describe("Label", () => {
    test("renders visible label text when label prop is provided", () => {
      render(<Progress type="linear" value={50} label="Uploading files" />);
      expect(screen.getByText("Uploading files")).toBeInTheDocument();
    });

    test("does not render label element when omitted", () => {
      render(<Progress type="linear" value={50} aria-label="Loading" />);
      expect(screen.queryByText("Loading")).not.toBeInTheDocument();
    });

    test("label is linked to progressbar via aria-labelledby", () => {
      render(<Progress type="linear" value={50} label="File upload" />);
      const bar = screen.getByRole("progressbar");
      const labelId = bar.getAttribute("aria-labelledby");
      expect(labelId).toBeTruthy();
      const labelEl = document.getElementById(labelId!);
      expect(labelEl).toBeInTheDocument();
      expect(labelEl?.textContent).toBe("File upload");
    });
  });

  // ---------------------------------------------------------------------------
  // Value & Percentage
  // ---------------------------------------------------------------------------

  describe("Value", () => {
    test("calculates 50% for value=50 on default range", () => {
      const { container } = render(<Progress type="linear" value={50} aria-label="Loading" />);
      const indicator = container.querySelector("[data-progress-indicator]");
      expect(indicator).toHaveStyle({ width: "50%" });
    });

    test("calculates 75% for value=150 on range 0-200", () => {
      const { container } = render(
        <Progress type="linear" minValue={0} maxValue={200} value={150} aria-label="Loading" />
      );
      const indicator = container.querySelector("[data-progress-indicator]");
      expect(indicator).toHaveStyle({ width: "75%" });
    });

    test("calculates 0% for value=0", () => {
      const { container } = render(<Progress type="linear" value={0} aria-label="Loading" />);
      const indicator = container.querySelector("[data-progress-indicator]");
      expect(indicator).toHaveStyle({ width: "0%" });
    });

    test("calculates 100% for value=100", () => {
      const { container } = render(<Progress type="linear" value={100} aria-label="Loading" />);
      const indicator = container.querySelector("[data-progress-indicator]");
      expect(indicator).toHaveStyle({ width: "100%" });
    });

    test("renders stop indicator dot for linear determinate", () => {
      const { container } = render(<Progress type="linear" value={50} aria-label="Loading" />);
      const dot = container.querySelector("[data-stop-indicator]");
      expect(dot).toBeInTheDocument();
    });

    test("does not render stop indicator dot for linear indeterminate", () => {
      const { container } = linearIndeterminate();
      const dot = container.querySelector("[data-stop-indicator]");
      expect(dot).not.toBeInTheDocument();
    });
  });

  // ---------------------------------------------------------------------------
  // Linear Variant
  // ---------------------------------------------------------------------------

  describe("Linear Determinate", () => {
    test("renders track element", () => {
      const { container } = linearDeterminate();
      expect(container.querySelector("[data-progress-track]")).toBeInTheDocument();
    });

    test("renders indicator element inside track", () => {
      const { container } = linearDeterminate();
      expect(container.querySelector("[data-progress-indicator]")).toBeInTheDocument();
    });

    test("indicator has width matching percentage", () => {
      const { container } = render(<Progress type="linear" value={60} aria-label="Loading" />);
      const indicator = container.querySelector("[data-progress-indicator]");
      expect(indicator).toHaveStyle({ width: "60%" });
    });
  });

  describe("Linear Indeterminate", () => {
    test("renders indeterminate animation wrapper", () => {
      const { container } = linearIndeterminate();
      expect(container.querySelector("[data-progress-indeterminate]")).toBeInTheDocument();
    });

    test("does not render a fixed-width indicator element", () => {
      const { container } = linearIndeterminate();
      expect(container.querySelector("[data-progress-indicator]")).not.toBeInTheDocument();
    });

    test("does not have aria-valuenow when indeterminate", () => {
      linearIndeterminate();
      expect(screen.getByRole("progressbar")).not.toHaveAttribute("aria-valuenow");
    });
  });

  // ---------------------------------------------------------------------------
  // Circular Variant
  // ---------------------------------------------------------------------------

  describe("Circular Determinate", () => {
    test("renders an SVG element", () => {
      const { container } = circularDeterminate();
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    test("renders two circles (background + foreground)", () => {
      const { container } = circularDeterminate();
      const circles = container.querySelectorAll("circle");
      expect(circles).toHaveLength(2);
    });

    test("foreground circle has stroke-dashoffset attribute", () => {
      const { container } = circularDeterminate();
      const circles = container.querySelectorAll("circle");
      const foreground = circles[1];
      expect(foreground).toHaveAttribute("stroke-dashoffset");
    });

    test("foreground stroke-dashoffset is 0 at 100% value", () => {
      const { container } = render(<Progress type="circular" value={100} aria-label="Complete" />);
      const circles = container.querySelectorAll("circle");
      const foreground = circles[1];
      expect(Number(foreground?.getAttribute("stroke-dashoffset"))).toBeCloseTo(0, 0);
    });
  });

  describe("Circular Indeterminate", () => {
    test("renders an SVG element", () => {
      const { container } = circularIndeterminate();
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    test("renders indeterminate SVG wrapper", () => {
      const { container } = circularIndeterminate();
      expect(container.querySelector("[data-progress-indeterminate]")).toBeInTheDocument();
    });

    test("does not have aria-valuenow when indeterminate", () => {
      circularIndeterminate();
      expect(screen.getByRole("progressbar")).not.toHaveAttribute("aria-valuenow");
    });
  });

  // ---------------------------------------------------------------------------
  // Circular Size Prop
  // ---------------------------------------------------------------------------

  describe("Circular Size", () => {
    test("applies small size class for size=small", () => {
      const { container } = render(
        <Progress type="circular" indeterminate size="small" aria-label="Loading" />
      );
      const svg = container.querySelector("svg");
      expect(svg?.closest("[data-progress-size]")).toHaveAttribute("data-progress-size", "small");
    });

    test("applies medium size class for size=medium (default)", () => {
      const { container } = circularIndeterminate();
      const svg = container.querySelector("svg");
      expect(svg?.closest("[data-progress-size]")).toHaveAttribute("data-progress-size", "medium");
    });

    test("applies large size class for size=large", () => {
      const { container } = render(
        <Progress type="circular" indeterminate size="large" aria-label="Loading" />
      );
      const svg = container.querySelector("svg");
      expect(svg?.closest("[data-progress-size]")).toHaveAttribute("data-progress-size", "large");
    });
  });

  // ---------------------------------------------------------------------------
  // Accessibility
  // ---------------------------------------------------------------------------

  describe("Accessibility — axe", () => {
    test("linear determinate has no axe violations", async () => {
      const { container } = render(<Progress type="linear" value={50} label="Loading files" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("linear indeterminate has no axe violations", async () => {
      const { container } = render(
        <Progress type="linear" indeterminate aria-label="Loading content" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("circular determinate has no axe violations", async () => {
      const { container } = render(<Progress type="circular" value={75} label="Uploading" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("circular indeterminate has no axe violations", async () => {
      const { container } = render(<Progress type="circular" indeterminate aria-label="Loading" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // ---------------------------------------------------------------------------
  // Development Warnings
  // ---------------------------------------------------------------------------

  describe("Development Warnings", () => {
    beforeEach(() => {
      vi.spyOn(console, "warn").mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    test("warns when no label or aria-label is provided", () => {
      render(<Progress type="linear" value={50} />);
      expect(console.warn).toHaveBeenCalledWith(expect.stringContaining("[Progress]"));
    });

    test("does not warn when label prop is provided", () => {
      render(<Progress type="linear" value={50} label="Loading" />);
      expect(console.warn).not.toHaveBeenCalled();
    });

    test("does not warn when aria-label is provided", () => {
      render(<Progress type="linear" value={50} aria-label="Loading" />);
      expect(console.warn).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------------------
  // ProgressHeadless
  // ---------------------------------------------------------------------------

  describe("ProgressHeadless", () => {
    test("renders with role=progressbar", () => {
      render(<ProgressHeadless value={50} aria-label="Loading" />);
      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    test("passes progressBarProps to container", () => {
      render(<ProgressHeadless value={60} aria-label="Loading" />);
      const bar = screen.getByRole("progressbar");
      expect(bar).toHaveAttribute("aria-valuenow", "60");
    });

    test("calls renderProgress with correct state", () => {
      const renderProgress = vi.fn(() => null);
      render(<ProgressHeadless value={40} aria-label="Loading" renderProgress={renderProgress} />);
      expect(renderProgress).toHaveBeenCalledWith(
        expect.objectContaining({
          percentage: 40,
          isIndeterminate: false,
          type: "linear",
        })
      );
    });

    test("calls renderProgress with isIndeterminate=true when indeterminate", () => {
      const renderProgress = vi.fn(() => null);
      render(
        <ProgressHeadless indeterminate aria-label="Loading" renderProgress={renderProgress} />
      );
      expect(renderProgress).toHaveBeenCalledWith(
        expect.objectContaining({ isIndeterminate: true })
      );
    });

    test("renders children inside container", () => {
      render(
        <ProgressHeadless value={50} aria-label="Loading">
          <span data-testid="custom-child">Custom</span>
        </ProgressHeadless>
      );
      expect(screen.getByTestId("custom-child")).toBeInTheDocument();
    });

    test("forwards ref to container element", () => {
      const ref = { current: null };
      render(<ProgressHeadless value={50} aria-label="Loading" ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLElement);
    });
  });
});
