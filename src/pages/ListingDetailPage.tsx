import { useParams } from "react-router-dom";
import { useListing } from "../hooks/useListing";
import { formatBDT } from "../lib/format";
import { PhotoGallery } from "../components/PhotoGallery";
import { NotFoundMessage } from "../components/NotFoundMessage";
import { ListingsMapView } from "../components/ListingsMapView";

export default function ListingDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { listing, loading } = useListing(slug);

  if (loading) {
    return <p role="status" className="mx-auto max-w-5xl px-4 py-8">Loading listing…</p>;
  }

  if (!listing) {
    return (
      <NotFoundMessage
        heading="Listing not found"
        message="This listing may have been rented or removed. Browse current listings instead."
      />
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold text-stone-900">{listing.title}</h1>
      <p className="mt-1 text-stone-600">{listing.address}</p>

      <div className="mt-6">
        <PhotoGallery photos={listing.photos} alt={listing.title} />
      </div>

      <div className="mt-6 flex flex-wrap gap-6 border-y border-stone-200 py-4 text-stone-700">
        <p className="text-xl font-bold text-accent-700">
          {formatBDT(listing.rentBDT)}
          {listing.listingPurpose === "rent" ? "/mo" : ""}
        </p>
        <p>{listing.beds} beds</p>
        <p>{listing.baths} baths</p>
        <p>{listing.sqft} sqft</p>
        <p>Deposit: {formatBDT(listing.depositBDT)}</p>
      </div>

      <section className="mt-6">
        <h2 className="text-lg font-semibold text-stone-900">Amenities</h2>
        <ul className="mt-2 grid grid-cols-2 gap-1 text-sm text-stone-700">
          {listing.amenities.map((amenity) => (
            <li key={amenity}>• {amenity}</li>
          ))}
        </ul>
      </section>

      <section className="mt-6 text-sm text-stone-700">
        <h2 className="text-lg font-semibold text-stone-900">Details</h2>
        <p className="mt-2">Pet policy: {listing.petPolicy}</p>
        <p className="mt-1">Parking: {listing.parking}</p>
        <p className="mt-1">Utilities: {listing.utilitiesInfo}</p>
        <p className="mt-1">Lease terms: {listing.leaseTerms}</p>
      </section>

      <section className="mt-6">
        <h2 className="text-lg font-semibold text-stone-900">Location</h2>
        <div className="mt-2">
          <ListingsMapView listings={[listing]} />
        </div>
      </section>
    </div>
  );
}
