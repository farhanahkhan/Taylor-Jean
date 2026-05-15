import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/constants/route";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    const body = await req.json();

    const payload = {
      SizeValue: body.SizeValue,

      isActive: body.isActive,
    };

    const res = await fetch(`${API_BASE_URL}/api/merch/sizes/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const contentType = res.headers.get("content-type");

    const responseBody = contentType?.includes("application/json")
      ? await res.json()
      : await res.text();

    return new NextResponse(
      typeof responseBody === "string"
        ? responseBody
        : JSON.stringify(responseBody),
      {
        status: res.status,
        headers: {
          "Content-Type": contentType ?? "application/json",
        },
      },
    );
  } catch (error) {
    console.error("PUT Merch Category Error:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    const res = await fetch(`${API_BASE_URL}/api/merch/sizes/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const contentType = res.headers.get("content-type");

    const responseBody = contentType?.includes("application/json")
      ? await res.json()
      : await res.text();

    return new NextResponse(
      typeof responseBody === "string"
        ? responseBody
        : JSON.stringify(responseBody),
      {
        status: res.status,
        headers: {
          "Content-Type": contentType ?? "application/json",
        },
      },
    );
  } catch (error) {
    console.error("DELETE Merch Category Error:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
