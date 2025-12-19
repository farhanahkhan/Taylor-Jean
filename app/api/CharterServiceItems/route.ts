// app/api/CharterServiceItem/route.ts
import { NextResponse } from "next/server";

const EXTERNAL_API =
  "http://mobileapp.designswebs.com:5431/api/CharterServiceItem";

export async function GET() {
  try {
    const res = await fetch(EXTERNAL_API); // server-side fetch
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch services", error },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch(EXTERNAL_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to add service", error },
      { status: 500 }
    );
  }
}
