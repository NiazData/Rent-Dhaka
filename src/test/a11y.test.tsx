import type { ReactNode } from "react";
import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import HomePage from "../pages/HomePage";
import ListingsPage from "../pages/ListingsPage";
import ListingDetailPage from "../pages/ListingDetailPage";
import AboutPage from "../pages/AboutPage";
import ContactPage from "../pages/ContactPage";

vi.mock("react-leaflet", () => ({
  MapContainer: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  TileLayer: () => <div />,
  Marker: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
  Popup: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock("../lib/netlify-forms", () => ({
  submitTourRequest: vi.fn(),
  submitApplication: vi.fn(),
}));

describe("accessibility", () => {
  it("Home page has no axe violations", async () => {
    const { container } = render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Listings page has no axe violations", async () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/listings"]}>
        <ListingsPage />
      </MemoryRouter>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Listing detail page has no axe violations", async () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/listings/gulshan-2-modern-apartment"]}>
        <Routes>
          <Route path="/listings/:slug" element={<ListingDetailPage />} />
        </Routes>
      </MemoryRouter>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("About page has no axe violations", async () => {
    const { container } = render(<AboutPage />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Contact page has no axe violations", async () => {
    const { container } = render(<ContactPage />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
