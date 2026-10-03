import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { getListings, parseListingFiltersFromSearchParams } from "../lib/listings-repository";
import { ListingCard } from "../components/ListingCard";
import { ListingFilterSidebar } from "../components/ListingFilterSidebar";
import { EmptyListingsState } from "../components/EmptyListingsState";
import type { ListingFilters } from "../types";

export default function ListingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo(() => parseListingFiltersFromSearchParams(searchParams), [searchParams]);
  const listings = useMemo(() => getListings(filters), [filters]);

  function handleFiltersChange(next: ListingFilters) {
    const params = new URLSearchParams();
    Object.entries(next).forEach(([key, value]) => {
      if (value !== undefined) params.set(key, String(value));
    });
    setSearchParams(params);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold text-stone-900">Listings</h1>
      <div className="mt-6 flex flex-col gap-6 md:flex-row">
        <ListingFilterSidebar filters={filters} onChange={handleFiltersChange} />
        <div className="flex-1">
          {listings.length === 0 ? (
            <EmptyListingsState />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
