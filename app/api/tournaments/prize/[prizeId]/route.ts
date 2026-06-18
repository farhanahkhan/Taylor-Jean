import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/constants/route";

async function getBackendResponse(res: Response) {
  const contentType = res.headers.get("content-type");
  const text = await res.text();

  let body: unknown;

  try {
    body = text ? JSON.parse(text) : { message: res.statusText };
  } catch {
    body = { message: text || res.statusText };
  }

  return {
    body,
    contentType: contentType ?? "application/json",
  };
}

function returnBackendResponse(
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

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ prizeId: string }> },
) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { prizeId } = await context.params;

    if (!prizeId || prizeId === "undefined") {
      return NextResponse.json(
        { message: "Prize ID is required" },
        { status: 400 },
      );
    }

    const res = await fetch(
      `${API_BASE_URL}/api/tournaments/prize/${prizeId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    const { body: backendBody, contentType } = await getBackendResponse(res);

    return returnBackendResponse(res, backendBody, contentType);
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
