import { API_BASE_URL } from "@/lib/constants/route";
import { NextRequest, NextResponse } from "next/server";

const API_URL = `${API_BASE_URL}/api/team-activities/manual-points`;

// POST Manual Points
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
          message: result?.message || "Failed to add manual points",
        },
        {
          status: res.status,
        },
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Manual Points POST Error:", error);

    return NextResponse.json(
      {
        message: "Server error",
        error,
      },
      {
        status: 500,
      },
    );
  }
}
