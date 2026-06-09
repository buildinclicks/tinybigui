import { describe, test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { ChipHeadless } from "./ChipHeadless";
import { Chip } from "./Chip";
import { ChipSet } from "./ChipSet";

// ---------------------------------------------------------------------------
// Assist chip (type="assist")
// ---------------------------------------------------------------------------

describe("ChipHeadless — Assist", () => {
  test("1. renders with role=button", () => {
    render(<ChipHeadless type="assist" label="Set alarm" />);
    expect(screen.getByRole("button", { name: "Set alarm" })).toBeInTheDocument();
  });

  test("2. calls onPress on click", async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    render(<ChipHeadless type="assist" label="Set alarm" onPress={onPress} />);
    await user.click(screen.getByRole("button", { name: "Set alarm" }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test("3. calls onPress on Enter key", async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    render(<ChipHeadless type="assist" label="Set alarm" onPress={onPress} />);
    screen.getByRole("button", { name: "Set alarm" }).focus();
    await user.keyboard("{Enter}");
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test("4. calls onPress on Space key", async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    render(<ChipHeadless type="assist" label="Set alarm" onPress={onPress} />);
    screen.getByRole("button", { name: "Set alarm" }).focus();
    await user.keyboard(" ");
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test("5. does NOT call onPress when isDisabled", async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    render(<ChipHeadless type="assist" label="Set alarm" onPress={onPress} isDisabled />);
    await user.click(screen.getByRole("button", { name: "Set alarm" }));
    expect(onPress).not.toHaveBeenCalled();
  });

  test("6. isDisabled disables the button (native disabled or aria-disabled)", () => {
    render(<ChipHeadless type="assist" label="Set alarm" isDisabled />);
    const button = screen.getByRole("button", { name: "Set alarm" });
    expect(button).toBeDisabled();
  });
});

// ---------------------------------------------------------------------------
// Filter chip (type="filter")
// ---------------------------------------------------------------------------

describe("ChipHeadless — Filter", () => {
  test("7. renders with role=button and aria-pressed=false initially", () => {
    render(<ChipHeadless type="filter" label="Vegetarian" />);
    const button = screen.getByRole("button", { name: "Vegetarian" });
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  test("8. toggles aria-pressed to true on click", async () => {
    const user = userEvent.setup();
    render(<ChipHeadless type="filter" label="Vegetarian" />);
    const button = screen.getByRole("button", { name: "Vegetarian" });
    await user.click(button);
    expect(button).toHaveAttribute("aria-pressed", "true");
  });

  test("9. calls onSelectionChange(true) on first click", async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(<ChipHeadless type="filter" label="Vegetarian" onSelectionChange={onSelectionChange} />);
    await user.click(screen.getByRole("button", { name: "Vegetarian" }));
    expect(onSelectionChange).toHaveBeenCalledWith(true);
  });

  test("10. calls onSelectionChange(false) on second click", async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(<ChipHeadless type="filter" label="Vegetarian" onSelectionChange={onSelectionChange} />);
    const button = screen.getByRole("button", { name: "Vegetarian" });
    await user.click(button);
    await user.click(button);
    expect(onSelectionChange).toHaveBeenNthCalledWith(1, true);
    expect(onSelectionChange).toHaveBeenNthCalledWith(2, false);
  });

  test("11. respects controlled selected prop", () => {
    render(<ChipHeadless type="filter" label="Vegetarian" selected />);
    const button = screen.getByRole("button", { name: "Vegetarian" });
    expect(button).toHaveAttribute("aria-pressed", "true");
  });
});

// ---------------------------------------------------------------------------
// Input chip (type="input")
// ---------------------------------------------------------------------------

describe("ChipHeadless — Input", () => {
  test("12. renders with aria-label equal to label prop", () => {
    render(<ChipHeadless type="input" label="React" onRemove={vi.fn()} />);
    expect(screen.getByRole("button", { name: "React" })).toBeInTheDocument();
  });

  test("13. renders remove button with aria-label='Remove [label]'", () => {
    render(<ChipHeadless type="input" label="React" onRemove={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Remove React" })).toBeInTheDocument();
  });

  test("14. calls onRemove when remove button is clicked", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(<ChipHeadless type="input" label="React" onRemove={onRemove} />);
    await user.click(screen.getByRole("button", { name: "Remove React" }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  test("15. calls onRemove on Backspace key while chip is focused", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(<ChipHeadless type="input" label="React" onRemove={onRemove} />);
    screen.getByRole("button", { name: "React" }).focus();
    await user.keyboard("{Backspace}");
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  test("16. calls onRemove on Delete key while chip is focused", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(<ChipHeadless type="input" label="React" onRemove={onRemove} />);
    screen.getByRole("button", { name: "React" }).focus();
    await user.keyboard("{Delete}");
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  test("17. remove button Enter/Space also triggers onRemove", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(<ChipHeadless type="input" label="React" onRemove={onRemove} />);
    const removeButton = screen.getByRole("button", { name: "Remove React" });
    removeButton.focus();
    await user.keyboard("{Enter}");
    await user.keyboard(" ");
    expect(onRemove).toHaveBeenCalledTimes(2);
  });
});

// ---------------------------------------------------------------------------
// Suggestion chip (type="suggestion")
// ---------------------------------------------------------------------------

describe("ChipHeadless — Suggestion", () => {
  test("18. renders with role=button", () => {
    render(<ChipHeadless type="suggestion" label="See photos" />);
    expect(screen.getByRole("button", { name: "See photos" })).toBeInTheDocument();
  });

  test("19. calls onPress on click", async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    render(<ChipHeadless type="suggestion" label="See photos" onPress={onPress} />);
    await user.click(screen.getByRole("button", { name: "See photos" }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

// ---------------------------------------------------------------------------
// General
// ---------------------------------------------------------------------------

describe("ChipHeadless — General", () => {
  test("20. forwardRef: ref correctly attached to root button element", () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(<ChipHeadless type="assist" label="Set alarm" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  test("21. axe check — assist chip, no violations", async () => {
    const { container } = render(<ChipHeadless type="assist" label="Set alarm" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("22. axe check — filter chip (unselected), no violations", async () => {
    const { container } = render(<ChipHeadless type="filter" label="Vegetarian" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("23. axe check — filter chip (selected), no violations", async () => {
    const { container } = render(<ChipHeadless type="filter" label="Vegetarian" selected />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("24. axe check — input chip, no violations", async () => {
    const { container } = render(<ChipHeadless type="input" label="React" onRemove={vi.fn()} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("25. axe check — disabled chip, no violations", async () => {
    const { container } = render(<ChipHeadless type="assist" label="Set alarm" isDisabled />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ---------------------------------------------------------------------------
// Chip (Styled) — base shape and layout classes
// ---------------------------------------------------------------------------

describe("Chip — base shape and layout classes", () => {
  test("26. applies h-8, rounded-sm, text-label-large", () => {
    render(<Chip type="assist" label="Help" />);
    const chip = screen.getByRole("button", { name: "Help" });
    expect(chip).toHaveClass("h-8");
    expect(chip).toHaveClass("rounded-sm");
    expect(chip).toHaveClass("text-label-large");
  });

  test("27. applies group/chip class on root", () => {
    render(<Chip type="assist" label="Help" />);
    const chip = screen.getByRole("button", { name: "Help" });
    expect(chip).toHaveClass("group/chip");
  });

  test("28. base padding px-4 with no icons", () => {
    render(<Chip type="assist" label="Help" />);
    const chip = screen.getByRole("button", { name: "Help" });
    expect(chip).toHaveClass("px-4");
  });
});

// ---------------------------------------------------------------------------
// Chip — MD3 per-type flat surface color tokens
// ---------------------------------------------------------------------------

describe("Chip — MD3 per-type color tokens (flat surface)", () => {
  test("29. assist: transparent bg + border-outline + text-on-surface", () => {
    render(<Chip type="assist" label="Help" />);
    const chip = screen.getByRole("button", { name: "Help" });
    expect(chip).toHaveClass("bg-transparent");
    expect(chip).toHaveClass("border-outline");
    expect(chip).toHaveClass("text-on-surface");
  });

  test("30. filter (unselected): transparent + border-outline + text-on-surface-variant", () => {
    render(<Chip type="filter" label="Veg" />);
    const chip = screen.getByRole("button", { name: "Veg" });
    expect(chip).toHaveClass("bg-transparent");
    expect(chip).toHaveClass("border-outline");
    expect(chip).toHaveClass("text-on-surface-variant");
  });

  test("31. filter (selected): bg-secondary-container via group-data selector", () => {
    render(<Chip type="filter" label="Veg" selected />);
    // The group-data selector is a CSS class string — verify it is in the class list
    const chip = screen.getByRole("button", { name: "Veg" });
    // CSS classes for the selected state are group-data selectors applied as Tailwind classes
    expect(chip.className).toContain("group-data-[selected]/chip:bg-secondary-container");
  });

  test("32. input: transparent + border-outline-variant + text-on-surface-variant", () => {
    const { container } = render(<Chip type="input" label="React" onRemove={vi.fn()} />);
    const chipRoot = container.firstChild as HTMLElement;
    expect(chipRoot).toHaveClass("bg-transparent");
    expect(chipRoot).toHaveClass("border-outline-variant");
    expect(chipRoot).toHaveClass("text-on-surface-variant");
  });

  test("33. suggestion: transparent + border-outline + text-on-surface-variant", () => {
    render(<Chip type="suggestion" label="See photos" />);
    const chip = screen.getByRole("button", { name: "See photos" });
    expect(chip).toHaveClass("bg-transparent");
    expect(chip).toHaveClass("border-outline");
    expect(chip).toHaveClass("text-on-surface-variant");
  });
});

// ---------------------------------------------------------------------------
// Chip — Elevated surface
// ---------------------------------------------------------------------------

describe("Chip — Elevated surface", () => {
  test("34. elevated assist: bg-surface-container-low, border-0, shadow-elevation-1", () => {
    render(<Chip type="assist" surface="elevated" label="Help" />);
    const chip = screen.getByRole("button", { name: "Help" });
    expect(chip).toHaveClass("bg-surface-container-low");
    expect(chip).toHaveClass("shadow-elevation-1");
  });

  test("35. elevated filter: bg-surface-container-low + shadow-elevation-1", () => {
    render(<Chip type="filter" surface="elevated" label="Veg" />);
    const chip = screen.getByRole("button", { name: "Veg" });
    expect(chip).toHaveClass("bg-surface-container-low");
    expect(chip).toHaveClass("shadow-elevation-1");
  });

  test("36. elevated input: bg-surface-container-low + shadow-elevation-1", () => {
    const { container } = render(
      <Chip type="input" surface="elevated" label="React" onRemove={vi.fn()} />
    );
    const chipRoot = container.firstChild as HTMLElement;
    expect(chipRoot).toHaveClass("bg-surface-container-low");
    expect(chipRoot).toHaveClass("shadow-elevation-1");
  });

  test("37. elevated suggestion: bg-surface-container-low + shadow-elevation-1", () => {
    render(<Chip type="suggestion" surface="elevated" label="See photos" />);
    const chip = screen.getByRole("button", { name: "See photos" });
    expect(chip).toHaveClass("bg-surface-container-low");
    expect(chip).toHaveClass("shadow-elevation-1");
  });

  test("38. elevated chip has data-[hovered]:shadow-elevation-2 class", () => {
    render(<Chip type="assist" surface="elevated" label="Help" />);
    const chip = screen.getByRole("button", { name: "Help" });
    expect(chip.className).toContain("data-[hovered]:shadow-elevation-2");
  });
});

// ---------------------------------------------------------------------------
// Chip — Disabled state
// ---------------------------------------------------------------------------

describe("Chip — Disabled state", () => {
  test("39. disabled chip has data-[disabled] self-targeting classes", () => {
    render(<Chip type="assist" label="Help" isDisabled />);
    const chip = screen.getByRole("button", { name: "Help" });
    expect(chip.className).toContain("data-[disabled]:text-on-surface/38");
    expect(chip.className).toContain("data-[disabled]:border-on-surface/12");
  });

  test("40. disabled chip has data-disabled attribute set", () => {
    render(<Chip type="assist" label="Help" isDisabled />);
    const chip = screen.getByRole("button", { name: "Help" });
    expect(chip).toHaveAttribute("data-disabled", "");
  });

  test("41. disabled filter chip (selected) has data-[selected]:data-[disabled] class", () => {
    render(<Chip type="filter" label="Veg" selected isDisabled />);
    const chip = screen.getByRole("button", { name: "Veg" });
    expect(chip.className).toContain("data-[selected]:data-[disabled]:bg-on-surface/12");
  });
});

// ---------------------------------------------------------------------------
// Chip — State layer slot
// ---------------------------------------------------------------------------

describe("Chip — State layer slot", () => {
  test("42. state layer span is present in non-input chips", () => {
    const { container } = render(<Chip type="assist" label="Help" />);
    // State layer is an absolute span with group-data opacity classes
    const stateLayer = container.querySelector('span[aria-hidden="true"].absolute');
    expect(stateLayer).toBeInTheDocument();
  });

  test("43. state layer has group-data-[hovered] opacity class for correct type", () => {
    const { container } = render(<Chip type="assist" label="Help" />);
    const spans = Array.from(container.querySelectorAll('span[aria-hidden="true"]'));
    const stateLayer = spans.find((s) =>
      s.className.includes("group-data-[hovered]/chip:opacity-8")
    );
    expect(stateLayer).toBeInTheDocument();
  });

  test("44. state layer is hidden when disabled (group-data-[disabled]/chip:hidden)", () => {
    const { container } = render(<Chip type="assist" label="Help" />);
    const spans = Array.from(container.querySelectorAll('span[aria-hidden="true"]'));
    const stateLayer = spans.find((s) => s.className.includes("group-data-[disabled]/chip:hidden"));
    expect(stateLayer).toBeInTheDocument();
  });

  test("45. assist chip state layer color is bg-on-surface", () => {
    const { container } = render(<Chip type="assist" label="Help" />);
    const spans = Array.from(container.querySelectorAll('span[aria-hidden="true"]'));
    const stateLayer = spans.find((s) => s.className.includes("bg-on-surface"));
    expect(stateLayer).toBeInTheDocument();
  });

  test("46. filter chip state layer has group-data-[selected] secondary-container color", () => {
    const { container } = render(<Chip type="filter" label="Veg" />);
    const spans = Array.from(container.querySelectorAll('span[aria-hidden="true"]'));
    const stateLayer = spans.find((s) =>
      s.className.includes("group-data-[selected]/chip:bg-on-secondary-container")
    );
    expect(stateLayer).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Chip — Focus ring slot
// ---------------------------------------------------------------------------

describe("Chip — Focus ring slot", () => {
  test("47. focus ring span is present", () => {
    const { container } = render(<Chip type="assist" label="Help" />);
    const spans = Array.from(container.querySelectorAll('span[aria-hidden="true"]'));
    const focusRing = spans.find((s) => s.className.includes("outline-secondary"));
    expect(focusRing).toBeInTheDocument();
  });

  test("48. focus ring has inset-[-3px] for extension outside chip boundary", () => {
    const { container } = render(<Chip type="assist" label="Help" />);
    const spans = Array.from(container.querySelectorAll('span[aria-hidden="true"]'));
    const focusRing = spans.find((s) => s.className.includes("inset-[-3px]"));
    expect(focusRing).toBeInTheDocument();
  });

  test("49. focus ring has group-data-[focus-visible]/chip:opacity-100", () => {
    const { container } = render(<Chip type="assist" label="Help" />);
    const spans = Array.from(container.querySelectorAll('span[aria-hidden="true"]'));
    const focusRing = spans.find((s) =>
      s.className.includes("group-data-[focus-visible]/chip:opacity-100")
    );
    expect(focusRing).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Chip — Leading icon colors
// ---------------------------------------------------------------------------

describe("Chip — Leading icon colors", () => {
  const icon = <span data-testid="icon">★</span>;

  test("50. assist leading icon has text-primary class", () => {
    const { container } = render(<Chip type="assist" label="Help" leadingIcon={icon} />);
    const iconWrapper = container.querySelector(".text-primary");
    expect(iconWrapper).toBeInTheDocument();
  });

  test("51. filter leading icon has text-on-surface-variant class", () => {
    const { container } = render(<Chip type="filter" label="Veg" leadingIcon={icon} />);
    const iconWrapper = container.querySelector(".text-on-surface-variant");
    expect(iconWrapper).toBeInTheDocument();
  });

  test("52. input leading icon has text-on-surface-variant class", () => {
    const { container } = render(
      <Chip type="input" label="React" leadingIcon={icon} onRemove={vi.fn()} />
    );
    const iconWrapper = container.querySelector(".text-on-surface-variant");
    expect(iconWrapper).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Chip — Filter checkmark animation
// ---------------------------------------------------------------------------

describe("Chip — Filter checkmark", () => {
  test("53. checkmark container is present for filter chips", () => {
    const { container } = render(<Chip type="filter" label="Veg" />);
    const checkmarkContainer = container.querySelector(
      'span[aria-hidden="true"].inline-flex.overflow-hidden'
    );
    expect(checkmarkContainer).toBeInTheDocument();
  });

  test("54. checkmark container has group-data-[selected]/chip:w-[18px] class", () => {
    const { container } = render(<Chip type="filter" label="Veg" />);
    const spans = Array.from(container.querySelectorAll('span[aria-hidden="true"]'));
    const checkmark = spans.find((s) =>
      s.className.includes("group-data-[selected]/chip:w-[18px]")
    );
    expect(checkmark).toBeInTheDocument();
  });

  test("55. checkmark icon has spatial spring motion class", () => {
    const { container } = render(<Chip type="filter" label="Veg" />);
    const spans = Array.from(container.querySelectorAll("span"));
    const checkmarkContainer = spans.find((s) =>
      s.className.includes("duration-spring-standard-fast-spatial")
    );
    expect(checkmarkContainer).toBeInTheDocument();
  });

  test("56. checkmark icon opacity class uses spring-standard-fast-effects", () => {
    const { container } = render(<Chip type="filter" label="Veg" />);
    const spans = Array.from(container.querySelectorAll("span"));
    const iconWrapper = spans.find((s) =>
      s.className.includes("group-data-[selected]/chip:opacity-100")
    );
    expect(iconWrapper).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Chip — data-* interaction attributes on root
// ---------------------------------------------------------------------------

describe("Chip — data-* interaction attributes", () => {
  test("57. non-disabled chip does NOT have data-disabled attribute", () => {
    render(<Chip type="assist" label="Help" />);
    const chip = screen.getByRole("button", { name: "Help" });
    expect(chip).not.toHaveAttribute("data-disabled");
  });

  test("58. disabled chip has data-disabled='' attribute", () => {
    render(<Chip type="assist" label="Help" isDisabled />);
    const chip = screen.getByRole("button", { name: "Help" });
    expect(chip).toHaveAttribute("data-disabled", "");
  });
});

// ---------------------------------------------------------------------------
// Chip — Input removal animation
// ---------------------------------------------------------------------------

describe("Chip — Input removal animation", () => {
  test("59. clicking remove button adds animate-md-fade-out to chip root", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    const { container } = render(<Chip type="input" label="React" onRemove={onRemove} />);
    const chipRoot = container.firstChild as HTMLElement;

    await user.click(screen.getByRole("button", { name: "Remove React" }));

    expect(chipRoot).toHaveClass("animate-md-fade-out");
  });

  test("60. onRemove is NOT called immediately — only after animationend", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    const { container } = render(<Chip type="input" label="React" onRemove={onRemove} />);
    const chipRoot = container.firstChild as HTMLElement;

    await user.click(screen.getByRole("button", { name: "Remove React" }));
    expect(onRemove).not.toHaveBeenCalled();

    fireEvent.animationEnd(chipRoot);
    expect(onRemove).toHaveBeenCalledTimes(1);
  });
});

// ---------------------------------------------------------------------------
// Chip — Ripple
// ---------------------------------------------------------------------------

describe("Chip — Ripple", () => {
  test("61. ripple container is present for interactive chips", () => {
    const { container } = render(<Chip type="assist" label="Help" />);
    expect(container.querySelector("[data-ripple-container]")).toBeInTheDocument();
  });

  test("62. ripple container has rounded-[inherit] for correct clipping", () => {
    const { container } = render(<Chip type="assist" label="Help" />);
    const rippleContainer = container.querySelector("[data-ripple-container]");
    expect(rippleContainer).toHaveClass("rounded-[inherit]");
  });
});

// ---------------------------------------------------------------------------
// Chip — Motion tokens (no legacy hardcoded durations)
// ---------------------------------------------------------------------------

describe("Chip — Motion tokens", () => {
  test("63. root chip has spring-standard-fast-effects transition", () => {
    render(<Chip type="assist" label="Help" />);
    const chip = screen.getByRole("button", { name: "Help" });
    expect(chip).toHaveClass("duration-spring-standard-fast-effects");
    expect(chip).toHaveClass("ease-spring-standard-fast-effects");
  });

  test("64. filter chip does NOT have legacy duration-short4 class", () => {
    render(<Chip type="filter" label="Veg" />);
    const chip = screen.getByRole("button", { name: "Veg" });
    expect(chip).not.toHaveClass("duration-short4");
    expect(chip).not.toHaveClass("ease-standard");
  });
});

// ---------------------------------------------------------------------------
// Chip — Deprecated surface="tonal"
// ---------------------------------------------------------------------------

describe("Chip — Deprecated surface tonal", () => {
  test("65. surface=tonal logs a console.warn in development", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    render(<Chip type="assist" label="Help" surface="tonal" />);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('surface="tonal" is deprecated'));
    warnSpy.mockRestore();
  });

  test("66. surface=tonal renders the same as surface=flat (transparent bg)", () => {
    const { container: flatContainer } = render(
      <Chip type="assist" label="Help A" surface="flat" />
    );
    const flatChip = flatContainer.querySelector("button")!;

    // Suppress the expected deprecation warning
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const { container: tonalContainer } = render(
      <Chip type="assist" label="Help B" surface="tonal" />
    );
    warnSpy.mockRestore();

    const tonalChip = tonalContainer.querySelector("button")!;
    // Both should have transparent bg and border-outline (flat surface tokens)
    expect(flatChip).toHaveClass("bg-transparent");
    expect(tonalChip).toHaveClass("bg-transparent");
  });
});

// ---------------------------------------------------------------------------
// Chip — Axe accessibility — styled component
// ---------------------------------------------------------------------------

describe("Chip — Axe accessibility (styled)", () => {
  test("67. axe check — assist chip, no violations", async () => {
    const { container } = render(<Chip type="assist" label="Set alarm" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("68. axe check — filter chip (selected), no violations", async () => {
    const { container } = render(<Chip type="filter" label="Vegetarian" selected />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("69. axe check — input chip, no violations", async () => {
    const { container } = render(<Chip type="input" label="React" onRemove={vi.fn()} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("70. axe check — elevated suggestion chip, no violations", async () => {
    const { container } = render(<Chip type="suggestion" surface="elevated" label="See photos" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("71. axe check — disabled filter chip, no violations", async () => {
    const { container } = render(<Chip type="filter" label="Veg" isDisabled />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ---------------------------------------------------------------------------
// ChipSet
// ---------------------------------------------------------------------------

describe("ChipSet", () => {
  test("44. renders as div with flex flex-wrap gap-2", () => {
    const { container } = render(
      <ChipSet>
        <Chip type="filter" label="React" />
      </ChipSet>
    );
    const chipSet = container.firstChild as HTMLElement;
    expect(chipSet.tagName).toBe("DIV");
    expect(chipSet).toHaveClass("flex");
    expect(chipSet).toHaveClass("flex-wrap");
    expect(chipSet).toHaveClass("gap-2");
  });

  test("45. renders all children", () => {
    render(
      <ChipSet>
        <Chip type="filter" label="React" />
        <Chip type="filter" label="TypeScript" />
      </ChipSet>
    );
    expect(screen.getByRole("button", { name: "React" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "TypeScript" })).toBeInTheDocument();
  });
});
