// app/api/charter-categories/route.ts
// import { NextResponse } from "next/server";

// export async function GET() {
//   const res = await fetch(
//     "http://mobileapp.designswebs.com:5431/api/charter-categories"
//   );
//   const data = await res.json();

//   return NextResponse.json(data);
// }

// import { API_BASE_URL } from "@/app/constants/route";
import { API_BASE_URL } from "@/lib/constants/route";
import { NextRequest, NextResponse } from "next/server";

const API_URL = `${API_BASE_URL}/api/charter-categories`;

// GET categories
export async function GET() {
  try {
    const res = await fetch(API_URL, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { message: "Failed to fetch categories" },
        { status: res.status }
      );
    }

    const result = await res.json();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error },
      { status: 500 }
    );
  }
}

// POST category
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return NextResponse.json(
        { message: "Failed to create category" },
        { status: res.status }
      );
    }

    const result = await res.json();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error },
      { status: 500 }
    );
  }
}
