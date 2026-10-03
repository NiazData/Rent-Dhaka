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

    const mainNav = within(screen.getByRole("navigation", { name: /main/i }));
    expect(mainNav.getByRole("link", { name: /^home$/i })).toBeInTheDocument();
    expect(mainNav.getByRole("link", { name: /listings/i })).toBeInTheDocument();
    expect(mainNav.getByRole("link", { name: /about/i })).toBeInTheDocument();
    expect(mainNav.getByRole("link", { name: /contact/i })).toBeInTheDocument();

    expect(screen.getByText("Page Content")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });
});
