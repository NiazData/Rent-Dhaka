import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getListings, parseListingFiltersFromSearchParams } from "../lib/listings-repository";
import { ListingCard } from "../components/ListingCard";
import { ListingFilterSidebar } from "../components/ListingFilterSidebar";
import { ListingsMapView } from "../components/ListingsMapView";
import { EmptyListingsState } from "../components/EmptyListingsState";
import { ConnectBuildersGallery } from "../components/ConnectBuildersGallery";
import { Button } from "../components/ui/button";
import type { ListingFilters, ListingPurpose } from "../types";

const PURPOSE_HEADINGS: Record<ListingPurpose, string> = {
  rent: "Properties for Rent",
  sale: "Properties for Sale",
  builder: "Ready-Built Properties by Builders",
};

export default function ListingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [view, setView] = useState<"list" | "map">("list");
  const filters = useMemo(() => parseListingFiltersFromSearchParams(searchParams), [searchParams]);
  const listings = useMemo(() => getListings(filters), [filters]);
  const heading = filters.listingPurpose ? PURPOSE_HEADINGS[filters.listingPurpose] : "Listings";

  function handleFiltersChange(next: ListingFilters) {
    const params = new URLSearchParams();
    Object.entries(next).forEach(([key, value]) => {
      if (value !== undefined) params.set(key, String(value));
    });
    setSearchParams(params);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-900">{heading}</h1>
        <div role="group" aria-label="View toggle" className="flex gap-2">
          <Button
            variant={view === "list" ? "primary" : "outline"}
            size="sm"
            onClick={() => setView("list")}
          >
            List
          </Button>
          <Button
            variant={view === "map" ? "primary" : "outline"}
            size="sm"
            onClick={() => setView("map")}
          >
            Map
          </Button>
        </div>
      </div>
      {filters.listingPurpose === "builder" && <ConnectBuildersGallery />}
      <div className="mt-6 flex flex-col gap-6 md:flex-row">
        <ListingFilterSidebar filters={filters} onChange={handleFiltersChange} />
        <div className="flex-1">
          <h2 className="sr-only">Search results</h2>
          {listings.length === 0 ? (
            <EmptyListingsState />
          ) : view === "list" ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <ListingsMapView listings={listings} />
          )}
        </div>
      </div>
    </div>
  );
}
