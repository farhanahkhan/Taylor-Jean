import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/constants/route";

export async function GET(req: NextRequest) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const externalRes = await fetch(`${API_BASE_URL}/api/users`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const contentType = externalRes.headers.get("content-type");

    const responseBody = contentType?.includes("application/json")
      ? await externalRes.json()
      : await externalRes.text();

    return new NextResponse(
      typeof responseBody === "string"
        ? responseBody
        : JSON.stringify(responseBody),
      {
        status: externalRes.status,
        headers: { "Content-Type": contentType ?? "application/json" },
      },
    );
  } catch (error) {
    console.error("Users fetch error:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body: unknown = await req.json();

    if (
      typeof body !== "object" ||
      body === null ||
      !("userId" in body) ||
      typeof body.userId !== "string" ||
      !body.userId.trim()
    ) {
      return NextResponse.json(
        { message: "Valid User ID is required" },
        { status: 400 },
      );
    }

    if (!("kycStatus" in body) || body.kycStatus !== true) {
      return NextResponse.json(
        { message: "Invalid KYC status" },
        { status: 400 },
      );
    }

    const externalRes = await fetch(
      `${API_BASE_URL}/api/users/${encodeURIComponent(body.userId)}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ kycStatus: true }),
        cache: "no-store",
      },
    );

    const responseText = await externalRes.text();

    if (!externalRes.ok) {
      console.error("Backend KYC update failed:", {
        status: externalRes.status,
        response: responseText,
      });

      return NextResponse.json(
        {
          message: "Failed to approve user",
          backendStatus: externalRes.status,
          details: responseText,
        },
        { status: externalRes.status },
      );
    }

    return NextResponse.json({
      success: true,
      message: "User approved successfully",
      userId: body.userId,
    });
  } catch (error) {
    console.error("User KYC update error:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
