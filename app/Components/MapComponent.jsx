"use client";

import { MapContainer, TileLayer, useMapEvents, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

/* -----------------------------
   Click Handler
------------------------------*/
function LocationSelector({
  setFormData,
  setSelectedPosition,
  setIsMapOpen,
}) {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;

      setSelectedPosition([lat, lng]);

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=en`
        );

        const data = await res.json();
        const addr = data.address || {};

        const address = [
          addr.city || addr.town || addr.village || addr.suburb || addr.county,
          addr.state,
          addr.country,
        ]
          .filter(Boolean)
          .join(", ");

        setFormData((prev) => ({
          ...prev,
          location: address,
          latitude: lat,
          longitude: lng,
        }));

        // ✅ CLOSE MAP AFTER SELECT
        if (setIsMapOpen) setIsMapOpen(false);
      } catch (err) {
        console.log("Reverse geocode error", err);
      }
    },
  });

  return null;
}

/* -----------------------------
   MAIN COMPONENT
------------------------------*/
export default function MapComponent({
  setFormData,
  setSelectedPosition,
  selectedPosition,
  setIsMapOpen,
}) {
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      setSelectedPosition([lat, lng]);

      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=en`
      );

      const data = await res.json();
      const addr = data.address || {};

      const address = [
        addr.city || addr.town || addr.village || addr.suburb || addr.county,
        addr.state,
        addr.country,
      ]
        .filter(Boolean)
        .join(", ");

      setFormData((prev) => ({
        ...prev,
        location: address,
        latitude: lat,
        longitude: lng,
      }));
    });
  };

  return (
    <div className="h-full w-full">
      <button
        type="button"
        onClick={getCurrentLocation}
        className="mb-3 px-3 py-2 bg-green-600 text-white rounded"
      >
        📍 Use Current Location
      </button>

      <MapContainer
        center={selectedPosition || [30.3753, 69.3451]}
        zoom={5}
        className="h-[450px] w-full rounded-lg"
      >
        <TileLayer url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png" />

        <LocationSelector
          setFormData={setFormData}
          setSelectedPosition={setSelectedPosition}
          setIsMapOpen={setIsMapOpen}
        />

        {selectedPosition && <Marker position={selectedPosition} />}
      </MapContainer>
    </div>
  );
}