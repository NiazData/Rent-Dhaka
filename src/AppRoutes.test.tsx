import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { AppRoutes } from "./AppRoutes";

function renderAt(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>
  );
}

describe("AppRoutes", () => {
  it("renders the home page at /", () => {
    renderAt("/");
    expect(screen.getByRole("heading", { name: /home/i })).toBeInTheDocument();
  });

  it("renders the listings page at /listings", () => {
    renderAt("/listings");
    expect(screen.getByRole("heading", { name: /listings/i })).toBeInTheDocument();
  });

  it("renders the listing detail page at /listings/:slug", () => {
    renderAt("/listings/some-slug");
    expect(screen.getByRole("heading", { name: /listing detail/i })).toBeInTheDocument();
  });

  it("renders the application page at /apply/:slug", () => {
    renderAt("/apply/some-slug");
    expect(screen.getByRole("heading", { name: /application/i })).toBeInTheDocument();
  });

  it("renders the property type page at /property-types/:type", () => {
    renderAt("/property-types/apartment");
    expect(screen.getByRole("heading", { name: /property type/i })).toBeInTheDocument();
  });

  it("renders the about page", () => {
    renderAt("/about");
    expect(screen.getByRole("heading", { name: /about/i })).toBeInTheDocument();
  });

  it("renders the contact page", () => {
    renderAt("/contact");
    expect(screen.getByRole("heading", { name: /contact/i })).toBeInTheDocument();
  });

  it("renders the privacy page", () => {
    renderAt("/privacy");
    expect(screen.getByRole("heading", { name: /privacy/i })).toBeInTheDocument();
  });

  it("renders the not found page for an unknown route", () => {
    renderAt("/nonexistent");
    expect(screen.getByRole("heading", { name: /page not found/i })).toBeInTheDocument();
  });
});
