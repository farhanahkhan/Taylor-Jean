// // }
// import { API_BASE_URL } from "@/lib/constants/route";
// import { NextRequest, NextResponse } from "next/server";

// export async function GET(
//   // request: Request,
//   req: NextRequest,
//   { params }: { params: Promise<{ id: string }> },
// ) {
//   try {
//     const accessToken = req.cookies.get("accessToken")?.value;
//     const { id: tournamentId } = await params; // ✅ IMPORTANT
//     console.log("Tournament ID:", tournamentId);

//     if (!tournamentId) {
//       return NextResponse.json(
//         { status: false, message: "Tournament ID missing" },
//         { status: 400 },
//       );
//     }

//     const res = await fetch(
//       `${API_BASE_URL}/api/team-activities/team-points/${tournamentId}`,
//       {
//         method: "GET",
//         headers: {
//           Accept: "application/json",
//           Authorization: `Bearer ${accessToken}`,
//         },
//         cache: "no-store",
//       },
//     );

//     if (!res.ok) {
//       const errorData = await res.json();
//       return NextResponse.json(errorData, { status: res.status });
//     }

//     const data = await res.json();
//     return NextResponse.json(data);
//   } catch (error) {
//     console.error("Team Points Route error:", error);

//     return NextResponse.json(
//       { status: false, message: "Server error" },
//       { status: 500 },
//     );
//   }
// }
import { API_BASE_URL } from "@/lib/constants/route";
import { NextRequest, NextResponse } from "next/server";

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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;
    const { id: tournamentId } = await params;

    if (!tournamentId) {
      return NextResponse.json(
        { status: false, message: "Tournament ID missing" },
        { status: 400 },
      );
    }

    const res = await fetch(
      `${API_BASE_URL}/api/team-activities/team-points/${tournamentId}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      },
    );

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
        status: false,
        message: error instanceof Error ? error.message : "Server error",
      },
      { status: 500 },
    );
  }
}
