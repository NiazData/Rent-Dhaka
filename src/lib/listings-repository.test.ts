import { describe, expect, it } from "vitest";
import {
  getFeaturedListings,
  getListingBySlug,
  getListings,
  parseListingFiltersFromSearchParams,
} from "./listings-repository";
import { listings } from "../data/listings";

describe("getListings", () => {
  it("returns all listings when no filters are given", () => {
    expect(getListings()).toHaveLength(listings.length);
  });

  it("filters by minimum rent", () => {
    const result = getListings({ minRentBDT: 80000 });
    expect(result.every((l) => l.rentBDT >= 80000)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result.length).toBeLessThan(listings.length);
  });

  it("filters by maximum rent", () => {
    const result = getListings({ maxRentBDT: 30000 });
    expect(result.every((l) => l.rentBDT <= 30000)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("filters by area, case-insensitively", () => {
    const result = getListings({ area: "bosila" });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((l) => l.area.toLowerCase().includes("bosila"))).toBe(true);
  });

  it("filters by area using a partial match, so 'Mohammadpur' finds every Mohammadpur-area listing", () => {
    const result = getListings({ area: "Mohammadpur" });
    expect(result).toHaveLength(4);
  });

  it("still narrows to a specific sub-area when one is given", () => {
    const result = getListings({ area: "bosila" });
    expect(result).toHaveLength(3);
  });

  it("filters by minimum beds, returning none when no listing matches", () => {
    const result = getListings({ minBeds: 4 });
    expect(result).toEqual([]);
  });

  it("filters by property type, returning none when no listing matches", () => {
    const result = getListings({ propertyType: "condo" });
    expect(result).toEqual([]);
  });

  it("filters by listing purpose", () => {
    const forSale = getListings({ listingPurpose: "sale" });
    expect(forSale.every((l) => l.listingPurpose === "sale")).toBe(true);
    expect(forSale.length).toBeGreaterThan(0);

    const byBuilder = getListings({ listingPurpose: "builder" });
    expect(byBuilder.every((l) => l.listingPurpose === "builder")).toBe(true);
    expect(byBuilder.length).toBeGreaterThan(0);

    const forRent = getListings({ listingPurpose: "rent" });
    expect(forRent.every((l) => l.listingPurpose === "rent")).toBe(true);
    expect(forRent.length).toBeGreaterThan(0);
  });

  it("filters out listings that explicitly disallow pets when petsAllowed is true", () => {
    const result = getListings({ petsAllowed: true });
    expect(result.every((l) => !l.petPolicy.toLowerCase().includes("no pets"))).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("combines multiple filters as an intersection", () => {
    const result = getListings({ propertyType: "apartment", maxRentBDT: 30000 });
    expect(
      result.every((l) => l.propertyType === "apartment" && l.rentBDT <= 30000)
    ).toBe(true);
  });

  it("returns an empty array when no listing matches", () => {
    const result = getListings({ minRentBDT: 999999999 });
    expect(result).toEqual([]);
  });
});

describe("getListingBySlug", () => {
  it("returns the matching listing", () => {
    const listing = getListingBySlug("bosila-garden-city-flat-a");
    expect(listing?.title).toBe("Flat A — 3 Bedroom Apartment in Bosila Garden City, Mohammadpur");
  });

  it("returns undefined for an unknown slug", () => {
    expect(getListingBySlug("does-not-exist")).toBeUndefined();
  });
});

describe("getFeaturedListings", () => {
  it("returns the requested number of listings", () => {
    expect(getFeaturedListings(3)).toHaveLength(3);
  });

  it("defaults to 3 when no limit is given", () => {
    expect(getFeaturedListings()).toHaveLength(3);
  });
});

describe("parseListingFiltersFromSearchParams", () => {
  it("parses all known filter keys", () => {
    const params = new URLSearchParams(
      "minRentBDT=20000&maxRentBDT=80000&area=Gulshan+2&minBeds=2&minBaths=1&propertyType=apartment&petsAllowed=true&availableBy=2026-12-01"
    );
    expect(parseListingFiltersFromSearchParams(params)).toEqual({
      minRentBDT: 20000,
      maxRentBDT: 80000,
      area: "Gulshan 2",
      minBeds: 2,
      minBaths: 1,
      propertyType: "apartment",
      petsAllowed: true,
      availableBy: "2026-12-01",
    });
  });

  it("omits keys that are absent from the search params", () => {
    const params = new URLSearchParams("propertyType=condo");
    expect(parseListingFiltersFromSearchParams(params)).toEqual({ propertyType: "condo" });
  });

  it("returns an empty object for empty search params", () => {
    expect(parseListingFiltersFromSearchParams(new URLSearchParams())).toEqual({});
  });

  it("omits invalid propertyType values", () => {
    const params = new URLSearchParams("propertyType=mansion");
    expect(parseListingFiltersFromSearchParams(params)).toEqual({});
  });

  it("parses a valid listingPurpose value", () => {
    const params = new URLSearchParams("listingPurpose=sale");
    expect(parseListingFiltersFromSearchParams(params)).toEqual({ listingPurpose: "sale" });
  });

  it("omits invalid listingPurpose values", () => {
    const params = new URLSearchParams("listingPurpose=lease-to-own");
    expect(parseListingFiltersFromSearchParams(params)).toEqual({});
  });
});
