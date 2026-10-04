import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

const OFFICE_POSITION: [number, number] = [23.7925, 90.4078];

export function OfficeMap() {
  return (
    <MapContainer center={OFFICE_POSITION} zoom={15} style={{ height: "300px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={OFFICE_POSITION}>
        <Popup>Rent Dhaka Office — House 14, Road 103, Gulshan 2</Popup>
      </Marker>
    </MapContainer>
  );
}
