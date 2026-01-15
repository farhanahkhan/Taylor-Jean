import { NextResponse } from "next/server";

// Full URLs for external API
const GET_TEAMS_URL =
  "http://mobileapp.designswebs.com:5431/api/teams/by-tournament/b97ce2a9-2ea6-4452-8829-abd10643a674";
// `http://mobileapp.designswebs.com:5431/api/teams/by-tournament`;
// ("http://mobileapp.designswebs.com:5431/api/teams");
const CREATE_TEAM_URL =
  "http://mobileapp.designswebs.com:5431/api/teams/create";

// Bearer token (use .env for security)
const BEARER_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjNzA2ZTJjOS01ZTJlLTQxYjItOTFkYS00NThjZDcwZGI1NDUiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJmYXJoYW5haG1lZEBnbWFpbC5jb20iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJEb21haW4uRW50aXRpZXMuUm9sZSIsImV4cCI6MTc2ODQ5NTE4NCwiaXNzIjoiWW91ckFwcCIsImF1ZCI6IllvdXJBcHBVc2VycyJ9.RWo_SPuLi5SrzyuGxmmwFEvA999aH9a4Wu2lqYrdB-U";

/* ======================
   GET – Fetch all Teams
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

    if (!res.ok) return NextResponse.json(data, { status: res.status });

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET Teams Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const tournamentId = searchParams.get("tournamentId");

//     if (!tournamentId) {
//       return NextResponse.json(
//         { message: "tournamentId is required" },
//         { status: 400 }
//       );
//     }

//     const res = await fetch(`${GET_TEAMS_URL}/${tournamentId}`, {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${BEARER_TOKEN}`,
//         "Content-Type": "application/json",
//       },
//       cache: "no-store",
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       return NextResponse.json(data, { status: res.status });
//     }

//     return NextResponse.json(data);
//   } catch (error) {
//     console.error("GET Teams Error:", error);
//     return NextResponse.json(
//       { message: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

/* ======================
   POST – Create Team
====================== */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("POST Payload:", body); // Debug payload

    const res = await fetch(CREATE_TEAM_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    console.log("POST Response:", data); // Debug response

    if (!res.ok) return NextResponse.json(data, { status: res.status });

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("POST Create Team Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
