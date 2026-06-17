// // app/api/CharterServiceItem/route.ts

// import { NextRequest, NextResponse } from "next/server";
// import { API_BASE_URL } from "@/lib/constants/route";

// const EXTERNAL_API = `${API_BASE_URL}/api/CharterServiceItem`;

// export async function GET(req: NextRequest) {
//   try {
//     const accessToken = req.cookies.get("accessToken")?.value;

//     if (!accessToken) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const res = await fetch(EXTERNAL_API + "/all", {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         "Content-Type": "application/json",
//       },
//     });

//     const data = await res.json();
//     return NextResponse.json(data);
//   } catch (error) {
//     return NextResponse.json(
//       { message: "Failed to fetch services", error },
//       { status: 500 },
//     );
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     const accessToken = req.cookies.get("accessToken")?.value;
//     if (!accessToken) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }
//     const body = await req.json();

//     const res = await fetch(EXTERNAL_API, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(body),
//     });

//     const data = await res.json();
//     return NextResponse.json(data);
//   } catch (error) {
//     return NextResponse.json(
//       { message: "Failed to add service", error },
//       { status: 500 },
//     );
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/constants/route";

const EXTERNAL_API = `${API_BASE_URL}/api/CharterServiceItem`;

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

    const res = await fetch(`${EXTERNAL_API}/all`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const { body, contentType } = await getBackendResponse(res);

    return sendBackendResponse(res, body, contentType);
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

export async function POST(req: NextRequest) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const res = await fetch(EXTERNAL_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const { body: responseBody, contentType } = await getBackendResponse(res);

    return sendBackendResponse(res, responseBody, contentType);
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
