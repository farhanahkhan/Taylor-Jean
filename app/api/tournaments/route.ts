// import { API_BASE_URL } from "@/app/constants/route";
import { API_BASE_URL } from "@/lib/constants/route";
import { NextRequest, NextResponse } from "next/server";

// GET - fetch all tournaments from external API
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("accessToken")?.value;
    // const res = await fetch(`${API_BASE_URL}/api/tournaments/get-all`);
    const res = await fetch(`${API_BASE_URL}/api/tournaments/get-all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { message: "Failed to fetch tournaments" },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// POST - create new tournament
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("accessToken")?.value;
    const body = await req.json();

    // Validate minimal required fields
    if (
      !body.name ||
      !body.tournamentTypeId ||
      !body.startDate ||
      !body.endDate
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    const res = await fetch(`${API_BASE_URL}/api/tournaments/create`, {
      method: "POST",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(errorData, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
