import { NextResponse } from "next/server";

// Agar aapka real backend API hai
export async function GET() {
  const res = await fetch(
    "http://mobileapp.designswebs.com:5431/api/charter-bookings"
  ); // real API
  const json = await res.json();

  // json.data me woh real data hai jo aapne share kiya
  return NextResponse.json({
    message: json.message,
    status: json.status,
    data: json.data,
  });
}
