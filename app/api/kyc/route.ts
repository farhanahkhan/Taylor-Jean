import { API_BASE_URL } from "@/lib/constants/route";
import { NextRequest, NextResponse } from "next/server";

const BASE_URL = `${API_BASE_URL}/api/kyc/admin`;

// ✅ GET all KYC requests
export async function GET(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;
  try {
    const res = await fetch(`${BASE_URL}/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching KYC", error },
      { status: 500 },
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
