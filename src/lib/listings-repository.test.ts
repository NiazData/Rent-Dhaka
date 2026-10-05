import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createListing,
  deleteListing,
  getFeaturedListings,
  getListingBySlug,
  getListings,
  parseListingFiltersFromSearchParams,
  updateListing,
} from "./listings-repository";
import type { ListingInput } from "../types";

const FIXTURE_ROWS = [
  {
    id: "id-1",
    slug: "bosila-garden-city-flat-a",
    title: "Flat A : 3 Bedroom Apartment in Bosila Garden City, Mohammadpur",
    address: "Floor No. 3, House No. 33, Road No. 1, Block G, Bosila Garden City, Mohammadpur, Dhaka 1207",
    area: "Bosila, Mohammadpur",
    rent_bdt: 12000,
    deposit_bdt: 12000,
    beds: 3,
    baths: 2,
    sqft: 1080,
    available_from: "2026-11-01",
    property_type: "apartment",
    listing_purpose: "rent",
    pet_policy: "N/A",
    parking: "N/A",
    amenities: ["Lift", "Generator backup"],
    utilities_info: "Separate utility meters",
    lease_terms: "12-month lease",
    photos: [],
    lat: 23.7601,
    lng: 90.3451,
    virtual_tour_url: null,
  },
  {
    id: "id-9",
    slug: "mohammadpur-apartment-for-sale",
    title: "3 Bedroom Apartment for Sale in Mohammadpur",
    address: "Mohammadpur, Dhaka 1207",
    area: "Mohammadpur",
    rent_bdt: 4400000,
    deposit_bdt: 0,
    beds: 3,
    baths: 2,
    sqft: 1080,
    available_from: "2026-11-01",
    property_type: "apartment",
    listing_purpose: "sale",
    pet_policy: "N/A",
    parking: "1 covered space for an additional taka payment",
    amenities: ["Lift", "Generator backup"],
    utilities_info: "Separate utility meters",
    lease_terms: "Freehold, ready for registration",
    photos: ["/images/sell/buy1.jpeg", "/images/sell/buy2.jpeg"],
    lat: 23.7658,
    lng: 90.361,
    virtual_tour_url: null,
  },
  {
    id: "id-12",
    slug: "rampura-ready-apartment-builder",
    title: "Ready 3-Bedroom Apartment by City Builders in Rampura",
    address: "Central Rampura, Dhaka 1219",
    area: "Rampura",
    rent_bdt: 8200000,
    deposit_bdt: 0,
    beds: 3,
    baths: 2,
    sqft: 1350,
    available_from: "2026-10-25",
    property_type: "apartment",
    listing_purpose: "builder",
    pet_policy: "N/A",
    parking: "1 covered space",
    amenities: ["Lift", "24/7 security", "Generator backup"],
    utilities_info: "Separate utility meters",
    lease_terms: "Ready for handover, registration assisted",
    photos: ["/images/connect-builders/connect-builders.jpeg"],
    lat: 23.758,
    lng: 90.426,
    virtual_tour_url: null,
  },
];

type Row = (typeof FIXTURE_ROWS)[number];
type Pending = { type: "update"; changes: Record<string, unknown> } | { type: "delete" } | undefined;

function createFakeTable(initialRows: Row[]) {
  let rows = initialRows;

  function makeBuilder(view: Row[], pending: Pending = undefined) {
    const builder = {
      select: vi.fn(() => makeBuilder(view, pending)),
      eq: vi.fn((column: string, value: unknown) => {
        const matched = view.filter((row) => (row as Record<string, unknown>)[column] === value);
        const matchedIds = matched.map((row) => row.id);

        if (pending?.type === "update") {
          rows = rows.map((row) =>
            matchedIds.includes(row.id) ? ({ ...row, ...pending.changes } as Row) : row
          );
          return makeBuilder(rows.filter((row) => matchedIds.includes(row.id)));
        }
        if (pending?.type === "delete") {
          rows = rows.filter((row) => !matchedIds.includes(row.id));
          return makeBuilder([]);
        }
        return makeBuilder(matched);
      }),
      order: vi.fn(() => makeBuilder(view, pending)),
      limit: vi.fn((n: number) => makeBuilder(view.slice(0, n), pending)),
      insert: vi.fn((row: Record<string, unknown>) => {
        const created = { id: `id-${rows.length + 1}`, ...row } as Row;
        rows = [...rows, created];
        return makeBuilder([created]);
      }),
      update: vi.fn((changes: Record<string, unknown>) => makeBuilder(view, { type: "update", changes })),
      delete: vi.fn(() => makeBuilder(view, { type: "delete" })),
      single: vi.fn(() =>
        Promise.resolve({ data: view[0] ?? null, error: view[0] ? null : new Error("not found") })
      ),
      maybeSingle: vi.fn(() => Promise.resolve({ data: view[0] ?? null, error: null })),
      then: (onFulfilled: (v: { data: unknown; error: null }) => unknown) =>
        Promise.resolve({ data: view, error: null }).then(onFulfilled),
    };
    return builder;
  }

  return {
    from: vi.fn(() => makeBuilder(rows)),
  };
}

const { supabaseMock, setFrom } = vi.hoisted(() => {
  let currentFrom: ((...args: unknown[]) => unknown) | undefined;
  return {
    supabaseMock: {
      from: (...args: unknown[]) => currentFrom?.(...args),
    },
    setFrom: (fromFn: (...args: unknown[]) => unknown) => {
      currentFrom = fromFn;
    },
  };
});

vi.mock("./supabase", () => ({
  LISTINGS_TABLE: "listings",
  LISTING_PHOTOS_PREFIX: "listings",
  SITE_IMAGES_BUCKET: "site-images",
  supabase: supabaseMock,
}));

beforeEach(() => {
  setFrom(createFakeTable(FIXTURE_ROWS.map((row) => ({ ...row }))).from);
});

describe("getListings", () => {
  it("returns all listings when no filters are given", async () => {
    expect(await getListings()).toHaveLength(3);
  });

  it("filters by minimum rent", async () => {
    const result = await getListings({ minRentBDT: 80000 });
    expect(result.every((l) => l.rentBDT >= 80000)).toBe(true);
    expect(result).toHaveLength(2);
  });

  it("filters by maximum rent", async () => {
    const result = await getListings({ maxRentBDT: 30000 });
    expect(result.every((l) => l.rentBDT <= 30000)).toBe(true);
    expect(result).toHaveLength(1);
  });

  it("filters by area, case-insensitively", async () => {
    const result = await getListings({ area: "bosila" });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((l) => l.area.toLowerCase().includes("bosila"))).toBe(true);
  });

  it("filters by minimum beds, returning none when no listing matches", async () => {
    const result = await getListings({ minBeds: 4 });
    expect(result).toEqual([]);
  });

  it("filters by property type, returning none when no listing matches", async () => {
    const result = await getListings({ propertyType: "condo" });
    expect(result).toEqual([]);
  });

  it("filters by listing purpose", async () => {
    const forSale = await getListings({ listingPurpose: "sale" });
    expect(forSale.every((l) => l.listingPurpose === "sale")).toBe(true);
    expect(forSale.length).toBeGreaterThan(0);

    const byBuilder = await getListings({ listingPurpose: "builder" });
    expect(byBuilder.every((l) => l.listingPurpose === "builder")).toBe(true);
    expect(byBuilder.length).toBeGreaterThan(0);

    const forRent = await getListings({ listingPurpose: "rent" });
    expect(forRent.every((l) => l.listingPurpose === "rent")).toBe(true);
    expect(forRent.length).toBeGreaterThan(0);
  });

  it("filters out listings that explicitly disallow pets when petsAllowed is true", async () => {
    const result = await getListings({ petsAllowed: true });
    expect(result.every((l) => !l.petPolicy.toLowerCase().includes("no pets"))).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("combines multiple filters as an intersection", async () => {
    const result = await getListings({ propertyType: "apartment", maxRentBDT: 30000 });
    expect(result.every((l) => l.propertyType === "apartment" && l.rentBDT <= 30000)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("returns an empty array when no listing matches", async () => {
    const result = await getListings({ minRentBDT: 999999999 });
    expect(result).toEqual([]);
  });
});

describe("getListingBySlug", () => {
  it("returns the matching listing", async () => {
    const listing = await getListingBySlug("bosila-garden-city-flat-a");
    expect(listing?.title).toBe("Flat A : 3 Bedroom Apartment in Bosila Garden City, Mohammadpur");
  });

  it("returns undefined for an unknown slug", async () => {
    expect(await getListingBySlug("does-not-exist")).toBeUndefined();
  });
});

describe("getFeaturedListings", () => {
  it("returns the requested number of listings", async () => {
    expect(await getFeaturedListings(2)).toHaveLength(2);
  });

  it("defaults to 3 when no limit is given", async () => {
    expect(await getFeaturedListings()).toHaveLength(3);
  });
});

describe("createListing, updateListing, deleteListing", () => {
  const newListing: ListingInput = {
    slug: "test-flat-d",
    title: "Flat D",
    address: "Test address",
    area: "Test area",
    rentBDT: 20000,
    depositBDT: 20000,
    beds: 2,
    baths: 1,
    sqft: 900,
    availableFrom: "2026-12-01",
    propertyType: "apartment",
    listingPurpose: "rent",
    petPolicy: "N/A",
    parking: "N/A",
    amenities: ["Lift"],
    utilitiesInfo: "N/A",
    leaseTerms: "12-month lease",
    photos: [],
    lat: 23.76,
    lng: 90.36,
  };

  it("creates a new listing and makes it retrievable", async () => {
    const created = await createListing(newListing);
    expect(created.slug).toBe("test-flat-d");

    const found = await getListingBySlug("test-flat-d");
    expect(found?.title).toBe("Flat D");
  });

  it("updates an existing listing's fields", async () => {
    const updated = await updateListing("id-1", { ...newListing, slug: "bosila-garden-city-flat-a", title: "Flat A Updated" });
    expect(updated.title).toBe("Flat A Updated");

    const found = await getListingBySlug("bosila-garden-city-flat-a");
    expect(found?.title).toBe("Flat A Updated");
  });

  it("deletes a listing so it's no longer retrievable", async () => {
    await deleteListing("id-1");
    expect(await getListingBySlug("bosila-garden-city-flat-a")).toBeUndefined();
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
