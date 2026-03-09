// route.ts
import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "http://mobileapp.designswebs.com:5431/api/merch";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    const res = await fetch(`${BASE_URL}/products/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      console.error("Backend returned error:", errorData);
      return NextResponse.json(
        { message: errorData?.message || "Backend error" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("POST route error:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  let endpoint = "";
  switch (type) {
    case "products":
      endpoint = "/products/get-all";
      break;
    case "colors":
      endpoint = "/colors/get-all";
      break;
    case "categories":
      endpoint = "/categories/get-all";
      break;
    case "sizes":
      endpoint = "/sizes/get-all";
      break;
    default:
      return NextResponse.json({ message: "Invalid type" }, { status: 400 });
  }

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, { cache: "no-store" });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
