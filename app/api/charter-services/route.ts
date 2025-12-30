import { NextResponse } from "next/server";

// GET handler
export async function GET() {
  try {
    const res = await fetch(
      "http://mobileapp.designswebs.com:5431/api/charter-services"
    );

    if (!res.ok) {
      return NextResponse.json(
        { message: "Failed to fetch charters" },
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

// post api
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch(
      "http://mobileapp.designswebs.com:5431/api/charter-services",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { message: "Failed to create charter service" },
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
