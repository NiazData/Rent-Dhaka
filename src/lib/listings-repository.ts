import { listings } from "../data/listings";
import type { Listing, ListingFilters, PropertyType } from "../types";

const VALID_PROPERTY_TYPES: PropertyType[] = ["apartment", "single-family", "condo", "townhome"];

export function getListings(filters: ListingFilters = {}): Listing[] {
  return listings.filter((listing) => {
    if (filters.minRentBDT !== undefined && listing.rentBDT < filters.minRentBDT) return false;
    if (filters.maxRentBDT !== undefined && listing.rentBDT > filters.maxRentBDT) return false;
    if (filters.area && listing.area.toLowerCase() !== filters.area.toLowerCase()) return false;
    if (filters.minBeds !== undefined && listing.beds < filters.minBeds) return false;
    if (filters.minBaths !== undefined && listing.baths < filters.minBaths) return false;
    if (filters.propertyType && listing.propertyType !== filters.propertyType) return false;
    if (filters.petsAllowed && listing.petPolicy.toLowerCase().includes("no pets")) return false;
    if (
      filters.availableBy &&
      new Date(listing.availableFrom).getTime() > new Date(filters.availableBy).getTime()
    ) {
      return false;
    }
    return true;
  });
}

export function getListingBySlug(slug: string): Listing | undefined {
  return listings.find((listing) => listing.slug === slug);
}

export function getFeaturedListings(limit = 3): Listing[] {
  return listings.slice(0, limit);
}

export function parseListingFiltersFromSearchParams(params: URLSearchParams): ListingFilters {
  const filters: ListingFilters = {};

  const minRentBDT = params.get("minRentBDT");
  const maxRentBDT = params.get("maxRentBDT");
  const area = params.get("area");
  const minBeds = params.get("minBeds");
  const minBaths = params.get("minBaths");
  const propertyType = params.get("propertyType");
  const petsAllowed = params.get("petsAllowed");
  const availableBy = params.get("availableBy");

  if (minRentBDT !== null) filters.minRentBDT = Number(minRentBDT);
  if (maxRentBDT !== null) filters.maxRentBDT = Number(maxRentBDT);
  if (area !== null) filters.area = area;
  if (minBeds !== null) filters.minBeds = Number(minBeds);
  if (minBaths !== null) filters.minBaths = Number(minBaths);
  if (propertyType !== null && VALID_PROPERTY_TYPES.includes(propertyType as PropertyType)) {
    filters.propertyType = propertyType as PropertyType;
  }
  if (petsAllowed !== null) filters.petsAllowed = petsAllowed === "true";
  if (availableBy !== null) filters.availableBy = availableBy;

  return filters;
}
