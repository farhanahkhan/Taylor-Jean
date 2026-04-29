import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "http://mobileapp.designswebs.com:5431/api/kyc/admin";

interface BackendResponse {
  message?: string;
  status?: boolean;
  data?: unknown;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body: { isApproved: boolean; notes?: string } = await req.json();

    const res = await fetch(`${API_BASE_URL}/review/${params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        isApproved: body.isApproved,
        rejectionReason: body.notes ?? "",
      }),
    });

    // 👇 Safe response handling
    const text = await res.text();

    let data: BackendResponse = {};

    if (text) {
      data = JSON.parse(text);
    }

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Server Error:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
