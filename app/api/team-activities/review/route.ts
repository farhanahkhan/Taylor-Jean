import { API_BASE_URL } from "@/lib/constants/route";
import { NextRequest, NextResponse } from "next/server";
// import { API_BASE_URL } from "@/app/constants/route";

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
      `${API_BASE_URL}/api/team-activities/review`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          activityId,
          approve,
        }),
      }
    );

    const data = await backendRes.json();

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
