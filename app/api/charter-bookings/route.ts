// import { API_BASE_URL } from "@/app/constants/route";
import { API_BASE_URL } from "@/lib/constants/route";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    const apiRes = await fetch(`${API_BASE_URL}/api/charter-bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await apiRes.json();

    if (!apiRes.ok) {
      return NextResponse.json(
        { message: data.message || "Booking failed" },
        { status: apiRes.status }
      );
    }

    // ✅ Set httpOnly cookie (client JS cannot read)
    const response = NextResponse.json({
      message: "Booking successful",
      bookingId: data.data.id,
      fullName: data.data.firstName + " " + data.data.lastName,
      email: data.data.email,
      amount: data.data.amount,
    });

    response.cookies.set({
      name: "accessToken",
      value: data.accessToken,
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
  } catch (err) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
