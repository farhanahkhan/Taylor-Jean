// app/api/team-members/route.ts
import { API_BASE_URL } from "@/lib/constants/route";
import { NextRequest, NextResponse } from "next/server";

const GET_TEAMS_URL = `${API_BASE_URL}/api/general-teams/my`;

export async function GET(req: NextRequest) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        {
          message: "Unauthorized",
          status: false,
          data: [],
        },
        { status: 401 },
      );
    }

    const res = await fetch(GET_TEAMS_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    const backendData = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        {
          message: backendData?.message || "Failed to fetch team members",
          status: false,
          data: [],
        },
        { status: res.status },
      );
    }

    // Backend response example:
    // data: [
    //   {
    //     id: "...",
    //     name: "test",
    //     displayName: "ammar",
    //     ...
    //   }
    // ]

    const transformedData = Array.isArray(backendData?.data)
      ? backendData.data.map((team: any) => ({
          id: team.id,
          // Use displayName first, fallback to name
          name: team.displayName ?? team.name ?? "Unnamed Team",
        }))
      : [];

    // Debug logs (check terminal)
    console.log("Backend Data:", backendData);
    console.log("Transformed Data:", transformedData);

    return NextResponse.json(
      {
        message: "Success",
        status: true,
        data: transformedData,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to fetch team members:", error);

    return NextResponse.json(
      {
        message: "Internal server error",
        status: false,
        data: [],
      },
      { status: 500 },
    );
  }
}
