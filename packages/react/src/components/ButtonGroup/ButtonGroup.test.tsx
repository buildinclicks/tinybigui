import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import type React from "react";
import { buttonGroupVariants } from "./ButtonGroup.variants";
import { ButtonGroupContext, useButtonGroup, useOptionalButtonGroup } from "./ButtonGroupContext";
import { ButtonGroupHeadless } from "./ButtonGroupHeadless";
import { ButtonGroup } from "./ButtonGroup";
import { getConnectedRadiusClasses, getInnerRadius, getOuterRadius } from "./ButtonGroup.utils";
import type { ButtonGroupContextValue } from "./ButtonGroup.types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Minimal child that reads context and renders selection state for testing.
 */
const ContextConsumer = ({ value }: { value: string }): React.ReactElement => {
  const ctx = useButtonGroup();
  const isSelected = ctx.selectedValues.has(value);
  return (
    <button
      aria-pressed={isSelected}
      data-variant={ctx.variant}
      data-size={ctx.size}
      data-shape={ctx.shape}
      onClick={() => ctx.onSelectionChange(value)}
    >
      {value}
    </button>
  );
};

// ---------------------------------------------------------------------------
// 1. buttonGroupVariants (CVA) — class output
// ---------------------------------------------------------------------------

describe("buttonGroupVariants", () => {
  describe("standard variant", () => {
    test("default (standard, md) has inline-flex", () => {
      const cls = buttonGroupVariants({ variant: "standard", size: "md" });
      expect(cls).toContain("inline-flex");
    });

    test("standard+xs has gap-[18px]", () => {
      const cls = buttonGroupVariants({ variant: "standard", size: "xs" });
      expect(cls).toContain("gap-[18px]");
    });

    test("standard+sm has gap-3", () => {
      const cls = buttonGroupVariants({ variant: "standard", size: "sm" });
      expect(cls).toContain("gap-3");
    });

    test("standard+md has gap-2", () => {
      const cls = buttonGroupVariants({ variant: "standard", size: "md" });
      expect(cls).toContain("gap-2");
    });

    test("standard+lg has gap-2", () => {
      const cls = buttonGroupVariants({ variant: "standard", size: "lg" });
      expect(cls).toContain("gap-2");
    });

    test("standard+xl has gap-2", () => {
      const cls = buttonGroupVariants({ variant: "standard", size: "xl" });
      expect(cls).toContain("gap-2");
    });
  });

  describe("connected variant", () => {
    test("connected has flex and w-full", () => {
      const cls = buttonGroupVariants({ variant: "connected", size: "md" });
      expect(cls).toContain("flex");
      expect(cls).toContain("w-full");
    });

    test("connected+xs has gap-0.5", () => {
      const cls = buttonGroupVariants({ variant: "connected", size: "xs" });
      expect(cls).toContain("gap-0.5");
    });

    test("connected+sm has gap-0.5", () => {
      const cls = buttonGroupVariants({ variant: "connected", size: "sm" });
      expect(cls).toContain("gap-0.5");
    });

    test("connected+md has gap-0.5", () => {
      const cls = buttonGroupVariants({ variant: "connected", size: "md" });
      expect(cls).toContain("gap-0.5");
    });

    test("connected+lg has gap-0.5", () => {
      const cls = buttonGroupVariants({ variant: "connected", size: "lg" });
      expect(cls).toContain("gap-0.5");
    });

    test("connected+xl has gap-0.5", () => {
      const cls = buttonGroupVariants({ variant: "connected", size: "xl" });
      expect(cls).toContain("gap-0.5");
    });
  });

  test("default variant is standard", () => {
    const cls = buttonGroupVariants({});
    expect(cls).toContain("inline-flex");
  });

  test("default size is md", () => {
    const cls = buttonGroupVariants({ variant: "standard" });
    expect(cls).toContain("gap-2");
  });
});

// ---------------------------------------------------------------------------
// 2. ButtonGroupContext + useButtonGroup
// ---------------------------------------------------------------------------

describe("ButtonGroupContext", () => {
  const defaultContextValue: ButtonGroupContextValue = {
    variant: "standard",
    size: "md",
    shape: "round",
    selectionMode: undefined,
    selectedValues: new Set(),
    onSelectionChange: vi.fn(),
  };

  test("useButtonGroup throws when used outside a provider", () => {
    const TestComponent = (): null => {
      useButtonGroup();
      return null;
    };
    expect(() => render(<TestComponent />)).toThrow();
  });

  test("useButtonGroup returns context values from provider", () => {
    let capturedCtx: ButtonGroupContextValue | null = null;

    const Capture = (): null => {
      capturedCtx = useButtonGroup();
      return null;
    };

    render(
      <ButtonGroupContext.Provider value={defaultContextValue}>
        <Capture />
      </ButtonGroupContext.Provider>
    );

    expect(capturedCtx?.variant).toBe("standard");
    expect(capturedCtx?.size).toBe("md");
    expect(capturedCtx?.shape).toBe("round");
    expect(capturedCtx?.selectionMode).toBeUndefined();
  });

  test("useButtonGroup exposes onSelectionChange callback", () => {
    const onSelectionChange = vi.fn();
    const value: ButtonGroupContextValue = {
      ...defaultContextValue,
      onSelectionChange,
    };

    const Trigger = (): React.ReactElement => {
      const ctx = useButtonGroup();
      return <button onClick={() => ctx.onSelectionChange("a")}>go</button>;
    };

    render(
      <ButtonGroupContext.Provider value={value}>
        <Trigger />
      </ButtonGroupContext.Provider>
    );

    screen.getByRole("button").click();
    expect(onSelectionChange).toHaveBeenCalledWith("a");
  });
});

// ---------------------------------------------------------------------------
// 3. ButtonGroupHeadless
// ---------------------------------------------------------------------------

describe("ButtonGroupHeadless", () => {
  describe("Rendering", () => {
    test("renders a div with role='group'", () => {
      render(
        <ButtonGroupHeadless>
          <button>A</button>
        </ButtonGroupHeadless>
      );
      expect(screen.getByRole("group")).toBeInTheDocument();
    });

    test("renders children inside the group", () => {
      render(
        <ButtonGroupHeadless>
          <button>Alpha</button>
          <button>Beta</button>
        </ButtonGroupHeadless>
      );
      expect(screen.getByText("Alpha")).toBeInTheDocument();
      expect(screen.getByText("Beta")).toBeInTheDocument();
    });

    test("container does NOT have tabIndex", () => {
      render(
        <ButtonGroupHeadless>
          <button>X</button>
        </ButtonGroupHeadless>
      );
      expect(screen.getByRole("group")).not.toHaveAttribute("tabindex");
    });

    test("applies custom className", () => {
      render(
        <ButtonGroupHeadless className="my-class">
          <button>X</button>
        </ButtonGroupHeadless>
      );
      expect(screen.getByRole("group")).toHaveClass("my-class");
    });

    test("forwards ref to the div element", () => {
      const ref = { current: null };
      render(
        <ButtonGroupHeadless ref={ref}>
          <button>X</button>
        </ButtonGroupHeadless>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe("Context provision", () => {
    test("provides variant to children via context", () => {
      render(
        <ButtonGroupHeadless variant="connected">
          <ContextConsumer value="a" />
        </ButtonGroupHeadless>
      );
      expect(screen.getByRole("button")).toHaveAttribute("data-variant", "connected");
    });

    test("provides size to children via context", () => {
      render(
        <ButtonGroupHeadless size="lg">
          <ContextConsumer value="a" />
        </ButtonGroupHeadless>
      );
      expect(screen.getByRole("button")).toHaveAttribute("data-size", "lg");
    });

    test("provides shape to children via context", () => {
      render(
        <ButtonGroupHeadless shape="square">
          <ContextConsumer value="a" />
        </ButtonGroupHeadless>
      );
      expect(screen.getByRole("button")).toHaveAttribute("data-shape", "square");
    });
  });

  describe("Selection — single mode", () => {
    test("no button selected by default", () => {
      render(
        <ButtonGroupHeadless selectionMode="single">
          <ContextConsumer value="a" />
          <ContextConsumer value="b" />
        </ButtonGroupHeadless>
      );
      const buttons = screen.getAllByRole("button");
      buttons.forEach((btn) => expect(btn).toHaveAttribute("aria-pressed", "false"));
    });

    test("pressing a button selects it", async () => {
      const user = userEvent.setup();
      render(
        <ButtonGroupHeadless selectionMode="single">
          <ContextConsumer value="a" />
          <ContextConsumer value="b" />
        </ButtonGroupHeadless>
      );
      await user.click(screen.getByText("a"));
      expect(screen.getByText("a")).toHaveAttribute("aria-pressed", "true");
      expect(screen.getByText("b")).toHaveAttribute("aria-pressed", "false");
    });

    test("pressing another button moves selection", async () => {
      const user = userEvent.setup();
      render(
        <ButtonGroupHeadless selectionMode="single">
          <ContextConsumer value="a" />
          <ContextConsumer value="b" />
        </ButtonGroupHeadless>
      );
      await user.click(screen.getByText("a"));
      await user.click(screen.getByText("b"));
      expect(screen.getByText("a")).toHaveAttribute("aria-pressed", "false");
      expect(screen.getByText("b")).toHaveAttribute("aria-pressed", "true");
    });

    test("pressing selected button deselects it (single mode)", async () => {
      const user = userEvent.setup();
      render(
        <ButtonGroupHeadless selectionMode="single">
          <ContextConsumer value="a" />
        </ButtonGroupHeadless>
      );
      await user.click(screen.getByText("a"));
      await user.click(screen.getByText("a"));
      expect(screen.getByText("a")).toHaveAttribute("aria-pressed", "false");
    });

    test("defaultValue pre-selects a button", () => {
      render(
        <ButtonGroupHeadless selectionMode="single" defaultValue="b">
          <ContextConsumer value="a" />
          <ContextConsumer value="b" />
        </ButtonGroupHeadless>
      );
      expect(screen.getByText("b")).toHaveAttribute("aria-pressed", "true");
      expect(screen.getByText("a")).toHaveAttribute("aria-pressed", "false");
    });
  });

  describe("Selection — required mode", () => {
    test("pressing selected button does NOT deselect in required mode", async () => {
      const user = userEvent.setup();
      render(
        <ButtonGroupHeadless selectionMode="required" defaultValue="a">
          <ContextConsumer value="a" />
          <ContextConsumer value="b" />
        </ButtonGroupHeadless>
      );
      await user.click(screen.getByText("a"));
      expect(screen.getByText("a")).toHaveAttribute("aria-pressed", "true");
    });

    test("pressing another button moves selection in required mode", async () => {
      const user = userEvent.setup();
      render(
        <ButtonGroupHeadless selectionMode="required" defaultValue="a">
          <ContextConsumer value="a" />
          <ContextConsumer value="b" />
        </ButtonGroupHeadless>
      );
      await user.click(screen.getByText("b"));
      expect(screen.getByText("a")).toHaveAttribute("aria-pressed", "false");
      expect(screen.getByText("b")).toHaveAttribute("aria-pressed", "true");
    });
  });

  describe("Selection — multi mode", () => {
    test("multiple buttons can be selected simultaneously", async () => {
      const user = userEvent.setup();
      render(
        <ButtonGroupHeadless selectionMode="multi">
          <ContextConsumer value="a" />
          <ContextConsumer value="b" />
          <ContextConsumer value="c" />
        </ButtonGroupHeadless>
      );
      await user.click(screen.getByText("a"));
      await user.click(screen.getByText("c"));
      expect(screen.getByText("a")).toHaveAttribute("aria-pressed", "true");
      expect(screen.getByText("b")).toHaveAttribute("aria-pressed", "false");
      expect(screen.getByText("c")).toHaveAttribute("aria-pressed", "true");
    });

    test("pressing selected button deselects it in multi mode", async () => {
      const user = userEvent.setup();
      render(
        <ButtonGroupHeadless selectionMode="multi" defaultValue={["a", "b"]}>
          <ContextConsumer value="a" />
          <ContextConsumer value="b" />
        </ButtonGroupHeadless>
      );
      await user.click(screen.getByText("a"));
      expect(screen.getByText("a")).toHaveAttribute("aria-pressed", "false");
      expect(screen.getByText("b")).toHaveAttribute("aria-pressed", "true");
    });
  });

  describe("Controlled selection", () => {
    test("respects controlled selectedValues", () => {
      render(
        <ButtonGroupHeadless
          selectionMode="single"
          selectedValues={new Set(["b"])}
          onSelectionChange={vi.fn()}
        >
          <ContextConsumer value="a" />
          <ContextConsumer value="b" />
        </ButtonGroupHeadless>
      );
      expect(screen.getByText("b")).toHaveAttribute("aria-pressed", "true");
      expect(screen.getByText("a")).toHaveAttribute("aria-pressed", "false");
    });

    test("calls onSelectionChange with new Set when a button is clicked", async () => {
      const user = userEvent.setup();
      const onSelectionChange = vi.fn();
      render(
        <ButtonGroupHeadless
          selectionMode="single"
          selectedValues={new Set<string>()}
          onSelectionChange={onSelectionChange}
        >
          <ContextConsumer value="a" />
        </ButtonGroupHeadless>
      );
      await user.click(screen.getByText("a"));
      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      const arg = onSelectionChange.mock.calls[0][0] as Set<string>;
      expect(arg instanceof Set).toBe(true);
      expect(arg.has("a")).toBe(true);
    });
  });
});

// ---------------------------------------------------------------------------
// 4. ButtonGroup (styled layer)
// ---------------------------------------------------------------------------

describe("ButtonGroup", () => {
  describe("Rendering", () => {
    test("renders with role='group'", () => {
      render(
        <ButtonGroup>
          <button>A</button>
        </ButtonGroup>
      );
      expect(screen.getByRole("group")).toBeInTheDocument();
    });

    test("applies standard variant classes by default", () => {
      render(
        <ButtonGroup>
          <button>A</button>
        </ButtonGroup>
      );
      expect(screen.getByRole("group")).toHaveClass("inline-flex");
    });

    test("applies connected variant classes", () => {
      render(
        <ButtonGroup variant="connected">
          <button>A</button>
        </ButtonGroup>
      );
      const group = screen.getByRole("group");
      expect(group).toHaveClass("flex");
      expect(group).toHaveClass("w-full");
    });

    test("applies custom className", () => {
      render(
        <ButtonGroup className="extra-class">
          <button>A</button>
        </ButtonGroup>
      );
      expect(screen.getByRole("group")).toHaveClass("extra-class");
    });

    test("forwards ref to the div element", () => {
      const ref = { current: null };
      render(
        <ButtonGroup ref={ref}>
          <button>A</button>
        </ButtonGroup>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    test("container does NOT have tabIndex", () => {
      render(
        <ButtonGroup>
          <button>A</button>
        </ButtonGroup>
      );
      expect(screen.getByRole("group")).not.toHaveAttribute("tabindex");
    });
  });

  describe("Size + variant gap classes", () => {
    test("standard+xs applies gap-[18px]", () => {
      render(
        <ButtonGroup variant="standard" size="xs">
          <button>A</button>
        </ButtonGroup>
      );
      expect(screen.getByRole("group")).toHaveClass("gap-[18px]");
    });

    test("standard+sm applies gap-3", () => {
      render(
        <ButtonGroup variant="standard" size="sm">
          <button>A</button>
        </ButtonGroup>
      );
      expect(screen.getByRole("group")).toHaveClass("gap-3");
    });

    test("standard+md applies gap-2", () => {
      render(
        <ButtonGroup variant="standard" size="md">
          <button>A</button>
        </ButtonGroup>
      );
      expect(screen.getByRole("group")).toHaveClass("gap-2");
    });

    test("connected+md applies gap-0.5", () => {
      render(
        <ButtonGroup variant="connected" size="md">
          <button>A</button>
        </ButtonGroup>
      );
      expect(screen.getByRole("group")).toHaveClass("gap-0.5");
    });
  });

  describe("Context provision", () => {
    test("provides variant via context", () => {
      render(
        <ButtonGroup variant="connected">
          <ContextConsumer value="x" />
        </ButtonGroup>
      );
      expect(screen.getByRole("button")).toHaveAttribute("data-variant", "connected");
    });

    test("provides size via context", () => {
      render(
        <ButtonGroup size="xl">
          <ContextConsumer value="x" />
        </ButtonGroup>
      );
      expect(screen.getByRole("button")).toHaveAttribute("data-size", "xl");
    });
  });

  describe("Development warnings", () => {
    beforeEach(() => {
      vi.spyOn(console, "warn").mockImplementation(() => {});
      vi.stubEnv("NODE_ENV", "development");
    });

    afterEach(() => {
      vi.unstubAllEnvs();
    });

    test("warns when a child has data-variant='text'", () => {
      render(
        <ButtonGroup>
          <button data-variant="text">Text</button>
        </ButtonGroup>
      );
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining("[ButtonGroup]"),
        expect.stringContaining("text")
      );
    });

    test("warns when a child has data-variant='icon'", () => {
      render(
        <ButtonGroup>
          <button data-variant="icon">Icon</button>
        </ButtonGroup>
      );
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining("[ButtonGroup]"),
        expect.stringContaining("icon")
      );
    });
  });

  describe("Accessibility", () => {
    test("has no accessibility violations (standard)", async () => {
      const { container } = render(
        <ButtonGroup aria-label="Text formatting">
          <button aria-pressed="false">Bold</button>
          <button aria-pressed="false">Italic</button>
        </ButtonGroup>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("has no accessibility violations (connected)", async () => {
      const { container } = render(
        <ButtonGroup variant="connected" aria-label="Size picker">
          <button aria-pressed="true">8 oz</button>
          <button aria-pressed="false">12 oz</button>
        </ButtonGroup>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("keyboard: Tab moves focus between child buttons", async () => {
      const user = userEvent.setup();
      render(
        <ButtonGroup aria-label="Options">
          <button>First</button>
          <button>Second</button>
          <button>Third</button>
        </ButtonGroup>
      );

      await user.tab();
      expect(screen.getByText("First")).toHaveFocus();

      await user.tab();
      expect(screen.getByText("Second")).toHaveFocus();

      await user.tab();
      expect(screen.getByText("Third")).toHaveFocus();
    });
  });
});

// ---------------------------------------------------------------------------
// 5. useOptionalButtonGroup
// ---------------------------------------------------------------------------

describe("useOptionalButtonGroup", () => {
  test("returns null when called outside a provider", () => {
    let capturedCtx: ButtonGroupContextValue | null = undefined as unknown as null;

    const Capture = (): null => {
      capturedCtx = useOptionalButtonGroup();
      return null;
    };

    render(<Capture />);
    expect(capturedCtx).toBeNull();
  });

  test("returns context value when called inside a provider", () => {
    const mockValue: ButtonGroupContextValue = {
      variant: "connected",
      size: "md",
      shape: "round",
      selectionMode: "single",
      selectedValues: new Set(),
      onSelectionChange: vi.fn(),
      connectedInnerRadius: "rounded-sm",
      connectedOuterRadius: "rounded-full",
      enforceMinWidth: false,
    };

    let capturedCtx: ButtonGroupContextValue | null = null;

    const Capture = (): null => {
      capturedCtx = useOptionalButtonGroup();
      return null;
    };

    render(
      <ButtonGroupContext.Provider value={mockValue}>
        <Capture />
      </ButtonGroupContext.Provider>
    );

    expect(capturedCtx).not.toBeNull();
    expect(capturedCtx?.variant).toBe("connected");
    expect(capturedCtx?.connectedInnerRadius).toBe("rounded-sm");
    expect(capturedCtx?.connectedOuterRadius).toBe("rounded-full");
    expect(capturedCtx?.enforceMinWidth).toBe(false);
  });

  test("does NOT throw when called outside a provider (unlike useButtonGroup)", () => {
    const Capture = (): null => {
      useOptionalButtonGroup();
      return null;
    };
    expect(() => render(<Capture />)).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// 6. ButtonGroup.utils — getInnerRadius / getOuterRadius / getConnectedRadiusClasses
// ---------------------------------------------------------------------------

describe("ButtonGroup.utils", () => {
  describe("getInnerRadius", () => {
    test("returns rounded-xs for xs", () => {
      expect(getInnerRadius("xs")).toBe("rounded-xs");
    });

    test("returns rounded-sm for sm", () => {
      expect(getInnerRadius("sm")).toBe("rounded-sm");
    });

    test("returns rounded-sm for md", () => {
      expect(getInnerRadius("md")).toBe("rounded-sm");
    });

    test("returns rounded-lg for lg", () => {
      expect(getInnerRadius("lg")).toBe("rounded-lg");
    });

    test("returns rounded-[20px] for xl", () => {
      expect(getInnerRadius("xl")).toBe("rounded-[20px]");
    });
  });

  describe("getOuterRadius", () => {
    test("round shape always returns rounded-full regardless of size", () => {
      const sizes = ["xs", "sm", "md", "lg", "xl"] as const;
      sizes.forEach((size) => {
        expect(getOuterRadius("round", size)).toBe("rounded-full");
      });
    });

    test("square shape returns rounded-xs for xs", () => {
      expect(getOuterRadius("square", "xs")).toBe("rounded-xs");
    });

    test("square shape returns rounded-sm for sm/md", () => {
      expect(getOuterRadius("square", "sm")).toBe("rounded-sm");
      expect(getOuterRadius("square", "md")).toBe("rounded-sm");
    });

    test("square shape returns rounded-lg for lg", () => {
      expect(getOuterRadius("square", "lg")).toBe("rounded-lg");
    });

    test("square shape returns rounded-[20px] for xl", () => {
      expect(getOuterRadius("square", "xl")).toBe("rounded-[20px]");
    });
  });

  describe("getConnectedRadiusClasses", () => {
    const makeCtx = (
      size: ButtonGroupContextValue["size"],
      shape: ButtonGroupContextValue["shape"]
    ): ButtonGroupContextValue => ({
      variant: "connected",
      size,
      shape,
      selectionMode: undefined,
      selectedValues: new Set(),
      onSelectionChange: vi.fn(),
      connectedInnerRadius: getInnerRadius(size),
      connectedOuterRadius: getOuterRadius(shape, size),
      enforceMinWidth: size === "xs" || size === "sm",
    });

    test("round md returns inner rounded-sm + full outer pseudo classes", () => {
      const classes = getConnectedRadiusClasses(makeCtx("md", "round"));
      expect(classes).toContain("rounded-sm");
      expect(classes).toContain("first:rounded-s-full");
      expect(classes).toContain("last:rounded-e-full");
    });

    test("round xs returns rounded-xs inner radius", () => {
      const classes = getConnectedRadiusClasses(makeCtx("xs", "round"));
      expect(classes).toContain("rounded-xs");
      expect(classes).toContain("first:rounded-s-full");
    });

    test("round lg returns rounded-lg inner radius", () => {
      const classes = getConnectedRadiusClasses(makeCtx("lg", "round"));
      expect(classes).toContain("rounded-lg");
    });

    test("round xl returns rounded-[20px] inner radius", () => {
      const classes = getConnectedRadiusClasses(makeCtx("xl", "round"));
      expect(classes).toContain("rounded-[20px]");
      expect(classes).toContain("first:rounded-s-full");
    });

    test("square md returns inner rounded-sm + square outer pseudo classes", () => {
      const classes = getConnectedRadiusClasses(makeCtx("md", "square"));
      expect(classes).toContain("rounded-sm");
      expect(classes).toContain("first:rounded-s-sm");
      expect(classes).toContain("last:rounded-e-sm");
    });

    test("square xl returns rounded-[20px] for both inner and outer", () => {
      const classes = getConnectedRadiusClasses(makeCtx("xl", "square"));
      expect(classes).toContain("rounded-[20px]");
      expect(classes).toContain("first:rounded-s-[20px]");
      expect(classes).toContain("last:rounded-e-[20px]");
    });
  });
});

// ---------------------------------------------------------------------------
// 7. Enhanced ButtonGroupContextValue fields
// ---------------------------------------------------------------------------

describe("ButtonGroupHeadless enhanced context", () => {
  const ContextCapture = (): React.ReactElement => {
    const ctx = useButtonGroup();
    return (
      <div
        data-inner={ctx.connectedInnerRadius}
        data-outer={ctx.connectedOuterRadius}
        data-min-width={String(ctx.enforceMinWidth)}
      />
    );
  };

  test("provides connectedInnerRadius = rounded-sm for connected md", () => {
    render(
      <ButtonGroupHeadless variant="connected" size="md" shape="round">
        <ContextCapture />
      </ButtonGroupHeadless>
    );
    expect(screen.getByTestId ? document.querySelector("[data-inner]") : null).toBeTruthy();
    const el = document.querySelector("[data-inner]");
    expect(el?.getAttribute("data-inner")).toBe("rounded-sm");
  });

  test("provides connectedOuterRadius = rounded-full for round shape", () => {
    render(
      <ButtonGroupHeadless variant="connected" size="md" shape="round">
        <ContextCapture />
      </ButtonGroupHeadless>
    );
    const el = document.querySelector("[data-outer]");
    expect(el?.getAttribute("data-outer")).toBe("rounded-full");
  });

  test("provides connectedOuterRadius = rounded-sm for square md", () => {
    render(
      <ButtonGroupHeadless variant="connected" size="md" shape="square">
        <ContextCapture />
      </ButtonGroupHeadless>
    );
    const el = document.querySelector("[data-outer]");
    expect(el?.getAttribute("data-outer")).toBe("rounded-sm");
  });

  test("enforceMinWidth = true for connected xs", () => {
    render(
      <ButtonGroupHeadless variant="connected" size="xs">
        <ContextCapture />
      </ButtonGroupHeadless>
    );
    const el = document.querySelector("[data-min-width]");
    expect(el?.getAttribute("data-min-width")).toBe("true");
  });

  test("enforceMinWidth = true for connected sm", () => {
    render(
      <ButtonGroupHeadless variant="connected" size="sm">
        <ContextCapture />
      </ButtonGroupHeadless>
    );
    const el = document.querySelector("[data-min-width]");
    expect(el?.getAttribute("data-min-width")).toBe("true");
  });

  test("enforceMinWidth = false for connected md", () => {
    render(
      <ButtonGroupHeadless variant="connected" size="md">
        <ContextCapture />
      </ButtonGroupHeadless>
    );
    const el = document.querySelector("[data-min-width]");
    expect(el?.getAttribute("data-min-width")).toBe("false");
  });

  test("enforceMinWidth = false for standard variant regardless of size", () => {
    render(
      <ButtonGroupHeadless variant="standard" size="xs">
        <ContextCapture />
      </ButtonGroupHeadless>
    );
    const el = document.querySelector("[data-min-width]");
    expect(el?.getAttribute("data-min-width")).toBe("false");
  });
});

// ---------------------------------------------------------------------------
// 8. Dev warnings — connected without toggles & connected mixed colors
// ---------------------------------------------------------------------------

describe("ButtonGroup dev warnings (DOM-based)", () => {
  beforeEach(() => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.stubEnv("NODE_ENV", "development");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  test("warns when connected group has no aria-pressed children", async () => {
    render(
      <ButtonGroup variant="connected" aria-label="Actions">
        <button>One</button>
        <button>Two</button>
      </ButtonGroup>
    );
    await waitFor(() => {
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining("connected"),
        expect.stringContaining("aria-pressed")
      );
    });
  });

  test("does NOT warn for connected group when children have aria-pressed", async () => {
    render(
      <ButtonGroup variant="connected" aria-label="Toggle">
        <button aria-pressed="false">One</button>
        <button aria-pressed="true">Two</button>
      </ButtonGroup>
    );
    await waitFor(() => {});
    const calls = (console.warn as ReturnType<typeof vi.fn>).mock.calls;
    const connectedWarning = calls.find(
      (args) =>
        typeof args[0] === "string" &&
        args[0].includes("connected") &&
        String(args[1]).includes("aria-pressed")
    );
    expect(connectedWarning).toBeUndefined();
  });

  test("does NOT warn for standard group without aria-pressed children", async () => {
    render(
      <ButtonGroup variant="standard" aria-label="Actions">
        <button>One</button>
        <button>Two</button>
      </ButtonGroup>
    );
    await waitFor(() => {});
    const calls = (console.warn as ReturnType<typeof vi.fn>).mock.calls;
    const connectedWarning = calls.find(
      (args) =>
        typeof args[0] === "string" &&
        args[0].includes("connected") &&
        String(args[1]).includes("aria-pressed")
    );
    expect(connectedWarning).toBeUndefined();
  });

  test("warns when connected group has mixed data-color children", async () => {
    render(
      <ButtonGroup variant="connected" aria-label="Formatting">
        <button aria-pressed="false" data-color="primary">
          Bold
        </button>
        <button aria-pressed="false" data-color="secondary">
          Italic
        </button>
      </ButtonGroup>
    );
    await waitFor(() => {
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining("color"),
        expect.stringContaining("data-color")
      );
    });
  });

  test("does NOT warn for connected group with uniform data-color", async () => {
    render(
      <ButtonGroup variant="connected" aria-label="Formatting">
        <button aria-pressed="false" data-color="primary">
          Bold
        </button>
        <button aria-pressed="false" data-color="primary">
          Italic
        </button>
      </ButtonGroup>
    );
    await waitFor(() => {});
    const calls = (console.warn as ReturnType<typeof vi.fn>).mock.calls;
    const colorWarning = calls.find(
      (args) =>
        typeof args[0] === "string" &&
        args[0].includes("color") &&
        String(args[1]).includes("data-color")
    );
    expect(colorWarning).toBeUndefined();
  });
});
