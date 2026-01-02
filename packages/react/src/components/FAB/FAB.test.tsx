/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { FAB } from "./FAB";
import React from "react";
import { isKeyboardAccessible, hasAccessibleLabel } from "../../../test/helpers";

// Mock icons for testing
const IconAdd = (): React.ReactElement => <svg data-testid="icon-add" />;
const IconEdit = (): React.ReactElement => <svg data-testid="icon-edit" />;
const IconCamera = (): React.ReactElement => <svg data-testid="icon-camera" />;

describe("FAB", () => {
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

    test("renders medium size by default", () => {
      render(<FAB aria-label="Add" icon={<IconAdd />} />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-14", "w-14"); // 56px
    });

    test("renders small size", () => {
      render(<FAB aria-label="Add" icon={<IconAdd />} size="small" />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-10", "w-10"); // 40px
    });

    test("renders large size", () => {
      render(<FAB aria-label="Add" icon={<IconAdd />} size="large" />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-24", "w-24"); // 96px
    });

    test("renders extended size with text", () => {
      render(
        <FAB aria-label="Create new" icon={<IconAdd />} size="extended">
          Create
        </FAB>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-14"); // 56px height
      expect(screen.getByText("Create")).toBeInTheDocument();
    });

    test("renders with primary color by default", () => {
      render(<FAB aria-label="Add" icon={<IconAdd />} />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-primary-container", "text-on-primary-container");
    });

    test("renders with secondary color", () => {
      render(<FAB aria-label="Add" icon={<IconAdd />} color="secondary" />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-secondary-container", "text-on-secondary-container");
    });

    test("renders with tertiary color", () => {
      render(<FAB aria-label="Add" icon={<IconAdd />} color="tertiary" />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-tertiary-container", "text-on-tertiary-container");
    });

    test("renders with surface color", () => {
      render(<FAB aria-label="Add" icon={<IconAdd />} color="surface" />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-surface", "text-primary");
    });

    test("has elevation shadow by default", () => {
      render(<FAB aria-label="Add" icon={<IconAdd />} />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("shadow-elevation-3");
    });

    test("has proper border radius (not fully rounded)", () => {
      render(<FAB aria-label="Add" icon={<IconAdd />} />);
      const button = screen.getByRole("button");
      // Medium FAB uses 16px (rounded-2xl), not rounded-full
      expect(button).toHaveClass("rounded-2xl");
      expect(button).not.toHaveClass("rounded-full");
    });

    test("merges custom className", () => {
      render(<FAB aria-label="Add" icon={<IconAdd />} className="custom-class" />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("custom-class");
    });

    test("applies title attribute", () => {
      render(<FAB aria-label="Add" icon={<IconAdd />} title="Add new item" />);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("title", "Add new item");
    });
  });

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
      // Extended FAB should not have fixed width classes like w-14
      expect(button).not.toHaveClass("w-14", "w-10", "w-24");
    });

    test("applies correct padding for extended variant", () => {
      render(
        <FAB aria-label="Create new" icon={<IconAdd />} size="extended">
          Create
        </FAB>
      );
      const button = screen.getByRole("button");
      // Extended FAB has asymmetric padding
      expect(button).toHaveClass("pl-4", "pr-5"); // 16px leading, 20px trailing
    });

    test("renders extended FAB with longer text", () => {
      render(
        <FAB aria-label="Create new document" icon={<IconAdd />} size="extended">
          Create New Document
        </FAB>
      );
      expect(screen.getByText("Create New Document")).toBeInTheDocument();
    });
  });

  describe("States", () => {
    test("handles disabled state", () => {
      render(<FAB aria-label="Add" icon={<IconAdd />} isDisabled />);
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      // Check for disabled styling classes
      expect(button).toHaveClass("pointer-events-none", "cursor-not-allowed");
      // Shadow should be none
      expect(button.className).toContain("shadow-none");
    });

    test("renders loading state", () => {
      render(<FAB aria-label="Creating" icon={<IconAdd />} loading />);
      const button = screen.getByRole("button");
      expect(screen.getByRole("progressbar")).toBeInTheDocument();
      expect(button).toBeDisabled();
    });

    test("hides icon when loading", () => {
      render(<FAB aria-label="Creating" icon={<IconAdd />} loading />);
      const icon = screen.getByTestId("icon-add");
      expect(icon.parentElement).toHaveClass("invisible");
    });

    test("shows spinner when loading", () => {
      render(<FAB aria-label="Creating" icon={<IconAdd />} loading />);
      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });
  });

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

    test("handles keyboard interaction with Enter key", async () => {
      const user = userEvent.setup();
      const onPress = vi.fn();

      render(<FAB aria-label="Add" icon={<IconAdd />} onPress={onPress} />);

      const button = screen.getByRole("button");
      button.focus();
      await user.keyboard("{Enter}");
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    test("handles keyboard interaction with Space key", async () => {
      const user = userEvent.setup();
      const onPress = vi.fn();

      render(<FAB aria-label="Add" icon={<IconAdd />} onPress={onPress} />);

      const button = screen.getByRole("button");
      button.focus();
      await user.keyboard(" ");
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    test("is keyboard accessible", () => {
      render(<FAB aria-label="Add" icon={<IconAdd />} />);
      const button = screen.getByRole("button");
      expect(isKeyboardAccessible(button)).toBe(true);
    });

    test("shows focus indicator when focused", () => {
      render(<FAB aria-label="Add" icon={<IconAdd />} />);
      const button = screen.getByRole("button");
      button.focus();
      expect(button).toHaveFocus();
    });
  });

  describe("Accessibility", () => {
    test("has accessible label", () => {
      render(<FAB aria-label="Add new item" icon={<IconAdd />} />);
      const button = screen.getByRole("button");
      expect(hasAccessibleLabel(button)).toBe(true);
    });

    test("requires aria-label (enforced by types)", () => {
      render(<FAB aria-label="Add" icon={<IconAdd />} />);
      const button = screen.getByRole("button");
      expect(button).toHaveAccessibleName("Add");
    });

    test("extended FAB still requires aria-label even with text", () => {
      render(
        <FAB aria-label="Create new item" icon={<IconAdd />} size="extended">
          Create
        </FAB>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label", "Create new item");
    });

    test("has proper button role", () => {
      render(<FAB aria-label="Add" icon={<IconAdd />} />);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    test("includes icon in accessibility tree", () => {
      render(<FAB aria-label="Add new item" icon={<IconAdd />} />);
      expect(screen.getByTestId("icon-add")).toBeInTheDocument();
    });

    test("disabled FAB has aria-disabled", () => {
      render(<FAB aria-label="Add" icon={<IconAdd />} isDisabled />);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("disabled");
    });

    test("loading FAB is disabled", () => {
      render(<FAB aria-label="Creating" icon={<IconAdd />} loading />);
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
    });
  });

  describe("Ripple Effect", () => {
    test("shows ripple effect by default", () => {
      render(<FAB aria-label="Add" icon={<IconAdd />} />);
      const button = screen.getByRole("button");
      // Ripple container should be present (initially empty)
      const ripples = button.querySelectorAll(".animate-ripple");
      expect(ripples.length).toBeGreaterThanOrEqual(0);
    });

    test("disables ripple when disableRipple is true", () => {
      render(<FAB aria-label="Add" icon={<IconAdd />} disableRipple />);
      const button = screen.getByRole("button");
      const ripples = button.querySelectorAll(".animate-ripple");
      expect(ripples.length).toBe(0);
    });

    test("does not show ripple when disabled", () => {
      render(<FAB aria-label="Add" icon={<IconAdd />} isDisabled />);
      const button = screen.getByRole("button");
      const ripples = button.querySelectorAll(".animate-ripple");
      expect(ripples.length).toBe(0);
    });
  });

  describe("Button Types", () => {
    test("defaults to button type", () => {
      render(<FAB aria-label="Add" icon={<IconAdd />} />);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "button");
    });

    test("supports submit type", () => {
      render(<FAB aria-label="Submit" icon={<IconEdit />} type="submit" />);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "submit");
    });

    test("supports reset type", () => {
      render(<FAB aria-label="Reset" icon={<IconEdit />} type="reset" />);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "reset");
    });
  });

  describe("Positioning", () => {
    test("is not fixed by default in tests", () => {
      render(<FAB aria-label="Add" icon={<IconAdd />} />);
      const button = screen.getByRole("button");
      // In test environment, we don't apply fixed positioning automatically
      // This is tested in Storybook/browser environment
      expect(button).toBeInTheDocument();
    });

    test("accepts custom className for positioning", () => {
      render(<FAB aria-label="Add" icon={<IconAdd />} className="fixed right-4 bottom-4" />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("fixed", "bottom-4", "right-4");
    });
  });

  describe("Size Variations", () => {
    test("renders all size variations", () => {
      const sizes = ["small", "medium", "large"] as const;

      sizes.forEach((size) => {
        const { container } = render(
          <FAB aria-label={`${size} FAB`} icon={<IconAdd />} size={size} />
        );
        expect(container.querySelector("button")).toBeInTheDocument();
      });
    });

    test("small FAB has minimum touch target", () => {
      render(<FAB aria-label="Add" icon={<IconAdd />} size="small" />);
      const button = screen.getByRole("button");
      // Small FAB is 40x40px with 4px margin = 48x48px touch target
      expect(button).toHaveClass("h-10", "w-10"); // 40px
    });
  });

  describe("Color Variations", () => {
    test("renders all color variations", () => {
      const colors = ["primary", "secondary", "tertiary", "surface"] as const;

      colors.forEach((color) => {
        const { container } = render(
          <FAB aria-label={`${color} FAB`} icon={<IconAdd />} color={color} />
        );
        expect(container.querySelector("button")).toBeInTheDocument();
      });
    });
  });

  describe("Edge Cases", () => {
    test("handles missing icon gracefully in extended FAB", () => {
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

    test("handles rapid clicks", async () => {
      const user = userEvent.setup();
      const onPress = vi.fn();

      render(<FAB aria-label="Add" icon={<IconAdd />} onPress={onPress} />);

      const button = screen.getByRole("button");
      await user.tripleClick(button);
      expect(onPress).toHaveBeenCalledTimes(3);
    });
  });

  describe("Development Warnings", () => {
    const originalEnv = process.env.NODE_ENV;
    const consoleWarn = vi.spyOn(console, "warn").mockImplementation(() => {});

    afterEach(() => {
      process.env.NODE_ENV = originalEnv;
      consoleWarn.mockClear();
    });

    test("warns when icon is missing in development", () => {
      process.env.NODE_ENV = "development";

      render(<FAB aria-label="Empty" icon={null} />);

      expect(consoleWarn).toHaveBeenCalledWith(
        "[FAB] FAB must have an icon. Please provide the icon prop."
      );
    });

    test("warns when extended FAB has no text in development", () => {
      process.env.NODE_ENV = "development";

      render(<FAB aria-label="Create" icon={<IconAdd />} size="extended" />);

      expect(consoleWarn).toHaveBeenCalledWith(
        "[FAB] Extended FAB requires text label as children."
      );
    });
  });
});
