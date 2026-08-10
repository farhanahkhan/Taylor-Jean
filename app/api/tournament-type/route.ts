import { API_BASE_URL } from "@/lib/constants/route";
import { NextRequest, NextResponse } from "next/server";

const GET_API_URL = `${API_BASE_URL}/api/setup/tournament-types/get-all`;
const CREATE_API_URL = `${API_BASE_URL}/api/setup/tournament-types/create`;

// GET Tournament Types
export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch(GET_API_URL, {
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
          message: result?.message || "Failed to fetch tournament types",
        },
        { status: res.status },
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Tournament Type GET Error:", error);

    return NextResponse.json(
      {
        message: "Server error",
        error,
      },
      { status: 500 },
    );
  }
}

// POST Tournament Type
export async function POST(req: NextRequest) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const res = await fetch(CREATE_API_URL, {
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
          message: result?.message || "Failed to create tournament type",
        },
        { status: res.status },
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Tournament Type POST Error:", error);

    return NextResponse.json(
      {
        message: "Server error",
        error,
      },
      { status: 500 },
    );
  }
}
