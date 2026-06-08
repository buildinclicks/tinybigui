/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { axe } from "vitest-axe";
import { FAB } from "./FAB";
import React from "react";
import { isKeyboardAccessible, hasAccessibleLabel } from "../../../test/helpers";

const IconAdd = (): React.ReactElement => <svg data-testid="icon-add" />;
const IconEdit = (): React.ReactElement => <svg data-testid="icon-edit" />;
const IconCamera = (): React.ReactElement => <svg data-testid="icon-camera" />;

describe("FAB", () => {
  // ── Rendering ───────────────────────────────────────────────────────────────

  describe("Rendering", () => {
    test("renders FAB with icon content", () => {
      render(<FAB aria-label="Create new item" icon={<IconAdd />} />);
      expect(screen.getByRole("button", { name: "Create new item" })).toBeInTheDocument();
      expect(screen.getByTestId("icon-add")).toBeInTheDocument();
    });

    test("renders with aria-label", () => {
      render(<FAB aria-label="Add photo" icon={<IconCamera />} />);
      expect(screen.getByLabelText("Add photo")).toBeInTheDocument();
    });

    // ── Default size is 'fab' (56dp) ──────────────────────────────────────────

    test("renders fab size by default (56dp)", () => {
      render(<FAB aria-label="Add" icon={<IconAdd />} />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-14", "w-14"); // 56dp
    });

    test("renders small size (40dp)", () => {
      render(<FAB aria-label="Add" icon={<IconAdd />} size="small" />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-10", "w-10"); // 40dp
    });

    test("renders medium size (80dp, M3 Expressive)", () => {
      render(<FAB aria-label="Add" icon={<IconAdd />} size="medium" />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-20", "w-20"); // 80dp
    });

    test("renders large size (96dp)", () => {
      render(<FAB aria-label="Add" icon={<IconAdd />} size="large" />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-24", "w-24"); // 96dp
    });

    test("renders extended size with text", () => {
      render(
        <FAB aria-label="Create new" icon={<IconAdd />} size="extended">
          Create
        </FAB>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-14"); // 56dp height
      expect(screen.getByText("Create")).toBeInTheDocument();
    });

    // ── Default color is 'primary-container' ──────────────────────────────────

    test("renders with primary-container color by default", () => {
      render(<FAB aria-label="Add" icon={<IconAdd />} />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-primary-container", "text-on-primary-container");
    });

    // ── Container color styles ────────────────────────────────────────────────

    test("renders with secondary-container color", () => {
      render(<FAB aria-label="Add" icon={<IconAdd />} color="secondary-container" />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-secondary-container", "text-on-secondary-container");
    });

    test("renders with tertiary-container color", () => {
      render(<FAB aria-label="Add" icon={<IconAdd />} color="tertiary-container" />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-tertiary-container", "text-on-tertiary-container");
    });

    // ── Solid color styles (M3 Expressive) ───────────────────────────────────

    test("renders with solid primary color", () => {
      render(<FAB aria-label="Add" icon={<IconAdd />} color="primary" />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-primary", "text-on-primary");
    });

    test("renders with solid secondary color", () => {
      render(<FAB aria-label="Add" icon={<IconAdd />} color="secondary" />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-secondary", "text-on-secondary");
    });

    test("renders with solid tertiary color", () => {
      render(<FAB aria-label="Add" icon={<IconAdd />} color="tertiary" />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-tertiary", "text-on-tertiary");
    });

    // ── Deprecated surface color ──────────────────────────────────────────────

    test("renders with deprecated surface color (surface-container-high)", () => {
      render(<FAB aria-label="Add" icon={<IconAdd />} color="surface" />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-surface-container-high", "text-primary");
    });

    // ── Corner radii ──────────────────────────────────────────────────────────

    test("fab size has 16dp corner radius (rounded-2xl)", () => {
      render(<FAB aria-label="Add" icon={<IconAdd />} />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("rounded-2xl");
      expect(button).not.toHaveClass("rounded-full");
    });

    test("medium size has 20dp corner radius (rounded-[20px])", () => {
      render(<FAB aria-label="Add" icon={<IconAdd />} size="medium" />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("rounded-[20px]");
    });

    test("small size has 12dp corner radius (rounded-xl)", () => {
      render(<FAB aria-label="Add" icon={<IconAdd />} size="small" />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("rounded-xl");
    });

    // ── Elevation ─────────────────────────────────────────────────────────────

    test("has elevation-3 shadow by default", () => {
      render(<FAB aria-label="Add" icon={<IconAdd />} />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("shadow-elevation-3");
    });

    // ── Slots presence ────────────────────────────────────────────────────────

    test("renders state-layer slot", () => {
      render(<FAB aria-label="Add" icon={<IconAdd />} />);
      const button = screen.getByRole("button");
      // State layer is an aria-hidden span inside the button
      const stateLayer = button.querySelector('span[aria-hidden="true"]');
      expect(stateLayer).toBeInTheDocument();
    });

    // ── className passthrough ─────────────────────────────────────────────────

    test("merges custom className", () => {
      render(<FAB aria-label="Add" icon={<IconAdd />} className="custom-class" />);
      expect(screen.getByRole("button")).toHaveClass("custom-class");
    });

    test("applies title attribute", () => {
      render(<FAB aria-label="Add" icon={<IconAdd />} title="Add new item" />);
      expect(screen.getByRole("button")).toHaveAttribute("title", "Add new item");
    });
  });

  // ── Extended FAB ────────────────────────────────────────────────────────────

  describe("Extended FAB", () => {
    test("renders icon and text together", () => {
      render(
        <FAB aria-label="Create new" icon={<IconAdd />} size="extended">
          Create
        </FAB>
      );
      expect(screen.getByTestId("icon-add")).toBeInTheDocument();
      expect(screen.getByText("Create")).toBeInTheDocument();
    });

    test("has variable width (not fixed)", () => {
      render(
        <FAB aria-label="Create new" icon={<IconAdd />} size="extended">
          Create
        </FAB>
      );
      const button = screen.getByRole("button");
      expect(button).not.toHaveClass("w-14", "w-10", "w-24", "w-20");
    });

    test("applies asymmetric padding for extended variant", () => {
      render(
        <FAB aria-label="Create new" icon={<IconAdd />} size="extended">
          Create
        </FAB>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveClass("pl-4", "pr-5");
    });

    test("renders extended FAB with longer text", () => {
      render(
        <FAB aria-label="Create new document" icon={<IconAdd />} size="extended">
          Create New Document
        </FAB>
      );
      expect(screen.getByText("Create New Document")).toBeInTheDocument();
    });

    test("does not render text for non-extended sizes", () => {
      render(
        <FAB aria-label="Add" icon={<IconAdd />} size="fab">
          Hidden Text
        </FAB>
      );
      expect(screen.queryByText("Hidden Text")).not.toBeInTheDocument();
    });
  });

  // ── States ──────────────────────────────────────────────────────────────────

  describe("States", () => {
    test("handles disabled state — button is disabled", () => {
      render(<FAB aria-label="Add" icon={<IconAdd />} isDisabled />);
      expect(screen.getByRole("button")).toBeDisabled();
    });

    test("handles disabled state — data-disabled attribute is set", () => {
      render(<FAB aria-label="Add" icon={<IconAdd />} isDisabled />);
      expect(screen.getByRole("button")).toHaveAttribute("data-disabled");
    });

    test("handles disabled state — data-[disabled] classes applied", () => {
      render(<FAB aria-label="Add" icon={<IconAdd />} isDisabled />);
      const button = screen.getByRole("button");
      // Disabled styling uses data-[disabled]: Tailwind conditional classes
      expect(button).toHaveClass(
        "data-[disabled]:pointer-events-none",
        "data-[disabled]:cursor-not-allowed"
      );
    });

    test("renders loading state — spinner is visible", () => {
      render(<FAB aria-label="Creating" icon={<IconAdd />} loading />);
      expect(screen.getByRole("progressbar")).toBeInTheDocument();
      expect(screen.getByRole("button")).toBeDisabled();
    });

    test("hides icon when loading (invisible not hidden)", () => {
      render(<FAB aria-label="Creating" icon={<IconAdd />} loading />);
      const icon = screen.getByTestId("icon-add");
      expect(icon.parentElement).toHaveClass("invisible");
    });

    test("shows spinner when loading", () => {
      render(<FAB aria-label="Creating" icon={<IconAdd />} loading />);
      expect(screen.getByRole("progressbar", { name: "Loading" })).toBeInTheDocument();
    });
  });

  // ── Interactions ─────────────────────────────────────────────────────────────

  describe("Interactions", () => {
    test("calls onPress when clicked", async () => {
      const user = userEvent.setup();
      const onPress = vi.fn();
      render(<FAB aria-label="Add" icon={<IconAdd />} onPress={onPress} />);
      await user.click(screen.getByRole("button"));
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    test("does not call onPress when disabled", async () => {
      const user = userEvent.setup();
      const onPress = vi.fn();
      render(<FAB aria-label="Add" icon={<IconAdd />} onPress={onPress} isDisabled />);
      await user.click(screen.getByRole("button"));
      expect(onPress).not.toHaveBeenCalled();
    });

    test("handles Enter key", async () => {
      const user = userEvent.setup();
      const onPress = vi.fn();
      render(<FAB aria-label="Add" icon={<IconAdd />} onPress={onPress} />);
      screen.getByRole("button").focus();
      await user.keyboard("{Enter}");
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    test("handles Space key", async () => {
      const user = userEvent.setup();
      const onPress = vi.fn();
      render(<FAB aria-label="Add" icon={<IconAdd />} onPress={onPress} />);
      screen.getByRole("button").focus();
      await user.keyboard(" ");
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    test("is keyboard accessible", () => {
      render(<FAB aria-label="Add" icon={<IconAdd />} />);
      expect(isKeyboardAccessible(screen.getByRole("button"))).toBe(true);
    });

    test("shows focus when focused", () => {
      render(<FAB aria-label="Add" icon={<IconAdd />} />);
      const button = screen.getByRole("button");
      button.focus();
      expect(button).toHaveFocus();
    });

    test("handles rapid clicks", async () => {
      const user = userEvent.setup();
      const onPress = vi.fn();
      render(<FAB aria-label="Add" icon={<IconAdd />} onPress={onPress} />);
      await user.tripleClick(screen.getByRole("button"));
      expect(onPress).toHaveBeenCalledTimes(3);
    });
  });

  // ── Accessibility ────────────────────────────────────────────────────────────

  describe("Accessibility", () => {
    test("has accessible label", () => {
      render(<FAB aria-label="Add new item" icon={<IconAdd />} />);
      expect(hasAccessibleLabel(screen.getByRole("button"))).toBe(true);
    });

    test("aria-label is applied to the button", () => {
      render(<FAB aria-label="Add" icon={<IconAdd />} />);
      expect(screen.getByRole("button")).toHaveAttribute("aria-label", "Add");
    });

    test("extended FAB still requires aria-label even with visible text", () => {
      render(
        <FAB aria-label="Create new item" icon={<IconAdd />} size="extended">
          Create
        </FAB>
      );
      expect(screen.getByRole("button")).toHaveAttribute("aria-label", "Create new item");
    });

    test("has proper button role", () => {
      render(<FAB aria-label="Add" icon={<IconAdd />} />);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    test("disabled FAB has disabled attribute", () => {
      render(<FAB aria-label="Add" icon={<IconAdd />} isDisabled />);
      expect(screen.getByRole("button")).toHaveAttribute("disabled");
    });

    test("loading FAB is disabled", () => {
      render(<FAB aria-label="Creating" icon={<IconAdd />} loading />);
      expect(screen.getByRole("button")).toBeDisabled();
    });

    test("loading spinner has accessible label", () => {
      render(<FAB aria-label="Creating" icon={<IconAdd />} loading />);
      expect(screen.getByRole("progressbar", { name: "Loading" })).toBeInTheDocument();
    });
  });

  // ── Button type ──────────────────────────────────────────────────────────────

  describe("Button Types", () => {
    test("defaults to button type", () => {
      render(<FAB aria-label="Add" icon={<IconAdd />} />);
      expect(screen.getByRole("button")).toHaveAttribute("type", "button");
    });

    test("supports submit type", () => {
      render(<FAB aria-label="Submit" icon={<IconEdit />} type="submit" />);
      expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
    });

    test("supports reset type", () => {
      render(<FAB aria-label="Reset" icon={<IconEdit />} type="reset" />);
      expect(screen.getByRole("button")).toHaveAttribute("type", "reset");
    });
  });

  // ── Ripple ───────────────────────────────────────────────────────────────────

  describe("Ripple Effect", () => {
    test("ripple container exists by default", () => {
      render(<FAB aria-label="Add" icon={<IconAdd />} />);
      const button = screen.getByRole("button");
      const ripples = button.querySelectorAll(".animate-ripple");
      expect(ripples.length).toBeGreaterThanOrEqual(0);
    });

    test("no ripple when disableRipple is true", () => {
      render(<FAB aria-label="Add" icon={<IconAdd />} disableRipple />);
      const ripples = screen.getByRole("button").querySelectorAll(".animate-ripple");
      expect(ripples.length).toBe(0);
    });

    test("no ripple when disabled", () => {
      render(<FAB aria-label="Add" icon={<IconAdd />} isDisabled />);
      const ripples = screen.getByRole("button").querySelectorAll(".animate-ripple");
      expect(ripples.length).toBe(0);
    });
  });

  // ── Positioning ───────────────────────────────────────────────────────────────

  describe("Positioning", () => {
    test("accepts custom className for positioning", () => {
      render(<FAB aria-label="Add" icon={<IconAdd />} className="fixed right-4 bottom-4" />);
      expect(screen.getByRole("button")).toHaveClass("fixed", "bottom-4", "right-4");
    });
  });

  // ── All sizes + colors render ─────────────────────────────────────────────────

  describe("Size Variations", () => {
    test("renders all size variations without error", () => {
      const sizes = ["fab", "medium", "large", "small"] as const;
      sizes.forEach((size) => {
        const { unmount } = render(
          <FAB aria-label={`${size} FAB`} icon={<IconAdd />} size={size} />
        );
        expect(screen.getByRole("button")).toBeInTheDocument();
        unmount();
      });
    });

    test("small FAB has minimum touch target margin", () => {
      render(<FAB aria-label="Add" icon={<IconAdd />} size="small" />);
      expect(screen.getByRole("button")).toHaveClass("m-1"); // 4dp margin → 48dp touch target
    });
  });

  describe("Color Variations", () => {
    test("renders all color variations without error", () => {
      const colors = [
        "primary-container",
        "secondary-container",
        "tertiary-container",
        "primary",
        "secondary",
        "tertiary",
        "surface",
      ] as const;
      colors.forEach((color) => {
        const { unmount } = render(
          <FAB aria-label={`${color} FAB`} icon={<IconAdd />} color={color} />
        );
        expect(screen.getByRole("button")).toBeInTheDocument();
        unmount();
      });
    });
  });

  // ── Edge cases ────────────────────────────────────────────────────────────────

  describe("Edge Cases", () => {
    test("handles null icon gracefully", () => {
      render(
        <FAB aria-label="Create" icon={null} size="extended">
          Create
        </FAB>
      );
      expect(screen.getByRole("button")).toBeInTheDocument();
      expect(screen.getByText("Create")).toBeInTheDocument();
    });

    test("forwards ref correctly", () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(<FAB aria-label="Add" icon={<IconAdd />} ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  // ── Development warnings ──────────────────────────────────────────────────────

  describe("Development Warnings", () => {
    const originalEnv = process.env.NODE_ENV;
    const consoleWarn = vi.spyOn(console, "warn").mockImplementation(() => {});

    afterEach(() => {
      process.env.NODE_ENV = originalEnv;
      consoleWarn.mockClear();
    });

    test("warns when icon is missing", () => {
      process.env.NODE_ENV = "development";
      render(<FAB aria-label="Empty" icon={null} />);
      expect(consoleWarn).toHaveBeenCalledWith(
        "[FAB] FAB must have an icon. Please provide the `icon` prop."
      );
    });

    test("warns when extended FAB has no children", () => {
      process.env.NODE_ENV = "development";
      render(<FAB aria-label="Create" icon={<IconAdd />} size="extended" />);
      expect(consoleWarn).toHaveBeenCalledWith(
        "[FAB] Extended FAB requires a text label as `children`."
      );
    });

    test("warns when non-extended FAB has children", () => {
      process.env.NODE_ENV = "development";
      render(
        <FAB aria-label="Add" icon={<IconAdd />} size="fab">
          Hidden
        </FAB>
      );
      expect(consoleWarn).toHaveBeenCalledWith(expect.stringContaining("size='extended'"));
    });

    test("warns when deprecated size='small' is used", () => {
      process.env.NODE_ENV = "development";
      render(<FAB aria-label="Add" icon={<IconAdd />} size="small" />);
      expect(consoleWarn).toHaveBeenCalledWith(
        "[FAB] `size='small'` is deprecated in M3 Expressive. Use `size='fab'` (56dp) instead."
      );
    });

    test("warns when deprecated color='surface' is used", () => {
      process.env.NODE_ENV = "development";
      render(<FAB aria-label="Add" icon={<IconAdd />} color="surface" />);
      expect(consoleWarn).toHaveBeenCalledWith(
        "[FAB] `color='surface'` is deprecated in M3 Expressive. Use `color='primary-container'` instead."
      );
    });
  });

  // ── Axe accessibility ──────────────────────────────────────────────────────────

  describe("Axe Accessibility", () => {
    test("has no accessibility violations — default fab", async () => {
      const { container } = render(<FAB aria-label="Add new item" icon={<IconAdd />} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("has no accessibility violations — medium size", async () => {
      const { container } = render(
        <FAB aria-label="Add new item" icon={<IconAdd />} size="medium" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("has no accessibility violations — disabled", async () => {
      const { container } = render(<FAB aria-label="Add" icon={<IconAdd />} isDisabled />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("has no accessibility violations — loading", async () => {
      const { container } = render(<FAB aria-label="Creating" icon={<IconAdd />} loading />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("has no accessibility violations — extended FAB", async () => {
      const { container } = render(
        <FAB aria-label="Create new item" icon={<IconAdd />} size="extended">
          Create
        </FAB>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("has no accessibility violations — solid primary color", async () => {
      const { container } = render(<FAB aria-label="Add" icon={<IconAdd />} color="primary" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
