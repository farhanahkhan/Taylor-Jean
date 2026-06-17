import { API_BASE_URL } from "@/lib/constants/route";
import { NextRequest, NextResponse } from "next/server";

const BASE_URL = `${API_BASE_URL}/api/merch`;

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

export async function POST(req: NextRequest) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const payload = await req.json();

    const res = await fetch(`${BASE_URL}/products/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const { body, contentType } = await getBackendResponse(res);

    return sendBackendResponse(res, body, contentType);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}

// export async function GET(req: NextRequest) {
//   const { searchParams } = new URL(req.url);
//   const type = searchParams.get("type");

//   let endpoint = "";
//   switch (type) {
//     case "products":
//       endpoint = "/products/get-all";
//       break;
//     case "colors":
//       endpoint = "/colors/get-all";
//       break;
//     case "categories":
//       endpoint = "/categories/get-all";
//       break;
//     case "sizes":
//       endpoint = "/sizes/get-all";
//       break;
//     default:
//       return NextResponse.json({ message: "Invalid type" }, { status: 400 });
//   }

//   try {
//     const res = await fetch(`${BASE_URL}${endpoint}`, { cache: "no-store" });
//     const data = await res.json();
//     return NextResponse.json(data, { status: res.status });
//   } catch (err) {
//     console.error("GET error:", err);
//     return NextResponse.json({ message: "Server error" }, { status: 500 });
//   }
// }

// export async function GET(req: NextRequest) {
//   try {
//     const accessToken = req.cookies.get("accessToken")?.value;
//     if (!accessToken) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }
//     const { searchParams } = new URL(req.url);
//     const type = searchParams.get("type");
//     let endpoint = "";
//     switch (type) {
//       case "products":
//         endpoint = "/products/get-all";
//         break;
//       case "colors":
//         endpoint = "/colors/get-all";
//         break;
//       case "categories":
//         endpoint = "/categories/get-all";
//         break;
//       case "sizes":
//         endpoint = "/sizes/get-all";
//         break;
//       default:
//         return NextResponse.json({ message: "Invalid type" }, { status: 400 });
//     }
//     const res = await fetch(`${BASE_URL}${endpoint}`, {
//       cache: "no-store",
//       headers: { Authorization: `Bearer ${accessToken}` },
//     });
//     const data = await res.json();
//     return NextResponse.json(data, { status: res.status });
//   } catch (err) {
//     console.error("GET error:", err);
//     return NextResponse.json({ message: "Server error" }, { status: 500 });
//   }
// }
export async function GET(req: NextRequest) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    let endpoint = "";

    switch (type) {
      case "products":
        endpoint = "/products/get-all";
        break;
      case "colors":
        endpoint = "/colors/get-all";
        break;
      case "categories":
        endpoint = "/categories/get-all";
        break;
      case "sizes":
        endpoint = "/sizes/get-all";
        break;
      default:
        return NextResponse.json({ message: "Invalid type" }, { status: 400 });
    }

    const res = await fetch(`${BASE_URL}${endpoint}`, {
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
        message: error instanceof Error ? error.message : "Server error",
      },
      { status: 500 },
    );
  }
}
