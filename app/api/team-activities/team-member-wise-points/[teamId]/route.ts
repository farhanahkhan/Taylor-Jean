import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/constants/route";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ teamId: string }> },
) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { teamId } = await context.params;

    if (!teamId) {
      return NextResponse.json(
        { message: "Tournament Team ID is required" },
        { status: 400 },
      );
    }

    const res = await fetch(
      `${API_BASE_URL}/api/team-activities/team-member-wise-points/${teamId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    );

    const contentType = res.headers.get("content-type");
    const responseBody = contentType?.includes("application/json")
      ? await res.json()
      : await res.text();

    if (!res.ok) {
      const message =
        typeof responseBody === "string"
          ? responseBody
          : responseBody?.message || "Something went wrong";

      return NextResponse.json(
        {
          message,
          status: responseBody?.status ?? false,
          statusCode: responseBody?.statusCode ?? res.status,
        },
        { status: res.status },
      );
    }

    return NextResponse.json(responseBody, { status: res.status });
  } catch (error) {
    console.error("Team member wise points error:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
