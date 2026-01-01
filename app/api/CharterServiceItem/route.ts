// import { NextResponse } from "next/server";

// const API_URL = "http://mobileapp.designswebs.com:5431/api/CharterServiceItem";

// export async function GET() {
//   const res = await fetch(API_URL, { cache: "no-store" });
//   const data = await res.json();
//   return NextResponse.json(data);
// }

// export async function POST(req: Request) {
//   const body = await req.json();

//   const res = await fetch(API_URL, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       serviceName: body.name,
//       description: body.description,
//       price: body.amount,
//       isActive: body.isActive,
//     }),
//   });

//   const data = await res.json();
//   return NextResponse.json(data);
// }
import { NextResponse } from "next/server";

const BASE_URL = "http://mobileapp.designswebs.com:5431/api/CharterServiceItem";

/* ================= GET ================= */
export async function GET() {
  try {
    const res = await fetch(BASE_URL, { cache: "no-store" });
    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch charter services" },
      { status: 500 }
    );
  }
}

/* ================= POST ================= */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { message: "Failed to create charter service" },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
