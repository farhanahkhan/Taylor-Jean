// app/api/team-members/route.ts

import { API_BASE_URL } from "@/lib/constants/route";
import { NextRequest, NextResponse } from "next/server";

const GET_TEAMS_URL = `${API_BASE_URL}/api/general-teams`;

export async function GET(req: NextRequest) {
  try {
    // Debug: check cookie
    const accessToken = req.cookies.get("accessToken")?.value;
    console.log("Access Token:", accessToken);

    if (!accessToken) {
      return NextResponse.json(
        {
          status: false,
          message: "Unauthorized - Access token not found",
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

    // Debug: raw response
    const responseText = await res.text();
    console.log("Backend Status:", res.status);
    console.log("Backend Response:", responseText);

    // JSON parse
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);

      return NextResponse.json(
        {
          status: false,
          message: "Invalid JSON response from backend",
          data: [],
          rawResponse: responseText,
        },
        { status: 500 },
      );
    }

    // Agar backend se success nahi aaya
    if (!res.ok || !result?.status) {
      return NextResponse.json(
        {
          status: false,
          message: result?.message || "Failed to fetch team members",
          data: [],
          backendResponse: result,
        },
        { status: res.status || 500 },
      );
    }

    // Ensure data is always array
    const members = Array.isArray(result?.data) ? result.data : [];

    return NextResponse.json(
      {
        status: true,
        message: result?.message || "Success",
        data: members,
      },
      { status: 200 },
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
