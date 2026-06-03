import { API_BASE_URL } from "@/lib/constants/route";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;
    const { id: tournamentId } = await params; // ✅ IMPORTANT

    console.log("Tournament ID:", tournamentId);

    if (!tournamentId) {
      return NextResponse.json(
        { status: false, message: "Tournament ID missing" },
        { status: 400 },
      );
    }

    const res = await fetch(
      `${API_BASE_URL}/api/team-activities/tournament/${tournamentId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
        cache: "no-store",
      },
    );

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(errorData, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Route error:", error);
    return NextResponse.json(
      { status: false, message: "Server error" },
      { status: 500 },
    );
  }
}
