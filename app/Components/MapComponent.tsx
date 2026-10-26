"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import mapboxgl from "mapbox-gl";

type Position = [number, number];

type TournamentFormData = {
  title: string;
  description: string;
  tournamentType: string;
  startDate: string;
  endDate: string;
  entryFee: string;
  latitude: string;
  longitude: string;
  imageUrl: string;
  location: string;
  adminFeePercentage: string;
};

interface MapProps {
  setFormData: Dispatch<SetStateAction<TournamentFormData>>;
  setSelectedPosition: Dispatch<SetStateAction<Position | null>>;
  selectedPosition: Position | null;
  setIsMapOpen: Dispatch<SetStateAction<boolean>>;
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

const DEFAULT_CENTER: [number, number] = [69.3451, 30.3753];

function isValidCoordinates(lat: number, lng: number): boolean {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

async function getAddress(
  lat: number,
  lng: number,
  token: string,
): Promise<string> {
  const fallback = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

  const url = new URL("https://api.mapbox.com/search/geocode/v6/reverse");

  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lng));
  url.searchParams.set("access_token", token);
  url.searchParams.set("language", "en");

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error("Unable to fetch address");
  }

  const data = await response.json();

  const properties = data.features?.[0]?.properties;
  const context = properties?.context;

  const city =
    context?.place?.name ??
    context?.locality?.name ??
    context?.district?.name ??
    properties?.name;

  const state = context?.region?.name;
  const country = context?.country?.name;

  return [city, state, country].filter(Boolean).join(", ") || fallback;
}

export default function MapComponent({
  setFormData,
  setSelectedPosition,
  selectedPosition,
  setIsMapOpen,
}: MapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  const requestIdRef = useRef(0);
  const locationRequestRef = useRef(0);

  const [showPermissionPopup, setShowPermissionPopup] = useState(false);

  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

  const updateMarker = useCallback((lat: number, lng: number) => {
    const map = mapRef.current;

    if (!map) return;

    if (!markerRef.current) {
      markerRef.current = new mapboxgl.Marker({
        color: "#ef4444",
      }).addTo(map);
    }

    markerRef.current.setLngLat([lng, lat]);

    map.flyTo({
      center: [lng, lat],
      zoom: 15,
      essential: true,
    });
  }, []);

  // Location save karein aur map close karein
  const selectLocation = useCallback(
    (lat: number, lng: number) => {
      if (!isValidCoordinates(lat, lng)) return;

      const requestId = ++requestIdRef.current;
      const fallbackAddress = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

      setSelectedPosition([lat, lng]);

      setFormData((prev) => ({
        ...prev,
        latitude: String(lat),
        longitude: String(lng),
        location: fallbackAddress,
      }));

      // Map immediately close
      setIsMapOpen(false);

      // Readable address background mein fetch karein
      if (MAPBOX_TOKEN) {
        void getAddress(lat, lng, MAPBOX_TOKEN)
          .then((address) => {
            if (requestId !== requestIdRef.current) return;

            setFormData((prev) => ({
              ...prev,
              latitude: String(lat),
              longitude: String(lng),
              location: address,
            }));
          })
          .catch((error) => {
            console.error("Address fetch error:", error);
          });
      }
    },
    [setFormData, setSelectedPosition, setIsMapOpen],
  );

  const selectLocationRef = useRef(selectLocation);

  useEffect(() => {
    selectLocationRef.current = selectLocation;
  }, [selectLocation]);

  // Map initialize karein
  useEffect(() => {
    if (!mapContainerRef.current || !MAPBOX_TOKEN) {
      return;
    }

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const hasValidPosition =
      selectedPosition !== null &&
      isValidCoordinates(selectedPosition[0], selectedPosition[1]);

    const initialCenter: [number, number] = hasValidPosition
      ? [selectedPosition[1], selectedPosition[0]]
      : DEFAULT_CENTER;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: initialCenter,
      zoom: hasValidPosition ? 15 : 5,
    });

    mapRef.current = map;

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    if (hasValidPosition) {
      markerRef.current = new mapboxgl.Marker({
        color: "#ef4444",
      })
        .setLngLat(initialCenter)
        .addTo(map);
    }

    map.on("click", (event) => {
      const { lat, lng } = event.lngLat;
      selectLocationRef.current(lat, lng);
    });

    map.on("error", (event) => {
      console.error("Mapbox error:", event.error);
    });

    return () => {
      markerRef.current?.remove();
      markerRef.current = null;

      map.remove();
      mapRef.current = null;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Marker sync karein
  useEffect(() => {
    if (
      !selectedPosition ||
      !isValidCoordinates(selectedPosition[0], selectedPosition[1])
    ) {
      return;
    }

    updateMarker(selectedPosition[0], selectedPosition[1]);
  }, [selectedPosition, updateMarker]);

  // Browser se actual location request karein
  const requestCurrentLocation = () => {
    setLocationError("");

    if (!window.isSecureContext) {
      setLocationError(
        "Location access ke liye HTTPS ya localhost required hai.",
      );
      return;
    }

    if (!navigator.geolocation) {
      setLocationError("Your browser does not support geolocation.");
      return;
    }

    const requestId = ++locationRequestRef.current;

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (requestId !== locationRequestRef.current) return;

        setLocationLoading(false);
        setShowPermissionPopup(false);
        setLocationError("");

        const { latitude, longitude } = position.coords;

        selectLocation(latitude, longitude);
      },
      (error) => {
        if (requestId !== locationRequestRef.current) return;

        setLocationLoading(false);

        if (error.code === error.PERMISSION_DENIED) {
          setLocationError(
            "Location access is blocked by your browser. The ON button can request permission again, but it cannot automatically enable a previously blocked permission.",
          );
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setLocationError(
            "Your current location is unavailable. Please enable Location Services on your device.",
          );
        } else if (error.code === error.TIMEOUT) {
          setLocationError("Location request timed out. Please try again.");
        } else {
          setLocationError(error.message || "Unable to get your location.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      },
    );
  };

  const getCurrentLocation = () => {
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Location is available — do NOT open Windows Settings
        setShowPermissionPopup(false);

        const { latitude, longitude } = position.coords;

        selectLocation(latitude, longitude);
      },
      (error) => {
        console.error("Location error:", error);

        if (
          error.code === error.POSITION_UNAVAILABLE ||
          error.code === error.TIMEOUT
        ) {
          // Location could be OFF — try opening Windows Settings
          window.location.href = "ms-settings:privacy-location";
        } else if (error.code === error.PERMISSION_DENIED) {
          setLocationError(
            "Location permission is blocked. Please allow location access in your browser.",
          );
          setShowPermissionPopup(true);
        } else {
          setLocationError("Unable to get your current location.");
          setShowPermissionPopup(true);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      },
    );
  };

  // Main button par ON/OFF popup kholein
  // const getCurrentLocation = () => {
  //   window.location.href = "ms-settings:privacy-location";
  //   setLocationError("");
  //   setShowPermissionPopup(true);
  // };

  const turnLocationOff = () => {
    locationRequestRef.current += 1;
    setLocationLoading(false);
    setShowPermissionPopup(false);
    setLocationError("");
  };

  if (!MAPBOX_TOKEN) {
    return (
      <div className="p-4 text-red-600">
        Mapbox token is missing. Add NEXT_PUBLIC_MAPBOX_TOKEN to .env.local.
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {/* Current Location Button */}
      <button
        type="button"
        onClick={getCurrentLocation}
        className="self-start rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700"
      >
        📍 Use Current Location
      </button>

      {/* ON / OFF Popup */}
      {showPermissionPopup && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4"
          role="presentation"
          onClick={(event) => event.stopPropagation()}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="location-popup-title"
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 text-center">
              <div className="mb-3 text-4xl">📍</div>

              <h2
                id="location-popup-title"
                className="text-xl font-bold text-gray-900"
              >
                Enable Your Location
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                Do you want to use your current location?
              </p>
            </div>

            {locationError && (
              <p
                role="alert"
                className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600"
              >
                {locationError}
              </p>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={turnLocationOff}
                className="rounded-xl bg-gray-200 px-5 py-3 font-semibold text-gray-800 hover:bg-gray-300"
              >
                OFF
              </button>

              <button
                type="button"
                onClick={requestCurrentLocation}
                disabled={locationLoading}
                className="rounded-xl bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
              >
                {locationLoading ? "Loading..." : "ON"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Map */}
      <div
        ref={mapContainerRef}
        className="h-[650px] w-full overflow-hidden rounded-xl border"
      />
    </div>
  );
}