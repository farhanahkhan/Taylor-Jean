// import { API_BASE_URL } from "@/lib/constants/route";
// import { NextRequest, NextResponse } from "next/server";

// export async function GET(req: NextRequest) {
//   try {
//     const accessToken = req.cookies.get("accessToken")?.value;

//     if (!accessToken) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const { searchParams } = new URL(req.url);
//     const type = searchParams.get("type");

//     if (type === "users") {
//       const res = await fetch(`${API_BASE_URL}/api/users`, {
//         cache: "no-store",
//         headers: { Authorization: `Bearer ${accessToken}` },
//       });
//       const data = await res.json();
//       return NextResponse.json(data);
//     }

//     if (type === "add-members") {
//       const teamId = searchParams.get("teamId");

//       if (!teamId) {
//         return NextResponse.json(
//           { message: "teamId is required" },
//           { status: 400 },
//         );
//       }

//       const res = await fetch(
//         `${API_BASE_URL}/api/general-teams/${teamId}/members`,
//         {
//           cache: "no-store",
//           headers: { Authorization: `Bearer ${accessToken}` },
//         },
//       );
//       const data = await res.json();
//       return NextResponse.json(data);
//     }

//     return NextResponse.json({ message: "Invalid type" }, { status: 400 });
//   } catch (error) {
//     return NextResponse.json({ message: "GET failed", error }, { status: 500 });
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     const accessToken = req.cookies.get("accessToken")?.value;

//     if (!accessToken) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const body = await req.json();

//     if (body.type === "add-member") {
//       const { generalTeamId, userId, generalTeamName } = body;

//       const res = await fetch(`${API_BASE_URL}/api/general-teams/add-member`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${accessToken}`,
//         },
//         body: JSON.stringify({ generalTeamId, userId, generalTeamName }),
//       });

//       const data = await res.json();
//       return NextResponse.json(data);
//     }

//     return NextResponse.json({ message: "Invalid POST type" }, { status: 400 });
//   } catch (error) {
//     return NextResponse.json(
//       { message: "POST failed", error },
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

function sendBackendResponse(
  res: Response,
  body: unknown,
  contentType: string,
) {
  return new NextResponse(
    typeof body === "string" ? body : JSON.stringify(body),
    {
      status: res.status,
      headers: {
        "Content-Type": contentType,
      },
    },
  );
}

export async function GET(req: NextRequest) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    let url = "";

    if (type === "users") {
      url = `${API_BASE_URL}/api/users`;
    } else if (type === "add-members") {
      const teamId = searchParams.get("teamId");

      if (!teamId) {
        return NextResponse.json(
          { message: "teamId is required" },
          { status: 400 },
        );
      }

      url = `${API_BASE_URL}/api/general-teams/${teamId}/members`;
    } else {
      return NextResponse.json({ message: "Invalid type" }, { status: 400 });
    }

    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const { body, contentType } = await getBackendResponse(res);

    return sendBackendResponse(res, body, contentType);
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "GET failed",
      },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    if (body.type !== "add-member") {
      return NextResponse.json(
        { message: "Invalid POST type" },
        { status: 400 },
      );
    }

    const { generalTeamId, userId, generalTeamName } = body;

    const res = await fetch(`${API_BASE_URL}/api/general-teams/add-member`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        generalTeamId,
        userId,
        generalTeamName,
      }),
    });

    const { body: responseBody, contentType } = await getBackendResponse(res);

    return sendBackendResponse(res, responseBody, contentType);
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "POST failed",
      },
      { status: 500 },
    );
  }
}
