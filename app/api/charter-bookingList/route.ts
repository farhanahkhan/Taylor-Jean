import { API_BASE_URL } from "@/lib/constants/route";
import { NextResponse } from "next/server";
// import { API_BASE_URL } from "@/app/constants/route";

// Agar aapka real backend API hai
export async function GET() {
  const res = await fetch(`${API_BASE_URL}/api/charter-bookings`); // real API
  const json = await res.json();

  // json.data me woh real data hai jo aapne share kiya
  return NextResponse.json({
    message: json.message,
    status: json.status,
    data: json.data,
  });
}
