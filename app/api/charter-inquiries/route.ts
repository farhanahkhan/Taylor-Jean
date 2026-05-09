// import { API_BASE_URL } from "@/app/constants/route";
// import { API_BASE_URL } from "@/lib/constants/route";
// import { NextRequest, NextResponse } from "next/server";

// const API_URL = `${API_BASE_URL}/api/CharterBookingInquiries`;

// export async function GET(req: NextRequest) {
//   try {
//     const accessToken = req.cookies.get("accessToken")?.value;

//     if (!accessToken) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const res = await fetch(API_URL, { method: "GET" });
//     const result = await res.json();
//     return NextResponse.json(result);
//   } catch (error) {
//     return NextResponse.json(
//       { message: "Server Error", error },
//       { status: 500 }
//     );
//   }
// }

import { API_BASE_URL } from "@/lib/constants/route";
import { NextRequest, NextResponse } from "next/server";

const API_URL = `${API_BASE_URL}/api/CharterBookingInquiries`;

export async function GET(req: NextRequest) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const res = await fetch(API_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`, // ✅ IMPORTANT FIX
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { message: "Failed to fetch data from API" },
        { status: res.status }
      );
    }

    const result = await res.json();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { message: "Server Error", error: String(error) },
      { status: 500 }
    );
  }
}

// export async function PUT(req: Request) {
//   try {
//     const body = await req.json();
//     const res = await fetch(`${API_URL}/${body.id}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(body),
//     });

//     const result = await res.json();
//     return NextResponse.json(result);
//   } catch (error) {
//     return NextResponse.json(
//       { message: "Server Error", error },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const id = searchParams.get("id");
//     const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
//     const result = await res.json();
//     return NextResponse.json(result);
//   } catch (error) {
//     return NextResponse.json(
//       { message: "Server Error", error },
//       { status: 500 }
//     );
//   }
// }
