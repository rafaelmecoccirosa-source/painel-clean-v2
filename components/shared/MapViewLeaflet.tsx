"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function fixLeafletIcons() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const L = require("leaflet");
  delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  });
}

interface Props {
  lat: number;
  lng: number;
  zoom?: number;
}

export default function MapViewLeaflet({ lat, lng, zoom = 14 }: Props) {
  const fixed = useRef(false);

  useEffect(() => {
    if (!fixed.current) {
      fixLeafletIcons();
      fixed.current = true;
    }
  }, []);

  const pos: [number, number] = [lat, lng];

  return (
    <MapContainer
      center={pos}
      zoom={zoom}
      minZoom={8}
      maxZoom={18}
      scrollWheelZoom={false}
      zoomControl={true}
      style={{ height: "100%", width: "100%", borderRadius: "12px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={pos} />
    </MapContainer>
  );
}
