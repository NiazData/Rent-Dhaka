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
    const result = getListings({ area: "dhanmondi" });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((l) => l.area.toLowerCase() === "dhanmondi")).toBe(true);
  });

  it("filters by minimum beds", () => {
    const result = getListings({ minBeds: 4 });
    expect(result.every((l) => l.beds >= 4)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("filters by property type", () => {
    const result = getListings({ propertyType: "condo" });
    expect(result.every((l) => l.propertyType === "condo")).toBe(true);
    expect(result.length).toBeGreaterThan(0);
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
    const listing = getListingBySlug("gulshan-2-modern-apartment");
    expect(listing?.title).toBe("Modern 3-Bedroom Apartment in Gulshan 2");
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
});
