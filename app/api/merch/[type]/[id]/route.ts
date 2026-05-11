// app/api/merch/[type]/[id]/route.ts
import { API_BASE_URL } from "@/lib/constants/route";
import { NextRequest, NextResponse } from "next/server";

const ALLOWED_TYPES = ["products", "sizes", "colors", "categories"];

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ type: string; id: string }> },
) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;

    // Token check
    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { type, id } = await context.params;

    // Validate type
    if (!ALLOWED_TYPES.includes(type)) {
      return NextResponse.json({ message: "Invalid type" }, { status: 400 });
    }

    const payload = await req.json();

    const res = await fetch(`${API_BASE_URL}/api/merch/${type}/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return NextResponse.json(
        { message: data?.message || "Backend error" },
        { status: res.status },
      );
    }

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ type: string; id: string }> },
) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;

    // Token check
    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { type, id } = await context.params;

    // Validate type
    if (!ALLOWED_TYPES.includes(type)) {
      return NextResponse.json({ message: "Invalid type" }, { status: 400 });
    }

    const res = await fetch(`${API_BASE_URL}/api/merch/${type}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return NextResponse.json(
        { message: data?.message || "Backend error" },
        { status: res.status },
      );
    }

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
