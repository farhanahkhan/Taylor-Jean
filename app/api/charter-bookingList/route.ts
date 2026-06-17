// import { API_BASE_URL } from "@/lib/constants/route";
// import { NextResponse } from "next/server";
// // import { API_BASE_URL } from "@/app/constants/route";

// // Agar aapka real backend API hai
// export async function GET() {
//   const res = await fetch(`${API_BASE_URL}/api/charter-bookings`); // real API
//   const json = await res.json();

//   // json.data me woh real data hai jo aapne share kiya
//   return NextResponse.json({
//     message: json.message,
//     status: json.status,
//     data: json.data,
//   });
// }
import { API_BASE_URL } from "@/lib/constants/route";
import { NextResponse } from "next/server";

async function getBackendResponse(res: Response) {
  const contentType = res.headers.get("content-type");
  const text = await res.text();

  try {
    return {
      body: text ? JSON.parse(text) : { message: res.statusText },
      contentType: contentType ?? "application/json",
    };
  } catch {
    return {
      body: { message: text || res.statusText },
      contentType: "application/json",
    };
  }
}

export async function GET() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/charter-bookings`, {
      cache: "no-store",
    });

    const { body, contentType } = await getBackendResponse(res);

    return new NextResponse(
      typeof body === "string" ? body : JSON.stringify(body),
      {
        status: res.status,
        headers: {
          "Content-Type": contentType,
        },
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
