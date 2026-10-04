import { render, screen, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { Layout } from "./Layout";

describe("Layout", () => {
  it("renders header nav, a skip link, and footer around the routed page", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<div>Page Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: /skip to content/i })).toHaveAttribute(
      "href",
      "#main-content"
    );

    expect(screen.getByRole("link", { name: /^rent dhaka$/i })).toHaveAttribute("href", "/");

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
      businessNav.getByRole("link", { name: /barakah property solutions/i })
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
    expect(mainNav.getByRole("link", { name: /login \/ sign up/i })).toHaveAttribute(
      "href",
      "/login"
    );

    expect(screen.getByText("Page Content")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("links to every property-type page from the footer", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<div>Page Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

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
