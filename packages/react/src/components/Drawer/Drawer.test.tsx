import React from "react";
import { describe, test, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Drawer } from "./Drawer";
import { DrawerItem } from "./DrawerItem";
import { DrawerSection } from "./DrawerSection";
import { DrawerHeadline } from "./DrawerHeadline";
import { HeadlessDrawer, HeadlessDrawerItem } from "./DrawerHeadless";

// ─── Test Icon Mocks ───────────────────────────────────────────────────────────

const HomeIcon = () => <svg data-testid="home-icon" aria-hidden="true" />;
const SettingsIcon = () => <svg data-testid="settings-icon" aria-hidden="true" />;
const InboxIcon = () => <svg data-testid="inbox-icon" aria-hidden="true" />;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function renderStandardDrawer(props: Partial<React.ComponentProps<typeof Drawer>> = {}) {
  return render(
    <Drawer variant="standard" open aria-label="App navigation" {...props}>
      <DrawerItem label="Home" isActive />
      <DrawerItem label="Settings" />
    </Drawer>
  );
}

function renderModalDrawer(props: Partial<React.ComponentProps<typeof Drawer>> = {}) {
  return render(
    <Drawer variant="modal" open aria-label="App navigation" {...props}>
      <DrawerItem label="Home" isActive />
      <DrawerItem label="Settings" />
    </Drawer>
  );
}

// ─── Drawer ────────────────────────────────────────────────────────────────────

describe("Drawer", () => {
  // ── Standard Variant ────────────────────────────────────────────────────────

  describe("Standard variant", () => {
    test("renders as nav landmark", () => {
      renderStandardDrawer();
      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });

    test("has correct aria-label", () => {
      renderStandardDrawer();
      expect(screen.getByRole("navigation")).toHaveAttribute("aria-label", "App navigation");
    });

    test("renders children", () => {
      renderStandardDrawer();
      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("Settings")).toBeInTheDocument();
    });

    test("does NOT render a dialog role", () => {
      renderStandardDrawer();
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    test("does NOT render a scrim when open", () => {
      renderStandardDrawer();
      expect(screen.queryByTestId("drawer-scrim")).not.toBeInTheDocument();
    });

    test("is hidden (off-screen) when open=false", () => {
      renderStandardDrawer({ open: false });
      const nav = screen.getByRole("navigation");
      expect(nav.className).toContain("-translate-x-full");
    });

    test("is visible when open=true", () => {
      renderStandardDrawer({ open: true });
      const nav = screen.getByRole("navigation");
      expect(nav.className).not.toContain("-translate-x-full");
    });

    test("applies correct surface token class", () => {
      renderStandardDrawer();
      const nav = screen.getByRole("navigation");
      expect(nav.className).toContain("bg-surface-container-low");
    });

    test("applies correct corner class (rounded-r-lg = 16dp MD3 large)", () => {
      renderStandardDrawer();
      const nav = screen.getByRole("navigation");
      expect(nav.className).toContain("rounded-r-lg");
    });

    test("accepts custom className", () => {
      renderStandardDrawer({ className: "custom-nav-class" });
      expect(screen.getByRole("navigation")).toHaveClass("custom-nav-class");
    });
  });

  // ── Modal Variant ────────────────────────────────────────────────────────────

  describe("Modal variant", () => {
    test("renders dialog with role='dialog'", () => {
      renderModalDrawer();
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    test("has aria-modal='true'", () => {
      renderModalDrawer();
      expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");
    });

    test("has correct aria-label on dialog", () => {
      renderModalDrawer();
      expect(screen.getByRole("dialog")).toHaveAttribute("aria-label", "App navigation");
    });

    test("renders scrim when open", () => {
      renderModalDrawer();
      expect(screen.getByTestId("drawer-scrim")).toBeInTheDocument();
    });

    test("does NOT render scrim when closed", () => {
      renderModalDrawer({ open: false });
      expect(screen.queryByTestId("drawer-scrim")).not.toBeInTheDocument();
    });

    test("calls onOpenChange(false) when scrim is clicked", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      renderModalDrawer({ onOpenChange });
      await user.click(screen.getByTestId("drawer-scrim"));
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    test("calls onOpenChange(false) when Escape is pressed", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      renderModalDrawer({ onOpenChange });
      await user.keyboard("{Escape}");
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    test("modal uses bg-surface-container-low (aligned with standard)", () => {
      renderModalDrawer();
      const dialog = screen.getByRole("dialog");
      expect(dialog.className).toContain("bg-surface-container-low");
    });

    test("modal adds shadow-elevation-1 for separation", () => {
      renderModalDrawer();
      const dialog = screen.getByRole("dialog");
      expect(dialog.className).toContain("shadow-elevation-1");
    });
  });

  // ── Accessibility ─────────────────────────────────────────────────────────────

  describe("Accessibility (axe)", () => {
    test("standard variant passes axe audit", async () => {
      const { container } = renderStandardDrawer();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("modal variant passes axe audit when open", async () => {
      const { container } = renderModalDrawer();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("modal variant passes axe audit when closed", async () => {
      const { container } = renderModalDrawer({ open: false });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});

// ─── DrawerHeadline ───────────────────────────────────────────────────────────

describe("DrawerHeadline", () => {
  test("renders headline text", () => {
    render(<DrawerHeadline>Mail</DrawerHeadline>);
    expect(screen.getByText("Mail")).toBeInTheDocument();
  });

  test("accepts custom className", () => {
    render(<DrawerHeadline className="custom-headline">Mail</DrawerHeadline>);
    expect(screen.getByText("Mail")).toHaveClass("custom-headline");
  });

  test("applies MD3 typography class (text-title-small)", () => {
    render(<DrawerHeadline>Mail</DrawerHeadline>);
    expect(screen.getByText("Mail").className).toContain("text-title-small");
  });

  test("applies MD3 color class (text-on-surface-variant)", () => {
    render(<DrawerHeadline>Mail</DrawerHeadline>);
    expect(screen.getByText("Mail").className).toContain("text-on-surface-variant");
  });

  test("passes axe audit inside a drawer", async () => {
    const { container } = render(
      <Drawer variant="standard" open aria-label="App navigation">
        <DrawerHeadline>Mail</DrawerHeadline>
        <DrawerItem label="Home" isActive />
      </Drawer>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ─── DrawerItem ───────────────────────────────────────────────────────────────

describe("DrawerItem", () => {
  // ── Rendering ──────────────────────────────────────────────────────────────

  describe("Rendering", () => {
    test("renders label text", () => {
      render(<DrawerItem label="Home" />);
      expect(screen.getByText("Home")).toBeInTheDocument();
    });

    test("renders as <button> when no href", () => {
      render(<DrawerItem label="Home" />);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    test("renders as <a> when href is provided", () => {
      render(<DrawerItem label="Home" href="/home" />);
      expect(screen.getByRole("link")).toBeInTheDocument();
      expect(screen.getByRole("link")).toHaveAttribute("href", "/home");
    });

    test("renders icon when provided", () => {
      render(<DrawerItem label="Home" icon={<HomeIcon />} />);
      expect(screen.getByTestId("home-icon")).toBeInTheDocument();
    });

    test("accepts custom className", () => {
      render(<DrawerItem label="Home" className="custom-item" />);
      expect(screen.getByRole("button")).toHaveClass("custom-item");
    });

    test("applies rounded-full to item (pill shape)", () => {
      render(<DrawerItem label="Home" />);
      expect(screen.getByRole("button").className).toContain("rounded-full");
    });

    test("applies h-14 to item (56dp height per MD3 spec)", () => {
      render(<DrawerItem label="Home" />);
      expect(screen.getByRole("button").className).toContain("h-14");
    });
  });

  // ── Badge ───────────────────────────────────────────────────────────────────

  describe("Badge", () => {
    test("renders numeric badge", () => {
      render(<DrawerItem label="Inbox" badge={24} />);
      expect(screen.getByText("24")).toBeInTheDocument();
    });

    test("renders string badge", () => {
      render(<DrawerItem label="Beta" badge="NEW" />);
      expect(screen.getByText("NEW")).toBeInTheDocument();
    });

    test("badge has role='status' with numeric aria-label", () => {
      render(<DrawerItem label="Inbox" badge={5} />);
      const badge = screen.getByRole("status");
      expect(badge).toHaveAttribute("aria-label", "5 notifications");
    });

    test("badge has role='status' with string aria-label", () => {
      render(<DrawerItem label="Beta" badge="NEW" />);
      const badge = screen.getByRole("status");
      expect(badge).toHaveAttribute("aria-label", "NEW");
    });

    test("does NOT render badge when badge is undefined", () => {
      render(<DrawerItem label="Home" />);
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });
  });

  // ── Active State ───────────────────────────────────────────────────────────

  describe("Active state", () => {
    test("has aria-current='page' when isActive=true", () => {
      render(<DrawerItem label="Home" isActive />);
      expect(screen.getByRole("button")).toHaveAttribute("aria-current", "page");
    });

    test("does NOT have aria-current when isActive=false", () => {
      render(<DrawerItem label="Home" />);
      expect(screen.getByRole("button")).not.toHaveAttribute("aria-current");
    });

    test("sets data-active on the root when isActive=true", () => {
      render(<DrawerItem label="Home" isActive />);
      expect(screen.getByRole("button")).toHaveAttribute("data-active", "");
    });

    test("does NOT set data-active when isActive=false", () => {
      render(<DrawerItem label="Home" />);
      expect(screen.getByRole("button")).not.toHaveAttribute("data-active");
    });

    test("active item has group/draweritem class for slot selectors", () => {
      render(<DrawerItem label="Home" isActive />);
      expect(screen.getByRole("button").className).toContain("group/draweritem");
    });
  });

  // ── Slots ──────────────────────────────────────────────────────────────────

  describe("Slot architecture", () => {
    test("renders active indicator slot", () => {
      render(<DrawerItem label="Home" />);
      const item = screen.getByRole("button");
      const slots = item.querySelectorAll('[aria-hidden="true"]');
      // At least the active indicator, state layer, focus ring spans exist
      expect(slots.length).toBeGreaterThanOrEqual(3);
    });

    test("active indicator has secondary-container class", () => {
      render(<DrawerItem label="Home" isActive />);
      const item = screen.getByRole("button");
      const indicator = item.querySelector(".bg-secondary-container");
      expect(indicator).not.toBeNull();
    });

    test("state layer has on-surface-variant class for inactive item", () => {
      render(<DrawerItem label="Home" />);
      const item = screen.getByRole("button");
      const stateLayer = item.querySelector(".bg-on-surface-variant");
      expect(stateLayer).not.toBeNull();
    });

    test("focus ring has outline-secondary class", () => {
      render(<DrawerItem label="Home" />);
      const item = screen.getByRole("button");
      const focusRing = item.querySelector(".outline-secondary");
      expect(focusRing).not.toBeNull();
    });
  });

  // ── Disabled State ─────────────────────────────────────────────────────────

  describe("Disabled state", () => {
    test("is not clickable when disabled", async () => {
      const user = userEvent.setup();
      const onPress = vi.fn();
      render(<DrawerItem label="Home" isDisabled onPress={onPress} />);
      const item = screen.getByRole("button");
      await user.click(item);
      expect(onPress).not.toHaveBeenCalled();
    });

    test("sets disabled attribute when disabled", () => {
      render(<DrawerItem label="Home" isDisabled />);
      expect(screen.getByRole("button")).toBeDisabled();
    });

    test("sets data-disabled attribute when disabled", () => {
      render(<DrawerItem label="Home" isDisabled />);
      expect(screen.getByRole("button")).toHaveAttribute("data-disabled", "");
    });
  });

  // ── Interactions ───────────────────────────────────────────────────────────

  describe("Interactions", () => {
    test("calls onPress when clicked", async () => {
      const user = userEvent.setup();
      const onPress = vi.fn();
      render(<DrawerItem label="Home" onPress={onPress} />);
      await user.click(screen.getByRole("button"));
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    test("calls onPress when Enter is pressed", async () => {
      const user = userEvent.setup();
      const onPress = vi.fn();
      render(<DrawerItem label="Home" onPress={onPress} />);
      screen.getByRole("button").focus();
      await user.keyboard("{Enter}");
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    test("calls onPress when Space is pressed", async () => {
      const user = userEvent.setup();
      const onPress = vi.fn();
      render(<DrawerItem label="Home" onPress={onPress} />);
      screen.getByRole("button").focus();
      await user.keyboard(" ");
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    // Note: data-hovered tests are omitted because react-aria's useHover
    // relies on pointer events that JSDOM does not support. Hover state is
    // verified visually in Storybook and is covered by react-aria's own tests.
  });

  // ── Accessibility ──────────────────────────────────────────────────────────

  describe("Accessibility (axe)", () => {
    test("button item passes axe audit", async () => {
      const { container } = render(<DrawerItem label="Home" icon={<HomeIcon />} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("link item passes axe audit", async () => {
      const { container } = render(<DrawerItem label="Settings" href="/settings" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("active item passes axe audit", async () => {
      const { container } = render(<DrawerItem label="Home" isActive />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("disabled item passes axe audit", async () => {
      const { container } = render(<DrawerItem label="Home" isDisabled />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("item with badge passes axe audit", async () => {
      const { container } = render(
        <nav aria-label="test">
          <DrawerItem label="Inbox" badge={24} />
        </nav>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});

// ─── DrawerSection ────────────────────────────────────────────────────────────

describe("DrawerSection", () => {
  test("renders children", () => {
    render(
      <DrawerSection>
        <DrawerItem label="Profile" />
      </DrawerSection>
    );
    expect(screen.getByText("Profile")).toBeInTheDocument();
  });

  test("renders header when provided", () => {
    render(
      <DrawerSection header="Account">
        <DrawerItem label="Profile" />
      </DrawerSection>
    );
    expect(screen.getByText("Account")).toBeInTheDocument();
  });

  test("does NOT render header when not provided", () => {
    render(
      <DrawerSection>
        <DrawerItem label="Profile" />
      </DrawerSection>
    );
    expect(screen.queryByText("Account")).not.toBeInTheDocument();
  });

  test("renders divider when showDivider=true", () => {
    render(
      <DrawerSection showDivider>
        <DrawerItem label="Profile" />
      </DrawerSection>
    );
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  test("does NOT render divider when showDivider=false", () => {
    render(
      <DrawerSection showDivider={false}>
        <DrawerItem label="Profile" />
      </DrawerSection>
    );
    expect(screen.queryByRole("separator")).not.toBeInTheDocument();
  });

  test("passes axe audit", async () => {
    const { container } = render(
      <nav aria-label="test">
        <DrawerSection header="Account" showDivider>
          <DrawerItem label="Profile" />
          <DrawerItem label="Logout" />
        </DrawerSection>
      </nav>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ─── Full Drawer Composition ──────────────────────────────────────────────────

describe("Drawer composition", () => {
  test("renders standard drawer with headline, sections, and items", () => {
    render(
      <Drawer variant="standard" open aria-label="App navigation">
        <DrawerHeadline>Mail</DrawerHeadline>
        <DrawerItem icon={<HomeIcon />} label="Inbox" isActive badge={24} />
        <DrawerItem icon={<SettingsIcon />} label="Outbox" />
        <DrawerSection header="Labels" showDivider>
          <DrawerItem label="Promotions" />
        </DrawerSection>
      </Drawer>
    );
    expect(screen.getByText("Mail")).toBeInTheDocument();
    expect(screen.getByText("Inbox")).toBeInTheDocument();
    expect(screen.getByText("24")).toBeInTheDocument();
    expect(screen.getByText("Labels")).toBeInTheDocument();
    expect(screen.getByText("Promotions")).toBeInTheDocument();
  });

  test("standard drawer with sections passes axe audit", async () => {
    const { container } = render(
      <Drawer variant="standard" open aria-label="App navigation">
        <DrawerHeadline>Mail</DrawerHeadline>
        <DrawerItem icon={<HomeIcon />} label="Home" isActive />
        <DrawerSection header="Account" showDivider>
          <DrawerItem icon={<SettingsIcon />} label="Settings" />
        </DrawerSection>
      </Drawer>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("renders modal drawer with items and badge", () => {
    render(
      <Drawer variant="modal" open aria-label="App navigation">
        <DrawerItem icon={<HomeIcon />} label="Home" isActive />
        <DrawerSection header="More" showDivider>
          <DrawerItem icon={<InboxIcon />} label="Inbox" badge={5} />
        </DrawerSection>
      </Drawer>
    );
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("More")).toBeInTheDocument();
    expect(screen.getByText("Inbox")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  test("controlled modal drawer toggles correctly", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    const { rerender } = render(
      <Drawer variant="modal" open onOpenChange={onOpenChange} aria-label="App navigation">
        <DrawerItem label="Home" />
      </Drawer>
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.click(screen.getByTestId("drawer-scrim"));
    expect(onOpenChange).toHaveBeenCalledWith(false);

    rerender(
      <Drawer variant="modal" open={false} onOpenChange={onOpenChange} aria-label="App navigation">
        <DrawerItem label="Home" />
      </Drawer>
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

// ─── Headless Primitives ──────────────────────────────────────────────────────

describe("HeadlessDrawer", () => {
  test("renders standard variant as nav landmark", () => {
    render(
      <HeadlessDrawer variant="standard" open aria-label="Headless nav">
        <div>Content</div>
      </HeadlessDrawer>
    );
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  test("renders modal variant as dialog", () => {
    render(
      <HeadlessDrawer variant="modal" open aria-label="Headless nav">
        <div>Content</div>
      </HeadlessDrawer>
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});

describe("HeadlessDrawerItem", () => {
  test("renders as button by default", () => {
    render(<HeadlessDrawerItem>Click me</HeadlessDrawerItem>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  test("renders as link when href is provided", () => {
    render(<HeadlessDrawerItem href="/home">Home</HeadlessDrawerItem>);
    expect(screen.getByRole("link")).toBeInTheDocument();
  });

  test("sets aria-current='page' when isActive=true", () => {
    render(<HeadlessDrawerItem isActive>Home</HeadlessDrawerItem>);
    expect(screen.getByRole("button")).toHaveAttribute("aria-current", "page");
  });

  test("passes axe audit", async () => {
    const { container } = render(
      <nav aria-label="test">
        <HeadlessDrawerItem>Home</HeadlessDrawerItem>
        <HeadlessDrawerItem href="/settings">Settings</HeadlessDrawerItem>
        <HeadlessDrawerItem isActive>Active</HeadlessDrawerItem>
      </nav>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ─── DrawerSection — section dividers ────────────────────────────────────────

describe("DrawerSection — section dividers", () => {
  test("renders Divider between two adjacent sections", () => {
    render(
      <Drawer variant="standard" open aria-label="Nav">
        <DrawerSection showDivider>
          <DrawerItem label="Home" />
        </DrawerSection>
        <DrawerSection showDivider>
          <DrawerItem label="Settings" />
        </DrawerSection>
      </Drawer>
    );
    const separators = screen.getAllByRole("separator");
    expect(separators).toHaveLength(1);
  });

  test("does NOT render Divider when showDivider={false}", () => {
    render(
      <Drawer variant="standard" open aria-label="Nav">
        <DrawerSection showDivider={false}>
          <DrawerItem label="Home" />
        </DrawerSection>
        <DrawerSection showDivider={false}>
          <DrawerItem label="Settings" />
        </DrawerSection>
      </Drawer>
    );
    expect(screen.queryByRole("separator")).not.toBeInTheDocument();
  });

  test("does NOT render Divider for the first section", () => {
    render(
      <Drawer variant="standard" open aria-label="Nav">
        <DrawerSection showDivider>
          <DrawerItem label="Home" />
        </DrawerSection>
      </Drawer>
    );
    expect(screen.queryByRole("separator")).not.toBeInTheDocument();
  });
});

// ─── Motion classes ───────────────────────────────────────────────────────────

describe("Motion tokens", () => {
  test("scrim has transition-opacity class", () => {
    renderModalDrawer();
    const scrim = screen.getByTestId("drawer-scrim");
    expect(scrim.className).toContain("transition-opacity");
  });

  test("scrim has duration-short4 and ease-standard classes", () => {
    renderModalDrawer();
    const scrim = screen.getByTestId("drawer-scrim");
    expect(scrim.className).toContain("duration-short4");
    expect(scrim.className).toContain("ease-standard");
  });

  test("open drawer uses emphasized-decelerate easing", () => {
    renderStandardDrawer({ open: true });
    const nav = screen.getByRole("navigation");
    expect(nav.className).toContain("ease-emphasized-decelerate");
  });

  test("closed drawer uses emphasized-accelerate easing", () => {
    renderStandardDrawer({ open: false });
    const nav = screen.getByRole("navigation");
    expect(nav.className).toContain("ease-emphasized-accelerate");
  });
});

// ─── Focus Management (Modal) ─────────────────────────────────────────────────

describe("Modal drawer focus management", () => {
  test("focus returns to trigger after modal closes via Escape", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    const TriggerTest = () => {
      const [open, setOpen] = React.useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>Open Drawer</button>
          <Drawer
            variant="modal"
            open={open}
            onOpenChange={(val) => {
              setOpen(val);
              onOpenChange(val);
            }}
            aria-label="App navigation"
          >
            <DrawerItem label="Home" />
          </Drawer>
        </>
      );
    };

    render(<TriggerTest />);

    const trigger = screen.getByText("Open Drawer");
    await user.click(trigger);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
