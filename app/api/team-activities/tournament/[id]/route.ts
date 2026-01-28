import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const tournamentId = params.id;

    const BEARER_TOKEN = request.headers.get(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImUzYzExN2NiLWEzZDUtNGFjNi1hYTVlLTA5YmRlOGZlNmI4NSIsInN1YiI6ImUzYzExN2NiLWEzZDUtNGFjNi1hYTVlLTA5YmRlOGZlNmI4NSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6ImZhcmhhbmtoYW5AZ21haWwuY29tIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiRG9tYWluLkVudGl0aWVzLlJvbGUiLCJleHAiOjE3Njk1ODg2ODMsImlzcyI6IllvdXJBcHAiLCJhdWQiOiJZb3VyQXBwVXNlcnMifQ.OTNsMGspqBdzWSkLljM0zt4_7RGKx9IGxdU7XLwileI"
    ); // Bearer token

    console.log(tournamentId);

    const res = await fetch(
      `http://mobileapp.designswebs.com:5431/api/team-activities/tournament/${tournamentId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
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
