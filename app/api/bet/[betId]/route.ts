import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/constants/route";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ betId: string }> },
) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;
    const { betId } = await context.params;

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!betId) {
      return NextResponse.json(
        { message: "Bet ID is required" },
        { status: 400 },
      );
    }

    const body = await req.json();

    const res = await fetch(`${API_BASE_URL}/api/Bets/${betId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    const data = text ? JSON.parse(text) : null;

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("PUT Bet Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ betId: string }> },
) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;
    const { betId } = await context.params;

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!betId) {
      return NextResponse.json(
        { message: "Bet ID is required" },
        { status: 400 },
      );
    }

    const res = await fetch(`${API_BASE_URL}/api/Bets/${betId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const text = await res.text();
    const data = text ? JSON.parse(text) : null;

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("DELETE Bet Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
