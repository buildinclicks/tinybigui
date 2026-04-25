import React from "react";
import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { NavigationBar } from "./NavigationBar";
import { NavigationBarItem } from "./NavigationBarItem";
import { HeadlessNavigationBar, HeadlessNavigationBarItem } from "./NavigationBarHeadless";
import type { NavigationBarItemConfig } from "./NavigationBar.types";

// ─── Test Icon Mocks ─────────────────────────────────────────────────────────

const HomeIcon = () => <svg data-testid="home-icon" aria-hidden="true" />;
const SearchIcon = () => <svg data-testid="search-icon" aria-hidden="true" />;
const ProfileIcon = () => <svg data-testid="profile-icon" aria-hidden="true" />;
const SettingsIcon = () => <svg data-testid="settings-icon" aria-hidden="true" />;
const BookmarkIcon = () => <svg data-testid="bookmark-icon" aria-hidden="true" />;

// ─── Fixture Items ────────────────────────────────────────────────────────────

const threeItems: NavigationBarItemConfig[] = [
  { key: "home", icon: <HomeIcon />, label: "Home" },
  { key: "search", icon: <SearchIcon />, label: "Search" },
  { key: "profile", icon: <ProfileIcon />, label: "Profile" },
];

const fourItems: NavigationBarItemConfig[] = [
  ...threeItems,
  { key: "settings", icon: <SettingsIcon />, label: "Settings" },
];

const fiveItems: NavigationBarItemConfig[] = [
  ...fourItems,
  { key: "bookmarks", icon: <BookmarkIcon />, label: "Bookmarks" },
];

// ─── NavigationBar ────────────────────────────────────────────────────────────

describe("NavigationBar", () => {
  // ── Rendering ──────────────────────────────────────────────────────────────

  describe("Rendering", () => {
    test("renders with 3 items", () => {
      render(
        <NavigationBar items={threeItems} defaultActiveKey="home" aria-label="Main navigation" />
      );
      const tabs = screen.getAllByRole("tab");
      expect(tabs).toHaveLength(3);
    });

    test("renders with 4 items", () => {
      render(
        <NavigationBar items={fourItems} defaultActiveKey="home" aria-label="Main navigation" />
      );
      expect(screen.getAllByRole("tab")).toHaveLength(4);
    });

    test("renders with 5 items", () => {
      render(
        <NavigationBar items={fiveItems} defaultActiveKey="home" aria-label="Main navigation" />
      );
      expect(screen.getAllByRole("tab")).toHaveLength(5);
    });

    test("renders labels for each item by default", () => {
      render(
        <NavigationBar items={threeItems} defaultActiveKey="home" aria-label="Main navigation" />
      );
      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("Search")).toBeInTheDocument();
      expect(screen.getByText("Profile")).toBeInTheDocument();
    });

    test("hides labels when hideLabels is true", () => {
      render(
        <NavigationBar
          items={threeItems}
          defaultActiveKey="home"
          aria-label="Main navigation"
          hideLabels
        />
      );
      expect(screen.queryByText("Home")).not.toBeInTheDocument();
      expect(screen.queryByText("Search")).not.toBeInTheDocument();
      expect(screen.queryByText("Profile")).not.toBeInTheDocument();
    });

    test("renders icons for each item", () => {
      render(
        <NavigationBar items={threeItems} defaultActiveKey="home" aria-label="Main navigation" />
      );
      expect(screen.getByTestId("home-icon")).toBeInTheDocument();
      expect(screen.getByTestId("search-icon")).toBeInTheDocument();
      expect(screen.getByTestId("profile-icon")).toBeInTheDocument();
    });

    test("applies custom className to the bar", () => {
      render(
        <NavigationBar
          items={threeItems}
          defaultActiveKey="home"
          aria-label="Main navigation"
          className="my-custom-class"
        />
      );
      const nav = screen.getByRole("navigation");
      expect(nav).toHaveClass("my-custom-class");
    });

    test("forwards ref to the nav element", () => {
      const ref = React.createRef<HTMLElement>();
      render(
        <NavigationBar
          ref={ref}
          items={threeItems}
          defaultActiveKey="home"
          aria-label="Main navigation"
        />
      );
      expect(ref.current).toBeInstanceOf(HTMLElement);
      expect(ref.current?.tagName).toBe("NAV");
    });
  });

  // ── Active State ───────────────────────────────────────────────────────────

  describe("Active state", () => {
    test("activates the correct item via defaultActiveKey (uncontrolled)", () => {
      render(
        <NavigationBar items={threeItems} defaultActiveKey="search" aria-label="Main navigation" />
      );
      const searchTab = screen.getByRole("tab", { name: /search/i });
      expect(searchTab).toHaveAttribute("aria-selected", "true");
    });

    test("all other items are not selected", () => {
      render(
        <NavigationBar items={threeItems} defaultActiveKey="search" aria-label="Main navigation" />
      );
      const homeTab = screen.getByRole("tab", { name: /home/i });
      const profileTab = screen.getByRole("tab", { name: /profile/i });
      expect(homeTab).toHaveAttribute("aria-selected", "false");
      expect(profileTab).toHaveAttribute("aria-selected", "false");
    });

    test("activates the correct item via activeKey (controlled)", () => {
      render(
        <NavigationBar
          items={threeItems}
          activeKey="profile"
          onActiveChange={() => {}}
          aria-label="Main navigation"
        />
      );
      expect(screen.getByRole("tab", { name: /profile/i })).toHaveAttribute(
        "aria-selected",
        "true"
      );
    });

    test("calls onActiveChange when a tab is clicked", async () => {
      const user = userEvent.setup();
      const onActiveChange = vi.fn();
      render(
        <NavigationBar
          items={threeItems}
          defaultActiveKey="home"
          onActiveChange={onActiveChange}
          aria-label="Main navigation"
        />
      );
      await user.click(screen.getByRole("tab", { name: /search/i }));
      expect(onActiveChange).toHaveBeenCalledWith("search");
    });

    test("switches active item on click (uncontrolled)", async () => {
      const user = userEvent.setup();
      render(
        <NavigationBar items={threeItems} defaultActiveKey="home" aria-label="Main navigation" />
      );
      await user.click(screen.getByRole("tab", { name: /search/i }));
      expect(screen.getByRole("tab", { name: /search/i })).toHaveAttribute("aria-selected", "true");
      expect(screen.getByRole("tab", { name: /home/i })).toHaveAttribute("aria-selected", "false");
    });

    test("renders active indicator pill on the active item", () => {
      render(
        <NavigationBar items={threeItems} defaultActiveKey="home" aria-label="Main navigation" />
      );
      const activeTab = screen.getByRole("tab", { name: /home/i });
      const pill = activeTab.querySelector("[data-indicator-pill]");
      expect(pill).toBeInTheDocument();
      expect(pill).toHaveAttribute("data-active", "true");
    });

    test("active item has data-active attribute", () => {
      render(
        <NavigationBar items={threeItems} defaultActiveKey="home" aria-label="Main navigation" />
      );
      const activeTab = screen.getByRole("tab", { name: /home/i });
      expect(activeTab).toHaveAttribute("data-selected", "true");
    });
  });

  // ── Badge ──────────────────────────────────────────────────────────────────

  describe("Badge", () => {
    test("renders dot badge when badge is true", () => {
      const itemsWithDot: NavigationBarItemConfig[] = [
        { key: "home", icon: <HomeIcon />, label: "Home", badge: true },
        { key: "search", icon: <SearchIcon />, label: "Search" },
        { key: "profile", icon: <ProfileIcon />, label: "Profile" },
      ];
      render(
        <NavigationBar items={itemsWithDot} defaultActiveKey="home" aria-label="Main navigation" />
      );
      const homeTab = screen.getByRole("tab", { name: /home/i });
      const badge = homeTab.querySelector("[data-badge]");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveAttribute("data-badge-dot", "true");
    });

    test("renders numeric badge count", () => {
      const itemsWithBadge: NavigationBarItemConfig[] = [
        { key: "home", icon: <HomeIcon />, label: "Home", badge: 5 },
        { key: "search", icon: <SearchIcon />, label: "Search" },
        { key: "profile", icon: <ProfileIcon />, label: "Profile" },
      ];
      render(
        <NavigationBar
          items={itemsWithBadge}
          defaultActiveKey="home"
          aria-label="Main navigation"
        />
      );
      const homeTab = screen.getByRole("tab", { name: /home/i });
      const badge = homeTab.querySelector("[data-badge]");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent("5");
    });

    test("truncates badge to 999+ when count exceeds 999", () => {
      const itemsWithBigBadge: NavigationBarItemConfig[] = [
        { key: "home", icon: <HomeIcon />, label: "Home", badge: 1000 },
        { key: "search", icon: <SearchIcon />, label: "Search" },
        { key: "profile", icon: <ProfileIcon />, label: "Profile" },
      ];
      render(
        <NavigationBar
          items={itemsWithBigBadge}
          defaultActiveKey="home"
          aria-label="Main navigation"
        />
      );
      const homeTab = screen.getByRole("tab", { name: /home/i });
      expect(homeTab.querySelector("[data-badge]")).toHaveTextContent("999+");
    });

    test("hides badge when numeric value is 0", () => {
      const itemsWithZero: NavigationBarItemConfig[] = [
        { key: "home", icon: <HomeIcon />, label: "Home", badge: 0 },
        { key: "search", icon: <SearchIcon />, label: "Search" },
        { key: "profile", icon: <ProfileIcon />, label: "Profile" },
      ];
      render(
        <NavigationBar items={itemsWithZero} defaultActiveKey="home" aria-label="Main navigation" />
      );
      const homeTab = screen.getByRole("tab", { name: /home/i });
      expect(homeTab.querySelector("[data-badge]")).not.toBeInTheDocument();
    });

    test("renders 999 as-is (not truncated)", () => {
      const items999: NavigationBarItemConfig[] = [
        { key: "home", icon: <HomeIcon />, label: "Home", badge: 999 },
        { key: "search", icon: <SearchIcon />, label: "Search" },
        { key: "profile", icon: <ProfileIcon />, label: "Profile" },
      ];
      render(
        <NavigationBar items={items999} defaultActiveKey="home" aria-label="Main navigation" />
      );
      const homeTab = screen.getByRole("tab", { name: /home/i });
      expect(homeTab.querySelector("[data-badge]")).toHaveTextContent("999");
    });
  });

  // ── Keyboard Navigation ────────────────────────────────────────────────────

  describe("Keyboard navigation", () => {
    test("navigates to the next item with ArrowRight", async () => {
      const user = userEvent.setup();
      render(
        <NavigationBar items={threeItems} defaultActiveKey="home" aria-label="Main navigation" />
      );
      screen.getByRole("tab", { name: /home/i }).focus();
      await user.keyboard("{ArrowRight}");
      expect(document.activeElement).toBe(screen.getByRole("tab", { name: /search/i }));
    });

    test("navigates to the previous item with ArrowLeft", async () => {
      const user = userEvent.setup();
      render(
        <NavigationBar items={threeItems} defaultActiveKey="search" aria-label="Main navigation" />
      );
      screen.getByRole("tab", { name: /search/i }).focus();
      await user.keyboard("{ArrowLeft}");
      expect(document.activeElement).toBe(screen.getByRole("tab", { name: /home/i }));
    });

    test("navigates to the last item with End", async () => {
      const user = userEvent.setup();
      render(
        <NavigationBar items={threeItems} defaultActiveKey="home" aria-label="Main navigation" />
      );
      screen.getByRole("tab", { name: /home/i }).focus();
      await user.keyboard("{End}");
      expect(document.activeElement).toBe(screen.getByRole("tab", { name: /profile/i }));
    });

    test("navigates to the first item with Home", async () => {
      const user = userEvent.setup();
      render(
        <NavigationBar items={threeItems} defaultActiveKey="profile" aria-label="Main navigation" />
      );
      screen.getByRole("tab", { name: /profile/i }).focus();
      await user.keyboard("{Home}");
      expect(document.activeElement).toBe(screen.getByRole("tab", { name: /home/i }));
    });

    test("wraps from last to first item with ArrowRight", async () => {
      const user = userEvent.setup();
      render(
        <NavigationBar items={threeItems} defaultActiveKey="profile" aria-label="Main navigation" />
      );
      screen.getByRole("tab", { name: /profile/i }).focus();
      await user.keyboard("{ArrowRight}");
      expect(document.activeElement).toBe(screen.getByRole("tab", { name: /home/i }));
    });
  });

  // ── Accessibility ──────────────────────────────────────────────────────────

  describe("Accessibility", () => {
    test("has no axe violations", async () => {
      const { container } = render(
        <NavigationBar items={threeItems} defaultActiveKey="home" aria-label="Main navigation" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("outer element has role='navigation'", () => {
      render(
        <NavigationBar items={threeItems} defaultActiveKey="home" aria-label="Main navigation" />
      );
      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });

    test("nav element has descriptive aria-label", () => {
      render(
        <NavigationBar items={threeItems} defaultActiveKey="home" aria-label="Main navigation" />
      );
      const nav = screen.getByRole("navigation");
      expect(nav).toHaveAttribute("aria-label", "Main navigation");
    });

    test("inner container has role='tablist'", () => {
      render(
        <NavigationBar items={threeItems} defaultActiveKey="home" aria-label="Main navigation" />
      );
      expect(screen.getByRole("tablist")).toBeInTheDocument();
    });

    test("each item has role='tab'", () => {
      render(
        <NavigationBar items={threeItems} defaultActiveKey="home" aria-label="Main navigation" />
      );
      const tabs = screen.getAllByRole("tab");
      expect(tabs).toHaveLength(3);
    });

    test("active item has aria-selected='true'", () => {
      render(
        <NavigationBar items={threeItems} defaultActiveKey="search" aria-label="Main navigation" />
      );
      expect(screen.getByRole("tab", { name: /search/i })).toHaveAttribute("aria-selected", "true");
    });

    test("inactive items have aria-selected='false'", () => {
      render(
        <NavigationBar items={threeItems} defaultActiveKey="home" aria-label="Main navigation" />
      );
      expect(screen.getByRole("tab", { name: /search/i })).toHaveAttribute(
        "aria-selected",
        "false"
      );
      expect(screen.getByRole("tab", { name: /profile/i })).toHaveAttribute(
        "aria-selected",
        "false"
      );
    });

    test("icon-only items require aria-label for accessibility", () => {
      const iconOnlyItems: NavigationBarItemConfig[] = [
        { key: "home", icon: <HomeIcon />, "aria-label": "Home" },
        { key: "search", icon: <SearchIcon />, "aria-label": "Search" },
        { key: "profile", icon: <ProfileIcon />, "aria-label": "Profile" },
      ];
      render(
        <NavigationBar
          items={iconOnlyItems}
          defaultActiveKey="home"
          aria-label="Main navigation"
          hideLabels
        />
      );
      const tabs = screen.getAllByRole("tab");
      tabs.forEach((tab) => {
        expect(tab.getAttribute("aria-label") ?? tab.textContent).toBeTruthy();
      });
    });
  });

  // ── Disabled Items ─────────────────────────────────────────────────────────

  describe("Disabled items", () => {
    test("disabled item has aria-disabled attribute", () => {
      const itemsWithDisabled: NavigationBarItemConfig[] = [
        { key: "home", icon: <HomeIcon />, label: "Home" },
        { key: "search", icon: <SearchIcon />, label: "Search", isDisabled: true },
        { key: "profile", icon: <ProfileIcon />, label: "Profile" },
      ];
      render(
        <NavigationBar
          items={itemsWithDisabled}
          defaultActiveKey="home"
          aria-label="Main navigation"
        />
      );
      const disabledTab = screen.getByRole("tab", { name: /search/i });
      expect(disabledTab).toHaveAttribute("aria-disabled", "true");
    });

    test("disabled item cannot be activated by click", async () => {
      const user = userEvent.setup();
      const onActiveChange = vi.fn();
      const itemsWithDisabled: NavigationBarItemConfig[] = [
        { key: "home", icon: <HomeIcon />, label: "Home" },
        { key: "search", icon: <SearchIcon />, label: "Search", isDisabled: true },
        { key: "profile", icon: <ProfileIcon />, label: "Profile" },
      ];
      render(
        <NavigationBar
          items={itemsWithDisabled}
          defaultActiveKey="home"
          onActiveChange={onActiveChange}
          aria-label="Main navigation"
        />
      );
      await user.click(screen.getByRole("tab", { name: /search/i }));
      expect(onActiveChange).not.toHaveBeenCalledWith("search");
      expect(screen.getByRole("tab", { name: /home/i })).toHaveAttribute("aria-selected", "true");
    });
  });

  // ── Item Count Constraint ──────────────────────────────────────────────────

  describe("Item count constraint", () => {
    test("emits console.warn in dev when fewer than 3 items are provided", () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const twoItems: NavigationBarItemConfig[] = [
        { key: "home", icon: <HomeIcon />, label: "Home" },
        { key: "search", icon: <SearchIcon />, label: "Search" },
      ];
      render(
        <NavigationBar items={twoItems} defaultActiveKey="home" aria-label="Main navigation" />
      );
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("NavigationBar"));
      warnSpy.mockRestore();
    });

    test("emits console.warn in dev when more than 5 items are provided", () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const sixItems: NavigationBarItemConfig[] = [
        ...fiveItems,
        { key: "extra", icon: <HomeIcon />, label: "Extra" },
      ];
      render(
        <NavigationBar items={sixItems} defaultActiveKey="home" aria-label="Main navigation" />
      );
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("NavigationBar"));
      warnSpy.mockRestore();
    });
  });
});

// ─── NavigationBarItem (standalone) ──────────────────────────────────────────

describe("NavigationBarItem", () => {
  test("renders icon and label", () => {
    render(<NavigationBarItem icon={<HomeIcon />} label="Home" itemKey="home" />);
    expect(screen.getByTestId("home-icon")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  test("hides label when hideLabels is true", () => {
    render(<NavigationBarItem icon={<HomeIcon />} label="Home" itemKey="home" hideLabels />);
    expect(screen.queryByText("Home")).not.toBeInTheDocument();
  });

  test("shows active indicator pill when isActive is true", () => {
    render(<NavigationBarItem icon={<HomeIcon />} label="Home" itemKey="home" isActive />);
    const item = screen.getByRole("button");
    expect(item.querySelector("[data-indicator-pill]")).toHaveAttribute("data-active", "true");
  });

  test("applies custom className", () => {
    render(
      <NavigationBarItem icon={<HomeIcon />} label="Home" itemKey="home" className="custom" />
    );
    expect(screen.getByRole("button")).toHaveClass("custom");
  });
});

// ─── HeadlessNavigationBar ────────────────────────────────────────────────────

describe("HeadlessNavigationBar", () => {
  test("renders a nav element with role='navigation'", () => {
    render(
      <HeadlessNavigationBar
        items={threeItems}
        defaultSelectedKey="home"
        aria-label="Test navigation"
        renderItem={(config) => (
          <HeadlessNavigationBarItem key={config.key} itemKey={config.key}>
            {config.label}
          </HeadlessNavigationBarItem>
        )}
      />
    );
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  test("renders a div with role='tablist' inside nav", () => {
    render(
      <HeadlessNavigationBar
        items={threeItems}
        defaultSelectedKey="home"
        aria-label="Test navigation"
        renderItem={(config) => (
          <HeadlessNavigationBarItem key={config.key} itemKey={config.key}>
            {config.label}
          </HeadlessNavigationBarItem>
        )}
      />
    );
    expect(screen.getByRole("tablist")).toBeInTheDocument();
  });

  test("applies aria-label to the nav element", () => {
    render(
      <HeadlessNavigationBar
        items={threeItems}
        defaultSelectedKey="home"
        aria-label="Custom label"
        renderItem={(config) => (
          <HeadlessNavigationBarItem key={config.key} itemKey={config.key}>
            {config.label}
          </HeadlessNavigationBarItem>
        )}
      />
    );
    expect(screen.getByRole("navigation")).toHaveAttribute("aria-label", "Custom label");
  });

  test("renders without styles (no visual classes enforced)", () => {
    render(
      <HeadlessNavigationBar
        items={threeItems}
        defaultSelectedKey="home"
        aria-label="Test navigation"
        renderItem={(config) => (
          <HeadlessNavigationBarItem key={config.key} itemKey={config.key}>
            {config.label}
          </HeadlessNavigationBarItem>
        )}
      />
    );
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(3);
  });

  test("passes selectedKey correctly in controlled mode", () => {
    render(
      <HeadlessNavigationBar
        items={threeItems}
        selectedKey="profile"
        onSelectionChange={() => {}}
        aria-label="Test navigation"
        renderItem={(config) => (
          <HeadlessNavigationBarItem key={config.key} itemKey={config.key}>
            {config.label}
          </HeadlessNavigationBarItem>
        )}
      />
    );
    expect(screen.getByRole("tab", { name: /profile/i })).toHaveAttribute("aria-selected", "true");
  });
});
