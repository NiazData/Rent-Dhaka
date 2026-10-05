import { vi } from "vitest";
import type { Listing } from "../types";

type Row = Record<string, unknown> & { id: string };
type Pending = { type: "update"; changes: Record<string, unknown> } | { type: "delete" } | undefined;

function listingToRow(listing: Listing): Row {
  return {
    id: listing.id,
    slug: listing.slug,
    title: listing.title,
    address: listing.address,
    area: listing.area,
    rent_bdt: listing.rentBDT,
    deposit_bdt: listing.depositBDT,
    beds: listing.beds,
    baths: listing.baths,
    sqft: listing.sqft,
    available_from: listing.availableFrom,
    property_type: listing.propertyType,
    listing_purpose: listing.listingPurpose,
    pet_policy: listing.petPolicy,
    parking: listing.parking,
    amenities: listing.amenities,
    utilities_info: listing.utilitiesInfo,
    lease_terms: listing.leaseTerms,
    photos: listing.photos,
    lat: listing.lat,
    lng: listing.lng,
    virtual_tour_url: listing.virtualTourUrl ?? null,
  };
}

/**
 * A chainable fake for the Supabase query builder, seeded from plain
 * Listing fixtures. Supports select/eq/order/limit/insert/update/delete
 * so the real (unmocked) listings-repository filtering logic can run
 * against it in page-level tests, instead of re-implementing filters
 * inside each test's mock.
 */
export function createFakeListingsSupabase(initialListings: Listing[]) {
  let rows: Row[] = initialListings.map(listingToRow);

  function makeBuilder(view: Row[], pending: Pending = undefined) {
    const builder = {
      select: vi.fn(() => makeBuilder(view, pending)),
      eq: vi.fn((column: string, value: unknown) => {
        const matched = view.filter((row) => row[column] === value);
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
