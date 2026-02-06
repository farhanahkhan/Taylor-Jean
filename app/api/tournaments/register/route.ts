import { NextRequest, NextResponse } from "next/server";

const BEARER_TOKEN =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImM3MDZlMmM5LTVlMmUtNDFiMi05MWRhLTQ1OGNkNzBkYjU0NSIsInN1YiI6ImM3MDZlMmM5LTVlMmUtNDFiMi05MWRhLTQ1OGNkNzBkYjU0NSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6ImZhcmhhbmFobWVkQGdtYWlsLmNvbSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkRvbWFpbi5FbnRpdGllcy5Sb2xlIiwiZXhwIjoxNzcwMzc1NDk1LCJpc3MiOiJZb3VyQXBwIiwiYXVkIjoiWW91ckFwcFVzZXJzIn0.PuTSDlwwtqpXNbEMlvZcTP05En9lzodmwlQzNuvFcAg";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await fetch(
      "http://mobileapp.designswebs.com:5431/api/tournaments/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: BEARER_TOKEN, // ✅ yahin fixed token
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Tournament register error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
