import { Link } from "react-router-dom";
import type { Listing } from "../types";
import { formatBDT } from "../lib/format";
import { Card, CardContent } from "./ui/card";

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Card>
      <img
        src={listing.photos[0]}
        alt={listing.title}
        className="h-48 w-full rounded-t-lg bg-stone-100 object-contain"
      />
      <CardContent>
        <h3 className="text-base font-semibold text-stone-900">{listing.title}</h3>
        <p className="text-sm text-stone-600">{listing.area}</p>
        <p className="mt-2 text-lg font-bold text-accent-700">
          {formatBDT(listing.rentBDT)}
          {listing.listingPurpose === "rent" ? "/mo" : ""}
        </p>
        <p className="mt-1 text-sm text-stone-600">
          {listing.beds} beds • {listing.baths} baths • {listing.sqft} sqft
        </p>
        <Link
          to={`/listings/${listing.slug}`}
          className="mt-3 inline-block text-sm font-medium text-accent-600 underline"
        >
          View details
        </Link>
      </CardContent>
    </Card>
  );
}
