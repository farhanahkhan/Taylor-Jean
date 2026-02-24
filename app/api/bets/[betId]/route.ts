import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/constants/route";

export async function POST(
  req: NextRequest,
  { params }: { params: { betId: string } } // params me betId hi hona chahiye
) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { betId } = params;
    const body = await req.json();
    const { winningOptionId } = body;

    if (!winningOptionId) {
      return NextResponse.json(
        { message: "winningOptionId is required" },
        { status: 400 }
      );
    }

    // External API call
    const externalRes = await fetch(`${API_BASE_URL}/api/Bets/${betId}/close`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ winningOptionId }),
    });

    const data = await externalRes.json();

    // Agar backend error ho toh wo yahi return hoga
    if (!externalRes.ok) {
      return NextResponse.json(data, { status: externalRes.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Close market error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
