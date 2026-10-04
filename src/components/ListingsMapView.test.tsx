import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { ListingsMapView } from "./ListingsMapView";
import type { Listing } from "../types";

vi.mock("react-leaflet", () => ({
  MapContainer: ({ children }: { children: ReactNode }) => (
    <div data-testid="map-container">{children}</div>
  ),
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ children }: { children?: ReactNode }) => <div data-testid="marker">{children}</div>,
  Popup: ({ children }: { children: ReactNode }) => <div data-testid="popup">{children}</div>,
}));

const sampleListings: Listing[] = [
  {
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
    listingPurpose: "rent",
    petPolicy: "Cats and small dogs allowed",
    parking: "1 covered space",
    amenities: ["Generator backup"],
    utilitiesInfo: "Water included",
    leaseTerms: "12-month lease",
    photos: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c"],
    lat: 23.7925,
    lng: 90.4078,
  },
  {
    id: "l3",
    slug: "banani-executive-condo",
    title: "Executive 3-Bedroom Condo in Banani",
    address: "Road 11, Banani",
    area: "Banani",
    rentBDT: 85000,
    depositBDT: 170000,
    beds: 3,
    baths: 3,
    sqft: 1850,
    availableFrom: "2026-11-15",
    propertyType: "condo",
    listingPurpose: "rent",
    petPolicy: "Cats only",
    parking: "1 covered space",
    amenities: ["Swimming pool"],
    utilitiesInfo: "Service charge included",
    leaseTerms: "12-month lease",
    photos: ["https://images.unsplash.com/photo-1600210492486-724fe5c67fb0"],
    lat: 23.7937,
    lng: 90.4066,
  },
];

describe("ListingsMapView", () => {
  it("renders one marker per listing", () => {
    render(
      <MemoryRouter>
        <ListingsMapView listings={sampleListings} />
      </MemoryRouter>
    );

    expect(screen.getByTestId("map-container")).toBeInTheDocument();
    expect(screen.getAllByTestId("marker")).toHaveLength(2);
    expect(screen.getByText("Modern 3-Bedroom Apartment in Gulshan 2")).toBeInTheDocument();
  });
});
