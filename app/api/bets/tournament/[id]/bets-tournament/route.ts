import { API_BASE_URL } from "@/lib/constants/route";
import { NextRequest, NextResponse } from "next/server";

async function safeJson(res: Response) {
  const text = await res.text();

  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return {
      message: text || "Invalid response from backend",
    };
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;
    const { id: tournamentId } = await params;

    console.log("Tournament ID:", tournamentId);

    if (!accessToken) {
      return NextResponse.json(
        {
          status: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    if (!tournamentId) {
      return NextResponse.json(
        { status: false, message: "Tournament ID missing" },
        { status: 400 },
      );
    }

    const res = await fetch(
      `${API_BASE_URL}/api/bets/tournament/${tournamentId}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      },
    );
    const data = await safeJson(res);

    // if (!res.ok) {
    //   const errorData = await res.json();
    //   return NextResponse.json(errorData, { status: res.status });
    // }

    // const data = await res.json();
    // return NextResponse.json(data);

    if (!res.ok) {
      return NextResponse.json(
        {
          status: false,
          message: data?.message || res.statusText || "Something went wrong",
          error: data,
        },
        { status: res.status },
      );
    }

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      {
        status: false,
        message: error instanceof Error ? error.message : "Server error",
      },
      { status: 500 },
    );
  }
}
