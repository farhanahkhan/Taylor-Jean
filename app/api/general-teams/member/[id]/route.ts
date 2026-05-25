import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/constants/route";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { status: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const memberUserId = params.id;

    if (!memberUserId) {
      return NextResponse.json(
        { status: false, message: "Member ID is required" },
        { status: 400 },
      );
    }

    const { searchParams } = new URL(req.url);
    const generalTeamId = searchParams.get("generalTeamId");

    if (!generalTeamId) {
      return NextResponse.json(
        { status: false, message: "generalTeamId is required" },
        { status: 400 },
      );
    }

    const url = `${API_BASE_URL}/general-teams/member?generalTeamId=${generalTeamId}&memberUserId=${memberUserId}`;

    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    return NextResponse.json(data, {
      status: res.status,
    });
  } catch (error) {
    console.error("DELETE MEMBER ERROR:", error);

    return NextResponse.json(
      { status: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
