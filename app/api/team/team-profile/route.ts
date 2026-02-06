import { NextResponse } from "next/server";

// External APIs
const GET_TEAMS_URL =
  "http://mobileapp.designswebs.com:5431/api/general-teams/my";

const CREATE_TEAM_URL =
  "http://mobileapp.designswebs.com:5431/api/general-teams/create";

// 🔐 Bearer Token (better: env me rakho)
const BEARER_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImM3MDZlMmM5LTVlMmUtNDFiMi05MWRhLTQ1OGNkNzBkYjU0NSIsInN1YiI6ImM3MDZlMmM5LTVlMmUtNDFiMi05MWRhLTQ1OGNkNzBkYjU0NSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6ImZhcmhhbmFobWVkQGdtYWlsLmNvbSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkRvbWFpbi5FbnRpdGllcy5Sb2xlIiwiZXhwIjoxNzcwMzc1NDk1LCJpc3MiOiJZb3VyQXBwIiwiYXVkIjoiWW91ckFwcFVzZXJzIn0.PuTSDlwwtqpXNbEMlvZcTP05En9lzodmwlQzNuvFcAg";

/* ======================
   GET – My Teams List
====================== */
export async function GET() {
  try {
    const res = await fetch(GET_TEAMS_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
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
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ✅ ONLY allowed fields (VERY IMPORTANT)
    const payload = {
      name: body.name,
      displayName: body.displayName,
      description: body.description || "",
      length: Number(body.length) || 0,
      engine: body.engine || "",
      gadgets: body.gadgets || "",
    };

    console.log("Create Team Payload:", payload);

    const res = await fetch(CREATE_TEAM_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
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
