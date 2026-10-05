import { useEffect, useState } from "react";
import { getFeaturedListings } from "../lib/listings-repository";
import { ListingCard } from "./ListingCard";
import type { Listing } from "../types";

export function FeaturedListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getFeaturedListings(3).then((result) => {
      if (!active) return;
      setListings(result);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section aria-labelledby="featured-heading" className="mx-auto max-w-6xl px-4 py-12">
      <h2 id="featured-heading" className="text-2xl font-bold text-stone-900">
        Featured Listings
      </h2>
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
  );
}
