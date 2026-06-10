// app/api/location/reverse/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    if (!lat || !lon) {
      return NextResponse.json(
        { message: "lat and lon are required" },
        { status: 400 },
      );
    }

    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=en`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "TaylorJean/1.0 (farhanahkhan@example.com)",
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const text = await res.text();

    if (!res.ok) {
      return NextResponse.json(
        {
          message: "Nominatim API error",
          status: res.status,
          details: text,
        },
        { status: res.status },
      );
    }

    const data = text ? JSON.parse(text) : {};

    return NextResponse.json(data);
  } catch (error) {
    console.error("Reverse location API error:", error);

    return NextResponse.json(
      {
        message: "Reverse location failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
