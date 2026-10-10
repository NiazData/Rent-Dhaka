import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

const OFFICE_POSITION: [number, number] = [23.7658, 90.361];

export function OfficeMap() {
  return (
    <MapContainer center={OFFICE_POSITION} zoom={15} style={{ height: "300px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={OFFICE_POSITION}>
        <Popup>Iman Homes Office — Road 4, Mohammadpur</Popup>
      </Marker>
    </MapContainer>
  );
}
