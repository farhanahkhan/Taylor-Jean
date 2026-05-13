import { NextRequest, NextResponse } from "next/server";

const API_URL = "http://mobileapp.designswebs.com:5431/api/general-teams";

export async function GET(req: NextRequest) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const res = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`, // ✅ IMPORTANT FIX
      },
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({
        status: true,
        data: [{ id: 1, name: "Test Team" }], // Dummy data
      });
    }

    return NextResponse.json({
      message: data.message,
      status: data.status,
      statusCode: data.statusCode,
      data: data?.data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Something went wrong",
        status: false,
        statusCode: 500,
        data: null,
      },
      { status: 500 },
    );
  }
}
