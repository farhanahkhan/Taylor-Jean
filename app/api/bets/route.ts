// import { API_BASE_URL } from "@/lib/constants/route";
// import { NextRequest, NextResponse } from "next/server";

// async function safeJson(res: Response) {
//   const text = await res.text();

//   try {
//     return text ? JSON.parse(text) : {};
//   } catch {
//     return {
//       message: text || "Invalid response from backend",
//     };
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     const accessToken = req.cookies.get("accessToken")?.value;

//     if (!accessToken) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const body = await req.json();

//     const { tournamentId, title, description, startTime, endTime, options } =
//       body;

//     if (!tournamentId || !title || !description || !startTime || !endTime) {
//       return NextResponse.json(
//         {
//           status: false,
//           message: "All required fields must be filled.",
//         },
//         { status: 400 },
//       );
//     }

//     // if (!options || options.length === 0) {
//     //   return NextResponse.json(
//     //     { message: "At least one option is required." },
//     //     { status: 400 }
//     //   );
//     // }

//     // ✅ Call Backend with Authorization header
//     const response = await fetch(`${API_BASE_URL}/api/Bets`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${accessToken}`, // 🔥 IMPORTANT
//       },
//       body: JSON.stringify(body),
//     });

//     const data = await safeJson(response);

//     if (!response.ok) {
//       return NextResponse.json(
//         {
//           status: false,
//           message: data?.message || response.statusText || "Backend error",
//           error: data,
//         },
//         { status: response.status },
//       );
//     }

//     return NextResponse.json(data, { status: response.status });
//   } catch (error) {
//     return NextResponse.json(
//       {
//         status: false,
//         message:
//           error instanceof Error ? error.message : "Internal Server Error",
//       },
//       { status: 500 },
//     );
//   }
// }
import { API_BASE_URL } from "@/lib/constants/route";
import { NextRequest, NextResponse } from "next/server";

async function getBackendResponse(res: Response) {
  const text = await res.text();

  if (!text) {
    return {
      message: res.statusText || "Empty response from backend",
    };
  }

  try {
    return JSON.parse(text);
  } catch {
    return {
      message: text,
    };
  }
}

export async function POST(req: NextRequest) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { status: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await req.json();

    const { tournamentId, title, description, startTime, endTime } = body;

    if (!tournamentId || !title || !description || !startTime || !endTime) {
      return NextResponse.json(
        {
          status: false,
          message: "All required fields must be filled.",
        },
        { status: 400 },
      );
    }

    const response = await fetch(`${API_BASE_URL}/api/Bets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    const backendData = await getBackendResponse(response);

    if (!response.ok) {
      return NextResponse.json(backendData, {
        status: response.status,
      });
    }

    return NextResponse.json(backendData, {
      status: response.status,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: false,
        message:
          error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
