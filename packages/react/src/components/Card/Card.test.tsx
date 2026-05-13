import { createRef } from "react";
import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { CardHeadless } from "./CardHeadless";
import { Card } from "./Card";
import { CardMedia } from "./CardMedia";
import { CardHeader } from "./CardHeader";
import { CardContent } from "./CardContent";
import { CardActions } from "./CardActions";

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

// ─── Styled Card — Variant classes ────────────────────────────────────────────

describe("Card — variant classes", () => {
  test("17. elevated variant: applies bg-surface-container-low and shadow-elevation-1", () => {
    const { container } = render(<Card variant="elevated">Card</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass("bg-surface-container-low");
    expect(card).toHaveClass("shadow-elevation-1");
  });

  test("18. filled variant: applies bg-surface-container-highest", () => {
    const { container } = render(<Card variant="filled">Card</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass("bg-surface-container-highest");
  });

  test("19. outlined variant: applies bg-surface, border, and border-outline-variant", () => {
    const { container } = render(<Card variant="outlined">Card</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass("bg-surface");
    expect(card).toHaveClass("border");
    expect(card).toHaveClass("border-outline-variant");
  });

  test("20. all variants: applies rounded-md (MD3 medium corner)", () => {
    const { container: c1 } = render(<Card variant="elevated">Card</Card>);
    const { container: c2 } = render(<Card variant="filled">Card</Card>);
    const { container: c3 } = render(<Card variant="outlined">Card</Card>);
    expect(c1.firstChild).toHaveClass("rounded-md");
    expect(c2.firstChild).toHaveClass("rounded-md");
    expect(c3.firstChild).toHaveClass("rounded-md");
  });
});

// ─── Styled Card — State layer ────────────────────────────────────────────────

describe("Card — state layer", () => {
  test("21. interactive elevated: state layer div is present", () => {
    render(
      <Card variant="elevated" onPress={vi.fn()} aria-label="Interactive card">
        Card
      </Card>
    );
    expect(screen.getByTestId("card-state-layer")).toBeInTheDocument();
  });

  test("22. interactive: state layer has opacity-0 by default", () => {
    render(
      <Card onPress={vi.fn()} aria-label="Interactive card">
        Card
      </Card>
    );
    expect(screen.getByTestId("card-state-layer")).toHaveClass("opacity-0");
  });

  test("23. interactive: state layer has group-hover:opacity-8 class", () => {
    render(
      <Card onPress={vi.fn()} aria-label="Interactive card">
        Card
      </Card>
    );
    expect(screen.getByTestId("card-state-layer")).toHaveClass("group-hover:opacity-8");
  });

  test("24. non-interactive: no ripple container present", () => {
    const { container } = render(<Card variant="elevated">Static card</Card>);
    expect(container.querySelector("[data-ripple-container]")).not.toBeInTheDocument();
  });
});

// ─── Styled Card — Sub-components ─────────────────────────────────────────────

describe("Card — sub-components", () => {
  test("25. CardMedia renders img with correct src and alt", () => {
    render(<CardMedia src="/test.jpg" alt="Test image" />);
    const img = screen.getByRole("img", { name: "Test image" });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/test.jpg");
    expect(img).toHaveAttribute("alt", "Test image");
  });

  test("26. CardMedia with empty alt has role=presentation", () => {
    const { container } = render(<CardMedia src="/decorative.jpg" alt="" />);
    const img = container.querySelector("img");
    expect(img).toHaveAttribute("role", "presentation");
    expect(img).toHaveAttribute("alt", "");
  });

  test("27. CardHeader renders headline text", () => {
    render(<CardHeader headline="Card Title" />);
    expect(screen.getByText("Card Title")).toBeInTheDocument();
  });

  test("28. CardHeader renders subheader text when provided", () => {
    render(<CardHeader headline="Title" subheader="Supporting text" />);
    expect(screen.getByText("Supporting text")).toBeInTheDocument();
  });

  test("29. CardContent renders children", () => {
    render(<CardContent>Body content here</CardContent>);
    expect(screen.getByText("Body content here")).toBeInTheDocument();
  });

  test("30. CardActions renders children in a flex container with justify-end", () => {
    const { container } = render(
      <CardActions>
        <button>Action</button>
      </CardActions>
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("flex");
    expect(wrapper).toHaveClass("justify-end");
    expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument();
  });
});

// ─── Styled Card — Composition ────────────────────────────────────────────────

describe("Card — composition", () => {
  test("31. full composition renders without errors", () => {
    const { container } = render(
      <Card variant="elevated" onPress={vi.fn()} aria-label="Full card">
        <CardMedia src="/image.jpg" alt="Card image" aspectRatio="16/9" />
        <CardHeader headline="Card Title" subheader="Subtitle" />
        <CardContent>
          <p>Body text content</p>
        </CardContent>
        <CardActions>
          <button>Action</button>
        </CardActions>
      </Card>
    );
    expect(container.firstChild).toBeInTheDocument();
    expect(screen.getByText("Card Title")).toBeInTheDocument();
    expect(screen.getByText("Body text content")).toBeInTheDocument();
  });

  test("32. Card renders with no children without error", () => {
    const { container } = render(<Card variant="filled" />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
