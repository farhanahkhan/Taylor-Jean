import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { activityId, approve } = body;

    if (!activityId || typeof approve !== "boolean") {
      return NextResponse.json(
        { success: false, message: "Invalid payload" },
        { status: 400 }
      );
    }

    const token = process.env.EXTERNAL_API_TOKEN;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token missing in env" },
        { status: 500 }
      );
    }

    const backendRes = await fetch(
      "http://mobileapp.designswebs.com:5431/api/team-activities/review",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ YAHI MAIN CHEEZ HAI
        },
        body: JSON.stringify({
          activityId,
          approve,
        }),
      }
    );

    const data = await backendRes.json();

    // 🔥 backend error ko 그대로 forward karo
    if (!backendRes.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data?.message || "Backend error",
        },
        { status: backendRes.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: data?.message || "Action completed",
      data,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
