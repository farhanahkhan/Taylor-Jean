// app/api/team-members/route.ts

import { API_BASE_URL } from "@/lib/constants/route";
import { NextRequest, NextResponse } from "next/server";

const GET_TEAMS_URL = `${API_BASE_URL}/api/general-teams/my`;

export async function GET(req: NextRequest) {
  try {
    // Cookie se access token lo
    const accessToken = req.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        {
          status: false,
          message: "Unauthorized",
          data: [],
        },
        { status: 401 },
      );
    }

    // Backend API call
    const res = await fetch(GET_TEAMS_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const result = await res.json();

    // Backend response:
    // {
    //   message: "Success",
    //   statusCode: 200,
    //   status: true,
    //   data: [...]
    // }

    // Frontend expects:
    // {
    //   status: true,
    //   data: [...]
    // }

    return NextResponse.json(
      {
        status: result?.status ?? false,
        message: result?.message ?? "Success",
        data: result?.data ?? [],
      },
      { status: res.status },
    );
  } catch (error) {
    console.error("GET Team Members Error:", error);

    return NextResponse.json(
      {
        status: false,
        message: "Internal Server Error",
        data: [],
      },
      { status: 500 },
    );
  }
}
