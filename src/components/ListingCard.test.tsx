import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { ListingCard } from "./ListingCard";
import type { Listing } from "../types";

const sampleListing: Listing = {
  id: "l1",
  slug: "gulshan-2-modern-apartment",
  title: "Modern 3-Bedroom Apartment in Gulshan 2",
  address: "House 14, Road 103, Gulshan 2",
  area: "Gulshan 2",
  rentBDT: 55000,
  depositBDT: 110000,
  beds: 3,
  baths: 2,
  sqft: 1600,
  availableFrom: "2026-11-01",
  propertyType: "apartment",
  petPolicy: "Cats and small dogs allowed",
  parking: "1 covered space",
  amenities: ["Generator backup"],
  utilitiesInfo: "Water included",
  leaseTerms: "12-month lease",
  photos: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c"],
  lat: 23.7925,
  lng: 90.4078,
};

describe("ListingCard", () => {
  it("renders the listing title, formatted rent, and a link to its detail page", () => {
    render(
      <MemoryRouter>
        <ListingCard listing={sampleListing} />
      </MemoryRouter>
    );

    expect(screen.getByText(sampleListing.title)).toBeInTheDocument();
    expect(screen.getByText("৳55,000/mo")).toBeInTheDocument();
    expect(screen.getByText(/3 beds • 2 baths • 1600 sqft/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /view details/i })).toHaveAttribute(
      "href",
      "/listings/gulshan-2-modern-apartment"
    );
  });
});
