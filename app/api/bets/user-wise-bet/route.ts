import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/constants/route";

async function getBackendResponse(res: Response) {
  const contentType = res.headers.get("content-type");
  const text = await res.text();

  let body: unknown;

  try {
    body = text ? JSON.parse(text) : { message: res.statusText };
  } catch {
    body = { message: text || res.statusText };
  }

  return {
    body,
    contentType: contentType ?? "application/json",
  };
}

export async function GET(req: NextRequest) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        {
          status: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(req.url);
    const tournamentId = searchParams.get("tournamentId");

    if (!tournamentId) {
      return NextResponse.json(
        {
          status: false,
          message: "Tournament ID is required",
        },
        { status: 400 },
      );
    }

    const res = await fetch(
      `${API_BASE_URL}/api/Bets/user-wise-bet?tournamentId=${tournamentId}`,
      {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const { body } = await getBackendResponse(res);

    return NextResponse.json(body, {
      status: res.status,
    });
  } catch (error) {
    console.error("User Wise Bet API Error:", error);

    return NextResponse.json(
      {
        status: false,
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}
