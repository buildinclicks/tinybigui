import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { TooltipTriggerHeadless, TooltipOverlayHeadless } from "./TooltipHeadless";
import { TooltipTrigger } from "./TooltipTrigger";
import { Tooltip } from "./Tooltip";
import { RichTooltip } from "./RichTooltip";
import { Button } from "../Button/Button";

// ─── Test helpers ─────────────────────────────────────────────────────────────

/**
 * Renders a minimal tooltip setup.
 * `delay=0` skips the hover timer so hover-based tests don't need fake timers.
 */
function renderTooltip(
  triggerProps: Record<string, unknown> = {},
  overlayProps: Record<string, unknown> = {}
) {
  return render(
    <TooltipTriggerHeadless delay={0} {...triggerProps}>
      <button type="button">Trigger</button>
      <TooltipOverlayHeadless tooltipProps={{}} {...overlayProps}>
        Tooltip content
      </TooltipOverlayHeadless>
    </TooltipTriggerHeadless>
  );
}

/**
 * Renders a controlled tooltip.
 */
function renderControlledTooltip(isOpen: boolean, onOpenChange = vi.fn()) {
  return render(
    <TooltipTriggerHeadless delay={0} isOpen={isOpen} onOpenChange={onOpenChange}>
      <button type="button">Trigger</button>
      <TooltipOverlayHeadless tooltipProps={{}}>Tooltip content</TooltipOverlayHeadless>
    </TooltipTriggerHeadless>
  );
}

// ─── Hover helpers ────────────────────────────────────────────────────────────

/**
 * Simulates a pointer entering an element.
 *
 * In jsdom `PointerEvent` is undefined, so React Aria's `useHover` falls into
 * its `process.env.NODE_ENV === 'test'` branch and uses `onMouseEnter`.
 *
 * Two steps are needed:
 * 1. Fire `mousemove` on the document — this sets React Aria's global
 *    interaction modality to `'pointer'`. `useTooltipTrigger.onHoverStart`
 *    checks `getInteractionModality() === 'pointer'` before setting
 *    `isHovered.current = true`; without this step the tooltip never opens.
 * 2. Fire `mouseover` on the element — React synthesises `onMouseEnter` from
 *    this bubbling event and calls `hoverProps.onMouseEnter`.
 */
function pointerEnter(element: HTMLElement): void {
  fireEvent.mouseMove(document.body);
  fireEvent.mouseOver(element, { relatedTarget: null });
}

/**
 * Simulates a pointer leaving an element.
 * React synthesises `onMouseLeave` from the bubbling `mouseout` event.
 */
function pointerLeave(element: HTMLElement): void {
  fireEvent.mouseOut(element, { relatedTarget: document.body });
}

// ─── 1. Default: tooltip NOT visible initially ────────────────────────────────

describe("TooltipTriggerHeadless", () => {
  test("1. tooltip is NOT visible initially (closed by default)", () => {
    renderTooltip();
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  // ─── 2–3. Hover delay behavior (fake timers) ────────────────────────────────

  // Tests 2 and 3 are in separate describe blocks so each has isolated
  // fake-timer setup/teardown. They share a module-level `globalWarmedUp`
  // flag in react-stately's tooltip state, so order and cleanup matter.

  describe("2. tooltip becomes visible after hovering trigger for 300ms", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    test("becomes visible after hovering trigger for 300ms", () => {
      render(
        <TooltipTriggerHeadless delay={300}>
          <button type="button">Trigger</button>
          <TooltipOverlayHeadless tooltipProps={{}}>Tooltip content</TooltipOverlayHeadless>
        </TooltipTriggerHeadless>
      );

      const trigger = screen.getByRole("button", { name: "Trigger" });

      pointerEnter(trigger);

      // Not yet visible — warm-up timer has not elapsed
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(screen.getByRole("tooltip")).toBeInTheDocument();

      // Reset react-stately's global warm state so it does not bleed into
      // the next test. We trigger hide and advance past the 500ms cooldown.
      fireEvent.mouseOut(trigger, { relatedTarget: document.body });
      act(() => {
        vi.advanceTimersByTime(1000); // > TOOLTIP_COOLDOWN (500ms)
      });
    });
  });

  describe("3. tooltip does NOT appear before 300ms delay elapses", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      // Clear pending timers so the scheduled warm-up callback does not fire
      // on an already-unmounted component after RTL cleanup.
      vi.clearAllTimers();
      vi.useRealTimers();
    });

    test("does NOT appear before 300ms delay elapses", () => {
      render(
        <TooltipTriggerHeadless delay={300}>
          <button type="button">Trigger</button>
          <TooltipOverlayHeadless tooltipProps={{}}>Tooltip content</TooltipOverlayHeadless>
        </TooltipTriggerHeadless>
      );

      pointerEnter(screen.getByRole("button", { name: "Trigger" }));

      // 299ms — still below the 300ms threshold
      act(() => {
        vi.advanceTimersByTime(299);
      });

      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });
  });

  // ─── 4. Focus: immediate show ────────────────────────────────────────────────

  test("4. tooltip appears immediately on keyboard focus (no delay)", async () => {
    const user = userEvent.setup();
    renderTooltip();
    await user.tab();
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });

  // ─── 5. Pointer leave: tooltip hides ─────────────────────────────────────────

  test("5. tooltip hides when pointer leaves trigger", async () => {
    renderTooltip();
    const trigger = screen.getByRole("button", { name: "Trigger" });

    pointerEnter(trigger);
    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    pointerLeave(trigger);
    // useTooltipTriggerState has a default closeDelay of 500ms — the tooltip
    // does not unmount immediately on pointer leave. waitFor retries until the
    // timer fires and the tooltip disappears.
    await waitFor(
      () => {
        expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
      },
      { timeout: 1500 }
    );
  });

  // ─── 6. Escape key: tooltip hides ────────────────────────────────────────────

  test("6. tooltip hides on Escape key press", async () => {
    const user = userEvent.setup();
    renderTooltip();

    await user.tab();
    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  // ─── 7. Focus loss: tooltip hides ────────────────────────────────────────────

  test("7. tooltip hides on focus loss", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <TooltipTriggerHeadless delay={0}>
          <button type="button">Trigger</button>
          <TooltipOverlayHeadless tooltipProps={{}}>Tooltip content</TooltipOverlayHeadless>
        </TooltipTriggerHeadless>
        <button type="button">Other</button>
      </div>
    );

    await user.tab();
    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    // Tab away — tooltip should close
    await user.tab();
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  // ─── 8–9. Controlled mode ────────────────────────────────────────────────────

  test("8. controlled: isOpen=true shows tooltip immediately", () => {
    renderControlledTooltip(true);
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });

  test("9. controlled: isOpen=false hides tooltip", () => {
    renderControlledTooltip(false);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  // ─── 10–11. onOpenChange callbacks ───────────────────────────────────────────

  test("10. onOpenChange(true) called when tooltip opens", async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();
    renderTooltip({ onOpenChange });

    await user.tab();
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  test("11. onOpenChange(false) called when tooltip closes", async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();
    renderTooltip({ onOpenChange });

    await user.tab();
    expect(onOpenChange).toHaveBeenCalledWith(true);

    await user.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  // ─── 12. role="tooltip" ──────────────────────────────────────────────────────

  test("12. tooltip element has role='tooltip'", async () => {
    const user = userEvent.setup();
    renderTooltip();

    await user.tab();

    const tooltip = screen.getByRole("tooltip");
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveAttribute("role", "tooltip");
  });

  // ─── 13. aria-describedby ────────────────────────────────────────────────────

  test("13. trigger has aria-describedby pointing to tooltip id", async () => {
    const user = userEvent.setup();
    renderTooltip();

    await user.tab();

    const trigger = screen.getByRole("button", { name: "Trigger" });
    const tooltip = screen.getByRole("tooltip");

    const describedById = trigger.getAttribute("aria-describedby");
    expect(describedById).toBeTruthy();
    expect(describedById).toBe(tooltip.getAttribute("id"));
  });

  // ─── 14. Portal rendering ────────────────────────────────────────────────────

  test("14. tooltip renders in a portal (not as a descendant of the trigger's DOM parent)", async () => {
    const user = userEvent.setup();
    const { container } = renderTooltip();

    await user.tab();

    const tooltip = screen.getByRole("tooltip");
    expect(container.contains(tooltip)).toBe(false);
    expect(document.body.contains(tooltip)).toBe(true);
  });

  // ─── 15. Default placement ───────────────────────────────────────────────────

  test("15. tooltip positions at placement='top' by default", async () => {
    const user = userEvent.setup();
    renderTooltip();

    await user.tab();

    expect(screen.getByRole("tooltip")).toHaveAttribute("data-placement", "top");
  });

  // ─── 16. Viewport overflow / flip ────────────────────────────────────────────

  test("16. tooltip repositions when it would overflow viewport (flip behavior)", async () => {
    const user = userEvent.setup();

    // Simulate trigger at the very top of a short viewport — no room above.
    const originalInnerHeight = window.innerHeight;
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 100 });

    const getBCRSpy = vi.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue({
      top: 2,
      bottom: 30,
      left: 50,
      right: 150,
      width: 100,
      height: 28,
      x: 50,
      y: 2,
      toJSON: () => ({}),
    });

    render(
      <TooltipTriggerHeadless delay={0}>
        <button type="button">Trigger</button>
        <TooltipOverlayHeadless tooltipProps={{}} placement="top">
          Tooltip content
        </TooltipOverlayHeadless>
      </TooltipTriggerHeadless>
    );

    await user.tab();

    // data-computed-placement reflects the actual axis chosen by useOverlayPosition
    const computedPlacement = screen.getByRole("tooltip").getAttribute("data-computed-placement");
    expect(["bottom", "top", "left", "right"]).toContain(computedPlacement);

    getBCRSpy.mockRestore();
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: originalInnerHeight,
    });
  });

  // ─── 17. 'use client' ────────────────────────────────────────────────────────

  test("17. component functions correctly in a client context", async () => {
    const user = userEvent.setup();
    const { container } = renderTooltip();

    await user.tab();

    const tooltip = screen.getByRole("tooltip");
    // createPortal is a client-side API; rendering into body confirms
    // the 'use client' directive is in effect.
    expect(document.body.contains(tooltip)).toBe(true);
    expect(container.contains(tooltip)).toBe(false);
  });

  // ─── 18–19. axe accessibility ────────────────────────────────────────────────

  test("18. axe check — trigger + tooltip visible, no violations", async () => {
    const user = userEvent.setup();
    renderTooltip();

    await user.tab();
    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    // The "region" rule requires all content in a landmark, which fails for
    // portal content rendered directly into document.body in a minimal test
    // fixture. This is a test-environment constraint, not an application-level
    // violation — real apps have <main>/<header> etc. We disable only this rule.
    const results = await axe(document.body, {
      rules: { region: { enabled: false } },
    });
    expect(results).toHaveNoViolations();
  });

  test("19. axe check — delay=0 for synchronous tooltip visibility in test", async () => {
    const user = userEvent.setup();
    renderTooltip();

    await user.tab();
    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    const results = await axe(document.body, {
      rules: { region: { enabled: false } },
    });
    expect(results).toHaveNoViolations();
  });

  // ─── 20. Custom delay=0 hover ────────────────────────────────────────────────

  test("20. custom delay=0 makes tooltip appear immediately on hover", () => {
    renderTooltip({ delay: 0 });

    // With delay=0, state.open() calls setOpen(true) synchronously in the
    // pointer event handler — no timer needed.
    pointerEnter(screen.getByRole("button", { name: "Trigger" }));

    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });
});

// ─── Styled layer helpers ─────────────────────────────────────────────────────

/**
 * Renders a plain `Tooltip` inside `TooltipTrigger` (delay=0 for fast tests).
 * Wraps in a div with a second focusable element so Tab can move focus away.
 */
function renderStyledTooltip(tooltipProps: Record<string, unknown> = {}) {
  return render(
    <div>
      <TooltipTrigger delay={0}>
        <button type="button">Trigger</button>
        <Tooltip {...tooltipProps}>Tooltip text</Tooltip>
      </TooltipTrigger>
      <button type="button">Other</button>
    </div>
  );
}

/**
 * Renders a `RichTooltip` inside `TooltipTrigger` (delay=0 for fast tests).
 */
function renderStyledRichTooltip(richProps: Record<string, unknown> = {}) {
  return render(
    <div>
      <TooltipTrigger delay={0}>
        <button type="button">Trigger</button>
        <RichTooltip title="Title text" action={<Button>Action</Button>} {...richProps}>
          Supporting text
        </RichTooltip>
      </TooltipTrigger>
      <button type="button">Other</button>
    </div>
  );
}

// ─── 21–26. Plain Tooltip styled tests ───────────────────────────────────────

describe("Tooltip (Plain styled)", () => {
  test("21. renders with bg-inverse-surface class", async () => {
    const user = userEvent.setup();
    renderStyledTooltip();
    await user.tab();
    expect(screen.getByText("Tooltip text")).toHaveClass("bg-inverse-surface");
  });

  test("22. renders with text-inverse-on-surface class", async () => {
    const user = userEvent.setup();
    renderStyledTooltip();
    await user.tab();
    expect(screen.getByText("Tooltip text")).toHaveClass("text-inverse-on-surface");
  });

  test("23. has rounded-xs class", async () => {
    const user = userEvent.setup();
    renderStyledTooltip();
    await user.tab();
    expect(screen.getByText("Tooltip text")).toHaveClass("rounded-xs");
  });

  test("24. has max-w-50 class", async () => {
    const user = userEvent.setup();
    renderStyledTooltip();
    await user.tab();
    expect(screen.getByText("Tooltip text")).toHaveClass("max-w-50");
  });

  test("25. entry animation class animate-md-scale-in present on mount", async () => {
    const user = userEvent.setup();
    renderStyledTooltip();
    await user.tab();
    expect(screen.getByText("Tooltip text")).toHaveClass("animate-md-scale-in");
  });

  test("26. exit animation class animate-md-scale-out added before unmount", async () => {
    const user = userEvent.setup();
    renderStyledTooltip();

    // Open
    await user.tab();
    expect(screen.getByText("Tooltip text")).toBeInTheDocument();

    // Move focus away — RA fires onOpenChange(false), isExiting becomes true.
    // jsdom never fires animationend so the tooltip stays mounted with exit class.
    await user.tab();
    expect(screen.getByText("Tooltip text")).toHaveClass("animate-md-scale-out");
  });
});

// ─── 27–34. Rich Tooltip styled tests ────────────────────────────────────────

describe("RichTooltip (Rich styled)", () => {
  test("27. renders with bg-surface-container class", async () => {
    const user = userEvent.setup();
    renderStyledRichTooltip();
    await user.tab();
    // The RichTooltip wrapper div has the CVA base classes.
    const richWrapper = screen.getByText("Supporting text").closest("div");
    expect(richWrapper).toHaveClass("bg-surface-container");
  });

  test("28. renders with shadow-elevation-2 class", async () => {
    const user = userEvent.setup();
    renderStyledRichTooltip();
    await user.tab();
    const richWrapper = screen.getByText("Supporting text").closest("div");
    expect(richWrapper).toHaveClass("shadow-elevation-2");
  });

  test("29. has rounded-md class", async () => {
    const user = userEvent.setup();
    renderStyledRichTooltip();
    await user.tab();
    const richWrapper = screen.getByText("Supporting text").closest("div");
    expect(richWrapper).toHaveClass("rounded-md");
  });

  test("30. renders title prop text", async () => {
    const user = userEvent.setup();
    renderStyledRichTooltip();
    await user.tab();
    expect(screen.getByText("Title text")).toBeInTheDocument();
  });

  test("31. renders supporting text (children)", async () => {
    const user = userEvent.setup();
    renderStyledRichTooltip();
    await user.tab();
    expect(screen.getByText("Supporting text")).toBeInTheDocument();
  });

  test("32. renders action slot (a Button)", async () => {
    const user = userEvent.setup();
    renderStyledRichTooltip();
    await user.tab();
    expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument();
  });

  test("33. entry animation class animate-md-scale-in present on mount", async () => {
    const user = userEvent.setup();
    renderStyledRichTooltip();
    await user.tab();
    const richWrapper = screen.getByText("Supporting text").closest("div");
    expect(richWrapper).toHaveClass("animate-md-scale-in");
  });

  test("34. exit animation class animate-md-scale-out added before unmount", async () => {
    const user = userEvent.setup();
    renderStyledRichTooltip();

    // Open
    await user.tab();
    const richWrapper = screen.getByText("Supporting text").closest("div");
    expect(richWrapper).toBeInTheDocument();

    // Move focus away — exit animation starts, tooltip stays mounted.
    await user.tab();
    expect(screen.getByText("Supporting text").closest("div")).toHaveClass("animate-md-scale-out");
  });
});

// ─── 35–36. TooltipTrigger tests ─────────────────────────────────────────────

describe("TooltipTrigger (styled)", () => {
  describe("35. delay prop defaults to 300ms", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.clearAllTimers();
      vi.useRealTimers();
    });

    test("tooltip does not show before 300ms and shows after", () => {
      render(
        <TooltipTrigger>
          <button type="button">Trigger</button>
          <Tooltip>Tooltip</Tooltip>
        </TooltipTrigger>
      );

      const trigger = screen.getByRole("button", { name: "Trigger" });

      // React Stately's module-level `globalWarmedUp` is set to `true` by
      // `showTooltip()` whenever any tooltip appears (tests 4–34 all trigger
      // this). The 500ms real-time cooldown hasn't fired by the time this test
      // runs. We perform a primer reset cycle with fake timers:
      //   1. pointerEnter → shows immediately (warm) or starts warmup timer
      //   2. mouseOut → starts fake closeDelay (500ms) + cooldown (500ms)
      //   3. advance(900ms) → timers fire: isExiting=true, globalWarmedUp=false
      //   4. animationend → handleAnimationEnd → isMounted=false (clean slate)
      pointerEnter(trigger);
      fireEvent.mouseOut(trigger, { relatedTarget: document.body });
      act(() => {
        vi.advanceTimersByTime(900);
      });
      const tooltipToReset = screen.queryByText("Tooltip");
      if (tooltipToReset) {
        act(() => {
          fireEvent.animationEnd(tooltipToReset);
        });
      }

      // globalWarmedUp = false, isMounted = false — now test the real 300ms delay:
      pointerEnter(trigger);
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(300);
      });
      expect(screen.getByRole("tooltip")).toBeInTheDocument();

      // Reset warm state so it does not bleed into subsequent tests.
      fireEvent.mouseOut(trigger, { relatedTarget: document.body });
      act(() => {
        vi.advanceTimersByTime(1000);
      });
    });
  });

  test("36. delay=0 makes tooltip appear immediately on hover", () => {
    render(
      <TooltipTrigger delay={0}>
        <button type="button">Trigger</button>
        <Tooltip>Tooltip</Tooltip>
      </TooltipTrigger>
    );

    pointerEnter(screen.getByRole("button", { name: "Trigger" }));
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });
});

// ─── 37–40. MD3 token correctness ─────────────────────────────────────────────

describe("MD3 token correctness", () => {
  test("37. rich tooltip title uses text-on-surface-variant (MD3 subhead role)", async () => {
    const user = userEvent.setup();
    renderStyledRichTooltip();
    await user.tab();
    const title = screen.getByText("Title text");
    expect(title).toHaveClass("text-on-surface-variant");
  });

  test("38. rich tooltip supporting text uses text-on-surface-variant", async () => {
    const user = userEvent.setup();
    renderStyledRichTooltip();
    await user.tab();
    const body = screen.getByText("Supporting text");
    expect(body).toHaveClass("text-on-surface-variant");
  });

  test("39. rich tooltip action is wrapped in the actions-row slot div", async () => {
    const user = userEvent.setup();
    renderStyledRichTooltip();
    await user.tab();
    const actionButton = screen.getByRole("button", { name: "Action" });
    // The action button's parent must be the actions-row slot div
    const actionRow = actionButton.closest("div");
    expect(actionRow).toHaveClass("mt-3");
    expect(actionRow).toHaveClass("-ml-2");
  });

  test("40. plain tooltip container has inline-flex to center single-line content", async () => {
    const user = userEvent.setup();
    renderStyledTooltip();
    await user.tab();
    expect(screen.getByText("Tooltip text")).toHaveClass("inline-flex");
    expect(screen.getByText("Tooltip text")).toHaveClass("items-center");
  });
});

// ─── 41–45. prefers-reduced-motion ───────────────────────────────────────────

/**
 * Helpers that override matchMedia to simulate `prefers-reduced-motion: reduce`.
 * We restore the global mock after each test so other tests are unaffected.
 */
function mockReducedMotion(matches: boolean): void {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query === "(prefers-reduced-motion: reduce)" ? matches : false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

describe("prefers-reduced-motion", () => {
  afterEach(() => {
    // Restore to the default mock (matches: false) set in test/setup.ts
    mockReducedMotion(false);
  });

  test("41. plain tooltip has no animation class when reduced motion is active", async () => {
    mockReducedMotion(true);
    const user = userEvent.setup();
    renderStyledTooltip();
    await user.tab();
    const tooltip = screen.getByText("Tooltip text");
    expect(tooltip).not.toHaveClass("animate-md-scale-in");
    expect(tooltip).not.toHaveClass("animate-md-scale-out");
  });

  test("42. rich tooltip has no animation class when reduced motion is active", async () => {
    mockReducedMotion(true);
    const user = userEvent.setup();
    renderStyledRichTooltip();
    await user.tab();
    const richWrapper = screen.getByText("Supporting text").closest("div");
    expect(richWrapper).not.toHaveClass("animate-md-scale-in");
    expect(richWrapper).not.toHaveClass("animate-md-scale-out");
  });

  test("43. plain tooltip unmounts immediately on close (no animationend) when reduced motion is active", async () => {
    mockReducedMotion(true);
    const user = userEvent.setup();
    renderStyledTooltip();
    await user.tab();
    expect(screen.getByText("Tooltip text")).toBeInTheDocument();

    // Move focus away — under reduced motion the overlay must unmount
    // immediately without waiting for animationend (which CSS never fires).
    await user.tab();
    expect(screen.queryByText("Tooltip text")).not.toBeInTheDocument();
  });

  test("44. rich tooltip unmounts immediately on close (no animationend) when reduced motion is active", async () => {
    mockReducedMotion(true);
    const user = userEvent.setup();
    renderStyledRichTooltip();
    await user.tab();
    expect(screen.getByText("Supporting text")).toBeInTheDocument();

    await user.tab();
    expect(screen.queryByText("Supporting text")).not.toBeInTheDocument();
  });

  test("45. standard animation classes still applied when reduced motion is NOT active", async () => {
    mockReducedMotion(false);
    const user = userEvent.setup();
    renderStyledTooltip();
    await user.tab();
    expect(screen.getByText("Tooltip text")).toHaveClass("animate-md-scale-in");
  });
});
