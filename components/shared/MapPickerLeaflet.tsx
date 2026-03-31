"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import type { LatLng } from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default icon paths in Next.js
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

// Inner component: handles clicks on the map
function ClickHandler({
  onMapClick,
}: {
  onMapClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export interface MapPickerLeafletProps {
  lat: number | null;
  lng: number | null;
  centerLat: number;
  centerLng: number;
  onChange: (lat: number, lng: number) => void;
}

export default function MapPickerLeaflet({
  lat,
  lng,
  centerLat,
  centerLng,
  onChange,
}: MapPickerLeafletProps) {
  const markerRef = useRef<import("leaflet").Marker | null>(null);
  const iconsFixed = useRef(false);

  useEffect(() => {
    if (!iconsFixed.current) {
      fixLeafletIcons();
      iconsFixed.current = true;
    }
  }, []);

  const center: [number, number] = [centerLat, centerLng];
  const markerPos: [number, number] | null =
    lat !== null && lng !== null ? [lat, lng] : null;

  function handleDragEnd() {
    if (markerRef.current) {
      const pos: LatLng = markerRef.current.getLatLng();
      onChange(pos.lat, pos.lng);
    }
  }

  return (
    <MapContainer
      center={markerPos ?? center}
      zoom={13}
      minZoom={8}
      maxZoom={18}
      style={{ height: "100%", width: "100%", borderRadius: "12px" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickHandler onMapClick={onChange} />
      {markerPos && (
        <Marker
          position={markerPos}
          draggable
          ref={markerRef}
          eventHandlers={{ dragend: handleDragEnd }}
        />
      )}
    </MapContainer>
  );
}
