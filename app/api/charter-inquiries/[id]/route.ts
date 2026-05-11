// api/charter-inquiries/[id]/route.ts
// Use this exact code.
// IMPORTANT: Many APIs require the `id` inside the request body as well.

import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/constants/route";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    const body = await req.json();

    // Include id in payload
    const payload = {
      id, // ✅ Required by many APIs
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      contact: body.contact,
      amount: body.amount,
      paymentStatus: body.paymentStatus,
      bookingStatus: body.bookingStatus,
    };

    console.log(
      "PUT URL:",
      `${API_BASE_URL}/api/CharterBookingInquiries/${id}`,
    );
    console.log("PUT Payload:", payload);

    const res = await fetch(
      `${API_BASE_URL}/api/CharterBookingInquiries/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );

    const data = await res.json().catch(() => null);

    console.log("Response Status:", res.status);
    console.log("Response Data:", data);

    return NextResponse.json(data || { message: "Updated successfully" }, {
      status: res.status,
    });
  } catch (error) {
    console.error("PUT CharterBookingInquiries Error:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
