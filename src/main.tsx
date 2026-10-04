import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import App from "./App";
import "leaflet/dist/leaflet.css";
import "./index.css";

// Leaflet's icon path auto-detection breaks once Vite bundles its CSS/images,
// so point the default marker icon at the bundled asset URLs explicitly.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
