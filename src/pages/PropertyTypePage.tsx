import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { getPropertyTypeInfo } from "../lib/content-repository";
import { useListings } from "../hooks/useListings";
import { ListingCard } from "../components/ListingCard";
import { NotFoundMessage } from "../components/NotFoundMessage";
import type { ListingFilters } from "../types";

export default function PropertyTypePage() {
  const { type } = useParams<{ type: string }>();
  const info = type ? getPropertyTypeInfo(type) : undefined;
  const filters = useMemo<ListingFilters>(
    () => (info ? { propertyType: info.type, listingPurpose: "rent" } : {}),
    [info]
  );
  const { listings, loading } = useListings(filters);

  if (!info) {
    return (
      <NotFoundMessage
        heading="Property type not found"
        message="We don't have a page for that property type. Browse all listings instead."
      />
    );
  }

  return (
    <div>
      <section className="bg-accent-50 px-4 py-12 text-center">
        <h1 className="text-3xl font-bold text-stone-900">{info.title}</h1>
        <p className="mx-auto mt-3 max-w-2xl text-stone-600">{info.description}</p>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-xl font-semibold text-stone-900">Featured Listings</h2>
        {loading ? (
          <p role="status" className="mt-6">
            Loading listings…
          </p>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
