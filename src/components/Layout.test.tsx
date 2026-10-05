import { render, screen, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { Layout } from "./Layout";

const { authMock } = vi.hoisted(() => ({
  authMock: {
    getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
    onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
    signOut: vi.fn().mockResolvedValue({ error: null }),
  },
}));

vi.mock("../lib/supabase", () => ({
  SITE_IMAGES_BUCKET: "site-images",
  LISTINGS_TABLE: "listings",
  LISTING_PHOTOS_PREFIX: "listings",
  supabase: { auth: authMock },
}));

function renderLayout() {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<div>Page Content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe("Layout", () => {
  it("renders header nav, a skip link, and footer around the routed page", async () => {
    renderLayout();

    expect(screen.getByRole("link", { name: /skip to content/i })).toHaveAttribute(
      "href",
      "#main-content"
    );

    const businessNav = within(screen.getByRole("navigation", { name: /business lines/i }));
    expect(businessNav.getByRole("link", { name: /^rent$/i })).toHaveAttribute(
      "href",
      "/listings?listingPurpose=rent"
    );
    expect(businessNav.getByRole("link", { name: /^sell$/i })).toHaveAttribute(
      "href",
      "/listings?listingPurpose=sale"
    );
    expect(
      businessNav.getByRole("link", { name: /barakah property management/i })
    ).toHaveAttribute("href", "/barakah-property-solutions");
    expect(businessNav.getByRole("link", { name: /barakahaid/i })).toHaveAttribute(
      "href",
      "/barakahaid"
    );
    expect(businessNav.getByRole("link", { name: /connect builders/i })).toHaveAttribute(
      "href",
      "/listings?listingPurpose=builder"
    );

    const mainNav = within(screen.getByRole("navigation", { name: /^main$/i }));
    expect(mainNav.getByRole("link", { name: /about/i })).toBeInTheDocument();
    expect(mainNav.getByRole("link", { name: /contact/i })).toBeInTheDocument();
    expect(await mainNav.findByRole("link", { name: /login \/ sign up/i })).toHaveAttribute(
      "href",
      "/login"
    );

    expect(screen.getByText("Page Content")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("shows an Admin Panel link instead of Login / Sign Up when an admin session exists", async () => {
    authMock.getSession.mockResolvedValueOnce({ data: { session: { user: { id: "admin-1" } } } });
    renderLayout();

    const mainNav = within(screen.getByRole("navigation", { name: /^main$/i }));
    expect(await mainNav.findByRole("link", { name: /admin panel/i })).toHaveAttribute(
      "href",
      "/admin"
    );
    expect(mainNav.queryByRole("link", { name: /login \/ sign up/i })).not.toBeInTheDocument();
  });

  it("links to every property-type page from the footer", () => {
    renderLayout();

    const typeNav = within(screen.getByRole("navigation", { name: /browse by property type/i }));
    const hrefs = typeNav.getAllByRole("link").map((link) => link.getAttribute("href"));
    expect(hrefs).toEqual([
      "/property-types/apartment",
      "/property-types/single-family",
      "/property-types/condo",
      "/property-types/townhome",
    ]);
  });
});
