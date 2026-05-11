// import { NextRequest, NextResponse } from "next/server";
// import { API_BASE_URL } from "@/lib/constants/route";

// export async function PUT(
//   req: NextRequest,
//   context: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const accessToken = req.cookies.get("accessToken")?.value;

//     if (!accessToken) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const { id } = await context.params;

//     if (!id) {
//       return NextResponse.json({ message: "ID is required" }, { status: 400 });
//     }

//     const body = await req.json();

//     const payload = {
//       charterName: body.charterName,
//       description: body.description,
//       baseAmount: body.baseAmount,
//       categoryId: body.categoryId,
//       imageUrl: body.imageUrl,
//       isActive: body.isActive,
//     };

//     const res = await fetch(`${API_BASE_URL}/api/charter-services/${id}`, {
//       method: "PUT",
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(payload),
//     });

//     const contentType = res.headers.get("content-type");

//     const responseBody = contentType?.includes("application/json")
//       ? await res.json()
//       : await res.text();

//     return new NextResponse(
//       typeof responseBody === "string"
//         ? responseBody
//         : JSON.stringify(responseBody),
//       {
//         status: res.status,
//         headers: {
//           "Content-Type": contentType ?? "application/json",
//         },
//       }
//     );
//   } catch (error) {
//     console.error("PUT Charter Service Error:", error);

//     return NextResponse.json(
//       { message: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }
// import { NextRequest, NextResponse } from "next/server";
// import { API_BASE_URL } from "@/lib/constants/route";

// export async function PUT(
//   req: NextRequest,
//   context: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const accessToken = req.cookies.get("accessToken")?.value;

//     if (!accessToken) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const { id } = await context.params;

//     if (!id) {
//       return NextResponse.json({ message: "ID is required" }, { status: 400 });
//     }

//     const body = await req.json();

//     // ✅ NORMALIZE DATA (IMPORTANT FIX)
//     const payload = {
//       firstName: body.firstName,
//       lastName: body.lastName,
//       email: body.email,
//       contact: body.contact,
//       amount: body.amount,
//       paymentStatus: body.paymentStatus,
//     };

//     const res = await fetch(
//       `${API_BASE_URL}/api/CharterBookingInquiries/${id}`,
//       {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       }
//     );

//     const contentType = res.headers.get("content-type");

//     const responseBody = contentType?.includes("application/json")
//       ? await res.json()
//       : await res.text();

//     return new NextResponse(
//       typeof responseBody === "string"
//         ? responseBody
//         : JSON.stringify(responseBody),
//       {
//         status: res.status,
//         headers: {
//           "Content-Type": contentType ?? "application/json",
//         },
//       }
//     );
//   } catch (error) {
//     console.error("PUT CharterBookingInquiries Error:", error);

//     return NextResponse.json(
//       { message: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/constants/route";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const id = params.id;

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    const body = await req.json();

    const payload = {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      contact: body.contact,
      amount: body.amount,
      paymentStatus: body.paymentStatus,
      bookingStatus: body.bookingStatus,
    };

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

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("PUT error:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
