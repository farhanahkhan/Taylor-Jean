import { API_BASE_URL } from "@/app/constants/route";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = `${API_BASE_URL}/api/uploads/generate-upload-url`;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const fileName = searchParams.get("fileName");
    const contentType = searchParams.get("contentType");

    if (!fileName || !contentType) {
      return NextResponse.json(
        { message: "fileName and contentType are required" },
        { status: 400 }
      );
    }

    const backendRes = await fetch(
      `${BACKEND_URL}?fileName=${encodeURIComponent(
        fileName
      )}&contentType=${encodeURIComponent(contentType)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.API_TOKEN}`,
          Accept: "application/json",
        },
        cache: "no-store",
      }
    );

    const backendData = await backendRes.json();

    if (!backendRes.ok) {
      console.error("Backend error:", backendData);
      return NextResponse.json(
        { message: "Failed to generate upload URL" },
        { status: backendRes.status }
      );
    }

    return NextResponse.json({
      uploadUrl: backendData.data.uploadUrl,
      expiresIn: 900,
    });
  } catch (error) {
    console.error("Generate upload URL error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
