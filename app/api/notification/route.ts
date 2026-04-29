// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();

//     const { title, message, userId, teamId } = body;

//     // basic validation
//     if (!title || !message) {
//       return NextResponse.json(
//         { error: "Title and message are required" },
//         { status: 400 }
//       );
//     }

//     // API call to your backend
//     const response = await fetch(
//       "http://mobileapp.designswebs.com:5431/api/notifications",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           title,
//           message,
//           userId,
//           teamId,
//         }),
//       }
//     );

//     const data = await response.json();

//     return NextResponse.json(data, { status: response.status });
//   } catch (error) {
//     console.error("Error:", error);

//     return NextResponse.json(
//       { error: "Something went wrong" },
//       { status: 500 }
//     );
//   }
// }
// import { NextRequest, NextResponse } from "next/server";
// import { API_BASE_URL } from "@/lib/constants/route";

// export async function POST(req: NextRequest) {
//   try {
//     const accessToken = req.cookies.get("accessToken")?.value;

//     if (!accessToken) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const body = await req.json();

//     const res = await fetch(`${API_BASE_URL}/api/notifications`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(body),
//     });

//     const data = await res.json();
//     return NextResponse.json(data, { status: res.status });
//   } catch (error) {
//     console.error("Notification error:", error);

//     return NextResponse.json(
//       { message: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/constants/route";

export async function POST(req: NextRequest) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const res = await fetch(`${API_BASE_URL}/api/notifications`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const contentType = res.headers.get("content-type");

    let responseBody;

    if (contentType?.includes("application/json")) {
      responseBody = await res.json();
    } else {
      responseBody = await res.text();
    }

    // 🔥 IMPORTANT: forward backend message
    if (!res.ok) {
      return NextResponse.json(
        {
          message:
            responseBody?.message || responseBody || "Something went wrong",
        },
        { status: res.status }
      );
    }

    // ✅ success case
    return NextResponse.json(responseBody, { status: res.status });
  } catch (error) {
    console.error("Notification error:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
