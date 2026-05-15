import { API_BASE_URL } from "@/lib/constants/route";
import { NextRequest, NextResponse } from "next/server";

const API_URL = `${API_BASE_URL}/api/merch/colors/get-all`;

// GET categories
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

    if (!res.ok) {
      return NextResponse.json(
        { message: "Failed to fetch categories" },
        { status: res.status },
      );
    }

    const result = await res.json();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error },
      { status: 500 },
    );
  }
}

// POST category
const API_URLs = `${API_BASE_URL}/api/merch/colors/create`;

export async function POST(req: NextRequest) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const payload = {
      name: body.name,
      HexCode: body.HexCode || body.hexCode || body.color, // 🔥 SAFE FIX
      isActive: body.isActive,
    };

    const res = await fetch(API_URLs, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { message: "Failed to create category", data: result },
        { status: res.status },
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error },
      { status: 500 },
    );
  }
}
