import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const { tournamentId, title, description, startTime, endTime, options } =
      body;

    if (!tournamentId || !title || !description || !startTime || !endTime) {
      return NextResponse.json(
        { message: "All required fields must be filled." },
        { status: 400 }
      );
    }

    // if (!options || options.length === 0) {
    //   return NextResponse.json(
    //     { message: "At least one option is required." },
    //     { status: 400 }
    //   );
    // }

    // ✅ Call Backend with Authorization header
    const response = await fetch(
      "http://mobileapp.designswebs.com:5431/api/Bets",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // 🔥 IMPORTANT
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Backend error" },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
