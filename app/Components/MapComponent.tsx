"use client";

import { useEffect, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import mapboxgl from "mapbox-gl";

type Position = [number, number]; // [latitude, longitude]

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

interface MapboxFeature {
  geometry?: { coordinates?: number[] };
  properties?: {
    feature_type?: string;
    name?: string;
    full_address?: string;
    place_formatted?: string;
    context?: {
      address?: { name?: string };
      street?: { name?: string };
      neighborhood?: { name?: string };
      locality?: { name?: string };
      place?: { name?: string };
      district?: { name?: string };
      region?: { name?: string };
      postcode?: { name?: string };
      country?: { name?: string };
    };
  };
}

interface MapboxGeocodingResponse {
  features?: MapboxFeature[];
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";
const DEFAULT_CENTER: [number, number] = [69.3451, 30.3753]; // [lng, lat]

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
  _token: string,
): Promise<string> {
  try {
    const response = await fetch(`/api/reverse-geocode?lat=${lat}&lng=${lng}`);

    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.status}`);
    }

    const data: { address?: string } = await response.json();

    return data.address?.trim() || "";
  } catch (error) {
    console.error("Google address lookup error:", error);
    return "";
  }
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
  const locationRequestRef = useRef(0);
  const autoLocationStartedRef = useRef(false);
  const [showPermissionPopup, setShowPermissionPopup] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState<MapboxFeature[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const searchAbortRef = useRef<AbortController | null>(null);
  const [preview, setPreview] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);

  useEffect(() => {
    const query = searchText.trim();
    if (query.length < 3) {
      setSuggestions([]);
      setSearchLoading(false);
      return;
    }
    const controller = new AbortController();
    searchAbortRef.current?.abort();
    searchAbortRef.current = controller;
    const timer = window.setTimeout(async () => {
      setSearchLoading(true);
      setSearchError("");
      try {
        const url = new URL("https://api.mapbox.com/search/geocode/v6/forward");
        url.searchParams.set("q", query);
        url.searchParams.set("access_token", MAPBOX_TOKEN);
        url.searchParams.set("autocomplete", "true");
        url.searchParams.set("limit", "6");
        url.searchParams.set("language", "en");
        const response = await fetch(url.toString(), {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Search failed (${response.status})`);
        const data: MapboxGeocodingResponse = await response.json();
        if (!controller.signal.aborted) setSuggestions(data.features ?? []);
      } catch (error) {
        if (!controller.signal.aborted) {
          setSuggestions([]);
          setSearchError(
            error instanceof Error ? error.message : "Search unavailable",
          );
        }
      } finally {
        if (!controller.signal.aborted) setSearchLoading(false);
      }
    }, 350);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [searchText]);

  // Preview selection on the map; only Confirm Location updates the tournament form.
  const moveMarkerAndZoom = (latitude: number, longitude: number) => {
    const lat = Number(latitude);
    const lng = Number(longitude);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      console.error("Invalid marker coordinates:", { lat, lng });
      return;
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      console.error("Coordinates out of range:", { lat, lng });
      return;
    }

    const map = mapRef.current;
    if (!map) return;

    const coordinates: [number, number] = [lng, lat];

    if (!markerRef.current) {
      markerRef.current = new mapboxgl.Marker({
        color: "#ef4444",
      });
    }

    markerRef.current.setLngLat(coordinates);

    // Add marker only after valid coordinates have been assigned
    if (!markerRef.current.getElement().isConnected) {
      markerRef.current.addTo(map);
    }

    map.stop();

    map.flyTo({
      center: coordinates,
      zoom: 17,
      essential: true,
    });
  };

  const showPreview = (lat: number, lng: number, address: string) => {
    if (!isValidCoordinates(lat, lng)) return;

    setPreview({ lat, lng, address });
    moveMarkerAndZoom(lat, lng);
  };
  const resolveAndSave = async (lat: number, lng: number) => {
    if (!isValidCoordinates(lat, lng)) return;

    const requestId = ++locationRequestRef.current;

    setPreview(null);
    setLocationLoading(true);
    setLocationError("");

    // Move marker and zoom immediately
    moveMarkerAndZoom(lat, lng);

    const address = await getAddress(lat, lng, MAPBOX_TOKEN);

    if (requestId !== locationRequestRef.current) return;

    setLocationLoading(false);

    if (!address) {
      setLocationError(
        "Address lookup failed. Coordinates are available to confirm.",
      );
    }

    setPreview({
      lat,
      lng,
      address: address || `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
    });
  };

  const chooseSuggestion = (feature: MapboxFeature) => {
    const coords = feature.geometry?.coordinates;

    if (!coords || coords.length < 2) return;

    const lng = Number(coords[0]);
    const lat = Number(coords[1]);

    if (!isValidCoordinates(lat, lng)) return;

    const props = feature.properties;

    const address =
      props?.full_address ||
      [props?.name, props?.place_formatted].filter(Boolean).join(", ");

    setSearchText("");
    setSuggestions([]);
    setSearchLoading(false);
    setLocationError("");

    // Cancel previous address requests
    ++locationRequestRef.current;

    if (address) {
      setLocationLoading(false);
      showPreview(lat, lng, address);
    } else {
      void resolveAndSave(lat, lng);
    }
  };

  const confirmLocation = () => {
    if (!preview?.address.trim()) return;
    ++locationRequestRef.current;
    setSelectedPosition([preview.lat, preview.lng]);
    setFormData((previous) => ({
      ...previous,
      latitude: String(preview.lat),
      longitude: String(preview.lng),
      location: preview.address,
    }));
    setIsMapOpen(false);
  };

  const resolveAndSaveRef = useRef(resolveAndSave);
  useEffect(() => {
    resolveAndSaveRef.current = resolveAndSave;
  });

  useEffect(() => {
    if (!mapContainerRef.current || !MAPBOX_TOKEN) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;
    const savedLat = Number(selectedPosition?.[0]);
    const savedLng = Number(selectedPosition?.[1]);
    const hasPosition =
      selectedPosition !== null && isValidCoordinates(savedLat, savedLng);
    const center: mapboxgl.LngLatLike = hasPosition
      ? { lng: savedLng, lat: savedLat }
      : DEFAULT_CENTER;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center,
      zoom: hasPosition ? 17 : 5,
    });
    mapRef.current = map;
    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    if (hasPosition) {
      markerRef.current = new mapboxgl.Marker({ color: "#ef4444" })
        .setLngLat(center)
        .addTo(map);
    }
    map.on("load", () => {
      map.resize();
    });

    map.on("click", ({ lngLat }) => {
      void resolveAndSaveRef.current(lngLat.lat, lngLat.lng);
    });
    map.on("error", (event) => console.error("Mapbox error:", event.error));
    return () => {
      markerRef.current?.remove();
      markerRef.current = null;
      map.remove();
      mapRef.current = null;
    };
    // Map initialized once per mount; click handler uses the latest callback ref.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      !selectedPosition ||
      !isValidCoordinates(selectedPosition[0], selectedPosition[1])
    )
      return;
    const map = mapRef.current;
    if (!map) return;
    const lat = Number(selectedPosition[0]);
    const lng = Number(selectedPosition[1]);
    if (!isValidCoordinates(lat, lng)) return;
    if (!markerRef.current) {
      markerRef.current = new mapboxgl.Marker({
        color: "#ef4444",
      })
        .setLngLat([lng, lat])
        .addTo(map);
    } else {
      markerRef.current.setLngLat([lng, lat]);
    }
    map.flyTo({ center: { lng, lat }, zoom: 17, essential: true });
  }, [selectedPosition]);

  // Try GPS once each time this map component mounts. A late GPS response
  // must not override a search result, map click, or manual location request.
  useEffect(() => {
    if (!MAPBOX_TOKEN || autoLocationStartedRef.current) return;
    autoLocationStartedRef.current = true;

    if (!window.isSecureContext || !navigator.geolocation) return;

    let cancelled = false;
    const startingRequestId = locationRequestRef.current;

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        if (cancelled || startingRequestId !== locationRequestRef.current)
          return;
        void resolveAndSaveRef.current(coords.latitude, coords.longitude);
      },
      (error) => {
        if (!cancelled && startingRequestId === locationRequestRef.current) {
          console.info("Automatic location unavailable:", error.message);
          // Do not block searching with the ON/OFF popup on initial load.
        }
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 },
    );

    return () => {
      cancelled = true;
      autoLocationStartedRef.current = false;
    };
  }, []);

  const requestCurrentLocation = () => {
    setLocationError("");
    if (!window.isSecureContext) {
      setLocationError("Location access requires HTTPS or localhost.");
      setShowPermissionPopup(true);
      return;
    }
    if (!navigator.geolocation) {
      setLocationError("Your browser does not support geolocation.");
      setShowPermissionPopup(true);
      return;
    }
    const requestId = ++locationRequestRef.current;
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (requestId !== locationRequestRef.current) return;
        const { latitude, longitude } = position.coords;
        setShowPermissionPopup(false);
        void resolveAndSaveRef.current(latitude, longitude);
      },
      (error) => {
        if (requestId !== locationRequestRef.current) return;
        setLocationLoading(false);
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError(
            "Location permission blocked. Allow location in your browser's site settings, then try again.",
          );
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setLocationError(
            "Location unavailable. Enable device location services and try again.",
          );
        } else if (error.code === error.TIMEOUT) {
          setLocationError("Location request timed out. Please try again.");
        } else {
          setLocationError(error.message || "Unable to get current location.");
        }
        setShowPermissionPopup(true);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 },
    );
  };

  const turnLocationOff = () => {
    locationRequestRef.current += 1;
    setLocationLoading(false);
    setShowPermissionPopup(false);
    setLocationError("");
  };

  if (!MAPBOX_TOKEN) {
    return (
      <div className="p-4 text-red-600">
        Mapbox token is missing. Configure NEXT_PUBLIC_MAPBOX_TOKEN in
        .env.local and Vercel, then rebuild.
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-lg">
      {/* Map stays full width; existing Mapbox and geocoding logic is unchanged. */}
      <div ref={mapContainerRef} className="h-[600px] w-full sm:h-[680px]" />

      {/* Search panel */}
      <div className="pointer-events-none absolute inset-x-3 top-3 z-20 sm:inset-x-5 sm:top-5">
        <div className="pointer-events-auto mx-auto max-w-2xl rounded-2xl border border-white/80 bg-white/95 p-2 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className="relative min-w-0 flex-1">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                ⌕
              </span>
              <input
                type="search"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Search city, area, street or address..."
                aria-label="Search map location"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-9 pr-3 text-sm text-slate-900 outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
              />
              {suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-2xl">
                  {suggestions.map((feature, index) => (
                    <button
                      key={feature.properties?.full_address ?? index}
                      type="button"
                      onClick={() => chooseSuggestion(feature)}
                      className="block w-full border-b border-slate-100 px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-red-50 last:border-0"
                    >
                      {feature.properties?.full_address ||
                        [
                          feature.properties?.name,
                          feature.properties?.place_formatted,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={requestCurrentLocation}
              disabled={locationLoading}
              title="Use Current Location"
              className="flex shrink-0 items-center gap-2 rounded-xl bg-red-600 px-3 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-wait disabled:opacity-60 sm:px-4"
            >
              <span aria-hidden="true">⌖</span>
              <span className="hidden sm:inline">
                {locationLoading ? "Locating..." : "Current Location"}
              </span>
            </button>
          </div>
          {searchLoading && (
            <p className="px-2 pt-2 text-xs text-slate-500">
              Searching locations...
            </p>
          )}
          {searchError && (
            <p role="alert" className="px-2 pt-2 text-xs text-red-600">
              {searchError}
            </p>
          )}
        </div>
      </div>

      {/* Bottom address card: existing Confirm action is preserved. */}
      <div className="pointer-events-none absolute inset-x-3 bottom-3 z-20 sm:inset-x-5 sm:bottom-5">
        <div className="pointer-events-auto mx-auto max-w-3xl rounded-2xl border border-white/90 bg-white/95 p-4 shadow-2xl backdrop-blur-md sm:p-5">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-xl text-red-600">
              📍
            </div>
            <div className="min-w-0 flex-1">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Selected Location
              </p>
              <div className="min-h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-800">
                {preview?.address ||
                  (locationLoading
                    ? "Finding address..."
                    : "Search, use current location, or tap on the map")}
              </div>
            </div>
          </div>
          {locationError && !showPermissionPopup && (
            <p
              role="alert"
              className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {locationError}
            </p>
          )}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={confirmLocation}
              disabled={!preview?.address.trim() || locationLoading}
              className="rounded-xl bg-red-600 px-3 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Confirm Location
            </button>
            <button
              type="button"
              onClick={() => setIsMapOpen(false)}
              className="rounded-xl border border-slate-200 bg-slate-100 px-3 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      {showPermissionPopup && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="location-popup-title"
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="mb-4 text-center">
              <div className="mb-3 text-4xl">📍</div>
              <h2
                id="location-popup-title"
                className="text-xl font-bold text-slate-900"
              >
                Enable Your Location
              </h2>
              <p className="mt-2 text-sm text-slate-600">
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
                className="rounded-xl bg-slate-200 px-5 py-3 font-semibold text-slate-800 hover:bg-slate-300"
              >
                OFF
              </button>
              <button
                type="button"
                onClick={requestCurrentLocation}
                disabled={locationLoading}
                className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {locationLoading ? "Loading..." : "ON"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
