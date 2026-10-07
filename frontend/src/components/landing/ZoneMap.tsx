import { MapContainer, TileLayer, Circle, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet with Vite
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Arguenos coordinates
const ARGUENOS_CENTER: [number, number] = [43.0217, 0.7306];
const RADIUS_METERS = 20000; // 20km

export function ZoneMap() {
  return (
    <div className="h-96 w-full overflow-hidden rounded-2xl border-2 border-sage-soft shadow-lg">
      <MapContainer
        center={ARGUENOS_CENTER}
        zoom={11}
        scrollWheelZoom={false}
        className="h-full w-full"
        style={{ zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 20km radius circle */}
        <Circle
          center={ARGUENOS_CENTER}
          radius={RADIUS_METERS}
          pathOptions={{
            color: "#4E6B50",
            fillColor: "#8FA98F",
            fillOpacity: 0.15,
            weight: 2,
          }}
        />

        {/* Center marker */}
        <Marker position={ARGUENOS_CENTER}>
          <Popup>
            <div className="font-sans">
              <p className="font-semibold text-forest">Arguenos (31160)</p>
              <p className="text-sm text-ink-muted">Centre de la zone d'intervention</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
