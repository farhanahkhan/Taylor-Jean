import { API_BASE_URL } from "@/app/constants/route";
import { NextRequest, NextResponse } from "next/server";

const GET_TEAMS_URL = `${API_BASE_URL}/api/general-teams/my`;
const CREATE_TEAM_URL = `${API_BASE_URL}/api/general-teams/create`;

/* ======================
   GET – My Teams List
====================== */
export async function GET(req: NextRequest) {
  try {
    // ✅ Read accessToken from cookies
    const accessToken = req.cookies.get("accessToken")?.value;
    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const res = await fetch(GET_TEAMS_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("GET Teams Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/* ======================
   POST – Create Team
====================== */
export async function POST(req: NextRequest) {
  try {
    // ✅ Read accessToken from cookies
    const accessToken = req.cookies.get("accessToken")?.value;
    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // ✅ Only allowed fields
    const payload = {
      name: body.name,
      displayName: body.displayName,
      description: body.description || "",
      length: Number(body.length) || 0,
      engine: body.engine || "",
      gadgets: body.gadgets || "",
    };

    const res = await fetch(CREATE_TEAM_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("POST Create Team Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
