import { API_BASE_URL } from "@/lib/constants/route";
import { NextRequest, NextResponse } from "next/server";

const GET_API_URL = `${API_BASE_URL}/api/merch/sizes/get-all`;
const POST_API_URL = `${API_BASE_URL}/api/merch/sizes/create`;

// ======================
// GET: Fetch all sizes
// ======================
export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch(GET_API_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const result = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        {
          message: "Failed to fetch categories",
          data: result,
        },
        { status: res.status },
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        message: "Server error",
        error,
      },
      { status: 500 },
    );
  }
}

// ======================
// POST: Create new size
// ======================
export async function POST(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    // ✅ Backend requires "SizeValue"
    const payload = {
      SizeValue: body.SizeValue,
      IsActive: body.IsActive ?? body.isActive ?? false,
    };

    console.log("POST Payload:", payload);

    const res = await fetch(POST_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        {
          message: "Failed to create category",
          data: result,
        },
        { status: res.status },
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        message: "Server error",
        error,
      },
      { status: 500 },
    );
  }
}
