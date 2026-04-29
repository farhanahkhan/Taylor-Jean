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
      }
    );
  } catch (error) {
    console.error("Users fetch error:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
