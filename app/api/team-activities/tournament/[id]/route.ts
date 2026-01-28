import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const tournamentId = params.id;

    console.log(tournamentId);

    const res = await fetch(
      `http://mobileapp.designswebs.com:5431/api/team-activities/tournament/${tournamentId}`,
      {
        method: "GET",
        headers: {
          // Authorization: `Bearer ${BEARER_TOKEN}`,
          Accept: "application/json",
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(errorData, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { status: false, message: "Server error" },
      { status: 500 }
    );
  }
}
