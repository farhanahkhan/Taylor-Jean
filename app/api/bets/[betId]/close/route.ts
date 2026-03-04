// import { NextRequest, NextResponse } from "next/server";
// import { API_BASE_URL } from "@/lib/constants/route";

// export async function POST(
//   req: NextRequest,
//   { params }: { params: { betId: string } }
// ) {
//   try {
//     const accessToken = req.cookies.get("accessToken")?.value;

//     if (!accessToken) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const { betId } = params;
//     console.log("BET ID FROM PARAMS:", betId);

//     const body = await req.json();
//     const { winningOptionId } = body;

//     if (!winningOptionId) {
//       return NextResponse.json(
//         { message: "winningOptionId is required" },
//         { status: 400 }
//       );
//     }

//     const externalRes = await fetch(`${API_BASE_URL}/api/Bets/${betId}/close`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${accessToken}`,
//       },
//       body: JSON.stringify({ winningOptionId }),
//     });

//     const contentType = externalRes.headers.get("content-type");

//     let responseBody;

//     if (contentType?.includes("application/json")) {
//       responseBody = await externalRes.json();
//     } else {
//       responseBody = await externalRes.text();
//     }

//     return new NextResponse(
//       typeof responseBody === "string"
//         ? responseBody
//         : JSON.stringify(responseBody),
//       {
//         status: externalRes.status,
//         headers: {
//           "Content-Type": contentType ?? "application/json",
//         },
//       }
//     );
//   } catch (error) {
//     console.error("Close market error:", error);
//     return NextResponse.json(
//       { message: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/constants/route";

export async function POST(
  req: NextRequest,
  { params }: { params: { betId: string } }
) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { betId } = params;

    if (!betId) {
      return NextResponse.json(
        { message: "betId param is required" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { winningOptionId } = body;

    if (!winningOptionId) {
      return NextResponse.json(
        { message: "winningOptionId is required" },
        { status: 400 }
      );
    }

    const externalRes = await fetch(
      `http://mobileapp.designswebs.com:5431/api/Bets/${betId}/close`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ winningOptionId }),
      }
    );

    const contentType = externalRes.headers.get("content-type");

    let responseBody;
    if (contentType?.includes("application/json")) {
      responseBody = await externalRes.json();
    } else {
      responseBody = await externalRes.text();
    }

    return new NextResponse(
      typeof responseBody === "string"
        ? responseBody
        : JSON.stringify(responseBody),
      {
        status: externalRes.status,
        headers: { "Content-Type": contentType ?? "application/json" },
      }
    );
  } catch (error) {
    console.error("Close market error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
