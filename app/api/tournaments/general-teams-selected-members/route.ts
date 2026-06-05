import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/constants/route";

type ApiResponse = {
  status?: boolean;
  statusCode?: number;
  message?: string;
  data?: unknown;
};
export async function GET(req: NextRequest) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { status: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(req.url);
    const tournamentId = searchParams.get("tournamentId");

    if (!tournamentId) {
      return NextResponse.json(
        { status: false, message: "tournamentId is required" },
        { status: 400 },
      );
    }

    const res = await fetch(
      `${API_BASE_URL}/api/tournaments/general-teams-selected-members?tournamentId=${tournamentId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      },
    );

    const text = await res.text();
    let data: ApiResponse | null = null;

    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = {
        status: false,
        message: text || "Invalid response from backend",
      };
    }

    // Backend ka exact status aur message return karo
    return NextResponse.json(data, {
      status: res.status,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: false,
        message:
          error instanceof Error ? error.message : "Unknown server error",
      },
      { status: 500 },
    );
  }
}
