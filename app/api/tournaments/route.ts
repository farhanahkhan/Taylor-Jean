import { API_BASE_URL } from "@/app/constants/route";
import { NextResponse } from "next/server";

// GET - fetch all tournaments from external API
export async function GET() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/tournaments/get-all`);

    if (!res.ok) {
      return NextResponse.json(
        { message: "Failed to fetch tournaments" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST - create new tournament
export async function POST(req: Request) {
  try {
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
        { status: 400 }
      );
    }

    const res = await fetch(
      "http://mobileapp.designswebs.com:5431/api/tournaments/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(errorData, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
