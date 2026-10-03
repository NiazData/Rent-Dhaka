import { describe, expect, it } from "vitest";
import { listings } from "./listings";

describe("listings seed data", () => {
  it("has at least 8 listings", () => {
    expect(listings.length).toBeGreaterThanOrEqual(8);
  });

  it("has unique slugs", () => {
    const slugs = listings.map((listing) => listing.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("has valid, plausible fields for every listing", () => {
    for (const listing of listings) {
      expect(listing.rentBDT).toBeGreaterThan(0);
      expect(listing.depositBDT).toBeGreaterThanOrEqual(0);
      expect(listing.beds).toBeGreaterThanOrEqual(0);
      expect(listing.baths).toBeGreaterThanOrEqual(0);
      expect(listing.sqft).toBeGreaterThan(0);
      expect(listing.photos.length).toBeGreaterThanOrEqual(2);
      expect(listing.amenities.length).toBeGreaterThan(0);
      expect(Number.isNaN(new Date(listing.availableFrom).getTime())).toBe(false);
      expect(listing.lat).toBeGreaterThan(23.6);
      expect(listing.lat).toBeLessThan(23.9);
      expect(listing.lng).toBeGreaterThan(90.3);
      expect(listing.lng).toBeLessThan(90.5);
    }
  });

  it("includes at least one listing with no pets allowed and one that allows pets", () => {
    const noPets = listings.some((l) => l.petPolicy.toLowerCase().includes("no pets"));
    const petsOk = listings.some((l) => !l.petPolicy.toLowerCase().includes("no pets"));
    expect(noPets).toBe(true);
    expect(petsOk).toBe(true);
  });

  it("covers all four property types", () => {
    const types = new Set(listings.map((l) => l.propertyType));
    expect(types).toEqual(new Set(["apartment", "single-family", "condo", "townhome"]));
  });
});
