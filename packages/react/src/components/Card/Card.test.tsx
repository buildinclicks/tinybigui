import { createRef } from "react";
import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { CardHeadless } from "./CardHeadless";

// ─── Non-interactive mode ─────────────────────────────────────────────────────

describe("CardHeadless — non-interactive", () => {
  test('1. renders with role="article" when no onPress or href', () => {
    render(<CardHeadless>Static card</CardHeadless>);
    expect(screen.getByRole("article")).toBeInTheDocument();
  });

  test('2. does NOT have role="button" when non-interactive', () => {
    render(<CardHeadless>Static card</CardHeadless>);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  test("3. does NOT respond to keyboard Enter/Space — not in tab order", () => {
    render(<CardHeadless>Static card</CardHeadless>);
    const card = screen.getByRole("article");

    // useButton is not applied, so the div gets no tabIndex from React Aria
    expect(card).not.toHaveAttribute("tabindex", "0");
  });
});

// ─── Interactive mode (onPress) ───────────────────────────────────────────────

describe("CardHeadless — interactive (onPress)", () => {
  test('4. renders with role="button" when onPress is provided', () => {
    render(
      <CardHeadless onPress={vi.fn()} aria-label="Interactive card">
        Card
      </CardHeadless>
    );
    expect(screen.getByRole("button", { name: "Interactive card" })).toBeInTheDocument();
  });

  test("5. calls onPress on click", async () => {
    const handlePress = vi.fn();
    const user = userEvent.setup();

    render(
      <CardHeadless onPress={handlePress} aria-label="Clickable card">
        Card
      </CardHeadless>
    );

    await user.click(screen.getByRole("button"));
    expect(handlePress).toHaveBeenCalledTimes(1);
  });

  test("6. calls onPress on Enter key", async () => {
    const handlePress = vi.fn();
    const user = userEvent.setup();

    render(
      <CardHeadless onPress={handlePress} aria-label="Card">
        Card
      </CardHeadless>
    );

    const card = screen.getByRole("button");
    card.focus();
    await user.keyboard("{Enter}");

    expect(handlePress).toHaveBeenCalledTimes(1);
  });

  test("7. calls onPress on Space key", async () => {
    const handlePress = vi.fn();
    const user = userEvent.setup();

    render(
      <CardHeadless onPress={handlePress} aria-label="Card">
        Card
      </CardHeadless>
    );

    const card = screen.getByRole("button");
    card.focus();
    await user.keyboard(" ");

    expect(handlePress).toHaveBeenCalledTimes(1);
  });

  test("8. does NOT call onPress when isDisabled", async () => {
    const handlePress = vi.fn();
    const user = userEvent.setup();

    render(
      <CardHeadless onPress={handlePress} isDisabled aria-label="Disabled card">
        Card
      </CardHeadless>
    );

    await user.click(screen.getByRole("button"));
    expect(handlePress).not.toHaveBeenCalled();
  });
});

// ─── Focus ring ───────────────────────────────────────────────────────────────

describe("CardHeadless — focus ring", () => {
  test('9. data-focus-visible="true" applied when focused via keyboard', async () => {
    const user = userEvent.setup();

    render(
      <CardHeadless onPress={vi.fn()} aria-label="Card">
        Card
      </CardHeadless>
    );

    // Tab moves focus via keyboard, which triggers isFocusVisible = true
    await user.tab();

    const card = screen.getByRole("button");
    expect(card).toHaveAttribute("data-focus-visible", "true");
  });

  test("10. data-focus-visible NOT set when focused via mouse", async () => {
    const user = userEvent.setup();

    render(
      <CardHeadless onPress={vi.fn()} aria-label="Card">
        Card
      </CardHeadless>
    );

    // Pointer click — focus is not keyboard-triggered
    await user.click(screen.getByRole("button"));

    const card = screen.getByRole("button");
    expect(card).not.toHaveAttribute("data-focus-visible", "true");
  });
});

// ─── aria-label ───────────────────────────────────────────────────────────────

describe("CardHeadless — aria-label", () => {
  test("11. aria-label applied to interactive card", () => {
    render(
      <CardHeadless onPress={vi.fn()} aria-label="Product card">
        Card
      </CardHeadless>
    );

    expect(screen.getByRole("button", { name: "Product card" })).toBeInTheDocument();
  });
});

// ─── forwardRef ───────────────────────────────────────────────────────────────

describe("CardHeadless — forwardRef", () => {
  test("12. ref correctly attached to the root element", () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <CardHeadless ref={ref} onPress={vi.fn()} aria-label="Card">
        Card
      </CardHeadless>
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toBe(screen.getByRole("button"));
  });
});

// ─── className ────────────────────────────────────────────────────────────────

describe("CardHeadless — className", () => {
  test("13. accepts and applies custom className", () => {
    render(<CardHeadless className="my-custom-card">Content</CardHeadless>);
    expect(screen.getByRole("article")).toHaveClass("my-custom-card");
  });
});

// ─── Accessibility (axe) ─────────────────────────────────────────────────────

describe("CardHeadless — axe", () => {
  test("14. axe: no violations for non-interactive card", async () => {
    const { container } = render(<CardHeadless>Static card content</CardHeadless>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("15. axe: no violations for interactive card with aria-label", async () => {
    const { container } = render(
      <CardHeadless onPress={vi.fn()} aria-label="View product details">
        Product card
      </CardHeadless>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("16. axe: no violations for disabled interactive card", async () => {
    const { container } = render(
      <CardHeadless onPress={vi.fn()} isDisabled aria-label="Unavailable product">
        Disabled card
      </CardHeadless>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
