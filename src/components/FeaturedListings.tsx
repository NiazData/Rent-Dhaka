import { getFeaturedListings } from "../lib/listings-repository";
import { ListingCard } from "./ListingCard";

export function FeaturedListings() {
  const listings = getFeaturedListings(3);

  return (
    <section aria-labelledby="featured-heading" className="mx-auto max-w-6xl px-4 py-12">
      <h2 id="featured-heading" className="text-2xl font-bold text-stone-900">
        Featured Listings
      </h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </section>
  );
}
