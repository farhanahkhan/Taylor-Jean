import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "http://mobileapp.designswebs.com:5431";

export async function DELETE(req: NextRequest) {
  // .
  try {
    const accessToken = req.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { status: false, message: "Unauthorized" },
        { status: 401 },
      );
    }
    const { searchParams } = new URL(req.url);

    const generalTeamId = searchParams.get("generalTeamId");
    const memberUserId = searchParams.get("memberUserId");

    if (!generalTeamId || !memberUserId) {
      return NextResponse.json(
        {
          status: false,
          message: "generalTeamId and memberUserId are required",
        },
        { status: 400 },
      );
    }

    const response = await fetch(
      `${BASE_URL}/api/general-teams/member?generalTeamId=${generalTeamId}&memberUserId=${memberUserId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("DELETE MEMBER ERROR:", error);

    return NextResponse.json(
      {
        status: false,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}
