import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const latitude = Number(request.nextUrl.searchParams.get("lat"));
  const longitude = Number(request.nextUrl.searchParams.get("lng"));

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_GEOCODING_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Google API key missing" },
      { status: 500 },
    );
  }

  try {
    const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");

    url.searchParams.set("latlng", `${latitude},${longitude}`);
    url.searchParams.set("key", apiKey);
    url.searchParams.set("language", "en");

    const response = await fetch(url.toString(), {
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok || data.status !== "OK") {
      return NextResponse.json(
        { error: data.error_message || data.status },
        { status: 502 },
      );
    }

    const results = data.results ?? [];

    const bestResult =
      results.find((result: { types: string[] }) =>
        result.types.includes("street_address"),
      ) ??
      results.find((result: { types: string[] }) =>
        result.types.includes("premise"),
      ) ??
      results.find((result: { types: string[] }) =>
        result.types.includes("route"),
      ) ??
      results[0];

    return NextResponse.json({
      address: bestResult?.formatted_address ?? "",
    });
  } catch {
    return NextResponse.json(
      { error: "Address lookup failed" },
      { status: 500 },
    );
  }
}
