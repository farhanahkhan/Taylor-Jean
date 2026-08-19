import { API_BASE_URL } from "@/lib/constants/route";
import { NextRequest, NextResponse } from "next/server";

const API_URL = `${API_BASE_URL}/api/coin-settings`;

// GET Coin Settings
export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch(API_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const result = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        {
          message: result?.message || "Failed to fetch coin settings",
        },
        { status: res.status },
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Coin Setting GET Error:", error);

    return NextResponse.json(
      {
        message: "Server error",
        error,
      },
      { status: 500 },
    );
  }
}

// POST Coin Setting
export async function POST(req: NextRequest) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const result = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        {
          message: result?.message || "Failed to create coin setting",
        },
        { status: res.status },
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Coin Setting POST Error:", error);

    return NextResponse.json(
      {
        message: "Server error",
        error,
      },
      { status: 500 },
    );
  }
}
