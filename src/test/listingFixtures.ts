import type { Listing } from "../types";

export const FLAT_A: Listing = {
  id: "id-1",
  slug: "bosila-garden-city-flat-a",
  title: "Flat A : 3 Bedroom Apartment in Bosila Garden City, Mohammadpur",
  address: "Floor No. 3, House No. 33, Road No. 1, Block G, Bosila Garden City, Mohammadpur, Dhaka 1207",
  area: "Bosila, Mohammadpur",
  rentBDT: 12000,
  depositBDT: 12000,
  beds: 3,
  baths: 2,
  sqft: 1080,
  availableFrom: "2026-11-01",
  propertyType: "apartment",
  listingPurpose: "rent",
  petPolicy: "N/A",
  parking: "N/A",
  amenities: ["Lift", "Generator backup"],
  utilitiesInfo: "Separate utility meters",
  leaseTerms: "12-month lease",
  photos: [],
  lat: 23.7601,
  lng: 90.3451,
};

export const FLAT_B: Listing = {
  ...FLAT_A,
  id: "id-2",
  slug: "bosila-garden-city-flat-b",
  title: "Flat B : 3 Bedroom Apartment in Bosila Garden City, Mohammadpur",
  rentBDT: 15000,
  depositBDT: 15000,
};

export const FLAT_C: Listing = {
  ...FLAT_A,
  id: "id-3",
  slug: "bosila-garden-city-flat-c",
  title: "Flat C : 3 Bedroom Apartment in Bosila Garden City, Mohammadpur",
  rentBDT: 15000,
  depositBDT: 15000,
};

export const SALE_LISTING: Listing = {
  id: "id-9",
  slug: "mohammadpur-apartment-for-sale",
  title: "3 Bedroom Apartment for Sale in Mohammadpur",
  address: "Mohammadpur, Dhaka 1207",
  area: "Mohammadpur",
  rentBDT: 4400000,
  depositBDT: 0,
  beds: 3,
  baths: 2,
  sqft: 1080,
  availableFrom: "2026-11-01",
  propertyType: "apartment",
  listingPurpose: "sale",
  petPolicy: "N/A",
  parking: "1 covered space for an additional payment",
  amenities: ["Lift", "Generator backup"],
  utilitiesInfo: "Separate utility meters",
  leaseTerms: "Freehold, ready for registration",
  photos: ["/images/sell/buy1.jpeg", "/images/sell/buy2.jpeg"],
  lat: 23.7658,
  lng: 90.361,
};

export const BUILDER_LISTING: Listing = {
  id: "id-12",
  slug: "rampura-ready-apartment-builder",
  title: "Ready 3-Bedroom Apartment by City Builders in Rampura",
  address: "Central Rampura, Dhaka 1219",
  area: "Rampura",
  rentBDT: 8200000,
  depositBDT: 0,
  beds: 3,
  baths: 2,
  sqft: 1350,
  availableFrom: "2026-10-25",
  propertyType: "apartment",
  listingPurpose: "builder",
  petPolicy: "N/A",
  parking: "1 covered space",
  amenities: ["Lift", "24/7 security", "Generator backup"],
  utilitiesInfo: "Separate utility meters",
  leaseTerms: "Ready for handover, registration assisted",
  photos: ["/images/connect-builders/connect-builders.jpeg"],
  lat: 23.758,
  lng: 90.426,
};

export const ALL_LISTINGS: Listing[] = [FLAT_A, FLAT_B, FLAT_C, SALE_LISTING, BUILDER_LISTING];
