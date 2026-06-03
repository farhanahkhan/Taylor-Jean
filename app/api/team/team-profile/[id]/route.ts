import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/constants/route";

type ApiTeam = {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  length: number;
  engine: string;
  gadgets: string;
  boatName: string;
  imageUrl: string | null;
  isActive: boolean;
};

type TeamsResponse = {
  data?: ApiTeam[] | { items?: ApiTeam[]; data?: ApiTeam[] };
};

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
      name: body.name,

      displayName: body.displayName,
      description: body.description,
      length: body.length,
      engine: body.engine,
      gadgets: body.gadgets,
      boatName: body.boatName,
      imageUrl: body.imageUrl,
      isActive: body.isActive,
    };

    const res = await fetch(`${API_BASE_URL}/api/general-teams/${id}`, {
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

    const res = await fetch(`${API_BASE_URL}/api/general-teams/${id}`, {
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
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const res = await fetch(`${API_BASE_URL}/api/general-teams`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const result: TeamsResponse = await res.json();

    const teams: ApiTeam[] = Array.isArray(result.data)
      ? result.data
      : Array.isArray(result.data?.items)
        ? result.data.items
        : Array.isArray(result.data?.data)
          ? result.data.data
          : [];

    const team = teams.find((item) => item.id === id);

    if (!team) {
      return NextResponse.json(
        {
          message: "Team not found",
          searchedId: id,
          availableIds: teams.map((item) => item.id),
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      status: true,
      data: team,
    });
  } catch (error) {
    console.error("GET Team Profile Error:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
