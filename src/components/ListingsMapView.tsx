import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { Link } from "react-router-dom";
import type { Listing } from "../types";
import { formatBDT } from "../lib/format";

const DHAKA_CENTER: [number, number] = [23.8103, 90.4125];

export function ListingsMapView({ listings }: { listings: Listing[] }) {
  return (
    <MapContainer center={DHAKA_CENTER} zoom={12} style={{ height: "500px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {listings.map((listing) => (
        <Marker key={listing.id} position={[listing.lat, listing.lng]}>
          <Popup>
            <p className="font-semibold">{listing.title}</p>
            <p>{formatBDT(listing.rentBDT)}/mo</p>
            <Link to={`/listings/${listing.slug}`}>View details</Link>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
