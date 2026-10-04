import { describe, expect, it } from "vitest";
import { listings } from "./listings";

describe("listings seed data", () => {
  it("has at least 5 listings", () => {
    expect(listings.length).toBeGreaterThanOrEqual(5);
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
      expect(listing.photos.every((photo) => !photo.includes("unsplash.com"))).toBe(true);
      expect(listing.amenities.length).toBeGreaterThan(0);
      expect(Number.isNaN(new Date(listing.availableFrom).getTime())).toBe(false);
      expect(listing.lat).toBeGreaterThan(23.6);
      expect(listing.lat).toBeLessThan(23.9);
      expect(listing.lng).toBeGreaterThan(90.3);
      expect(listing.lng).toBeLessThan(90.5);
    }
  });

  it("covers all three listing purposes", () => {
    const purposes = new Set(listings.map((l) => l.listingPurpose));
    expect(purposes).toEqual(new Set(["rent", "sale", "builder"]));
  });

  it("has at least 2 real photos for every sale and builder listing", () => {
    const nonRentListings = listings.filter((l) => l.listingPurpose !== "rent");
    for (const listing of nonRentListings) {
      expect(listing.photos.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("has no photos for rent listings since none have been supplied yet", () => {
    const rentListings = listings.filter((l) => l.listingPurpose === "rent");
    for (const listing of rentListings) {
      expect(listing.photos).toEqual([]);
    }
  });
});
