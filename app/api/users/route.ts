import { API_BASE_URL } from "@/app/constants/route";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    if (type === "users") {
      const res = await fetch(`${API_BASE_URL}/api/users`, {
        cache: "no-store",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      return NextResponse.json(data);
    }

    if (type === "add-members") {
      const teamId = searchParams.get("teamId");

      if (!teamId) {
        return NextResponse.json(
          { message: "teamId is required" },
          { status: 400 }
        );
      }

      const res = await fetch(
        `${API_BASE_URL}/api/general-teams/${teamId}/members`,
        {
          cache: "no-store",
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const data = await res.json();
      return NextResponse.json(data);
    }

    return NextResponse.json({ message: "Invalid type" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ message: "GET failed", error }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    if (body.type === "add-member") {
      const { generalTeamId, userId } = body;

      const res = await fetch(`${API_BASE_URL}/api/general-teams/add-member`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ generalTeamId, userId }),
      });

      const data = await res.json();
      return NextResponse.json(data);
    }

    return NextResponse.json({ message: "Invalid POST type" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { message: "POST failed", error },
      { status: 500 }
    );
  }
}
