import { API_BASE_URL } from "@/lib/constants/route";
import { NextResponse } from "next/server";

const BASE_URL = `${API_BASE_URL}/api/kyc/admin`;
const AUTH_HEADER = {
  Authorization: `Bearer ${process.env.API_TOKEN}`,
};

// ✅ GET all KYC requests
export async function GET() {
  try {
    const res = await fetch(`${BASE_URL}/all`, {
      method: "GET",
      headers: AUTH_HEADER,
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching KYC", error },
      { status: 500 }
    );
  }
}
// fdfsf

// ✅ PUT review KYC request
// export async function PUT(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const body = await req.json(); // { isApproved: true/false }
//     const res = await fetch(`${API_BASE_URL}/review/${params.id}`, {
//       method: "PUT",
//       headers: {
//         ...AUTH_HEADER,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(body),
//     });
//     const data = await res.json();
//     return NextResponse.json(data);
//   } catch (error) {
//     return NextResponse.json(
//       { message: "Error updating KYC", error },
//       { status: 500 }
//     );
//   }
// }
