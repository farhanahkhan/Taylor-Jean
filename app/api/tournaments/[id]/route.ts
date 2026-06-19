import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/constants/route";
type TournamentSpeciesPayload = {
  speciesId: string;
  points: number;
};
type TournamentPrizePayload = {
  prizeName: string;
  prizeType: string;
  value: number;
  placement: string;
};
type TournamentCalcuttaPayload = {
  calcuttaName: string;
  entryFee: number;
  payoutStructure: string;
  minTeamLimit: number;
  maxTeamLimit: number;
  speciesIds: string[];
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
      place: body.place,
      tournamentTypeId: body.tournamentTypeId,

      startDate: body.startDate,
      endDate: body.endDate,

      latitude: Number(body.latitude) || 0,
      longitude: Number(body.longitude) || 0,

      entryFee: Number(body.entryFee) || 0,
      points: Number(body.points) || 0,

      description: body.description || "",
      imageUrl: body.imageUrl || "",

      tournamentSpecies:
        body.tournamentSpecies?.map((item: TournamentSpeciesPayload) => ({
          speciesId: item.speciesId,
          points: Number(item.points) || 0,
        })) || [],
      tournamentPrizes:
        body.tournamentPrizes?.map((item: TournamentPrizePayload) => ({
          prizeName: item.prizeName,
          prizeType: item.prizeType,
          value: Number(item.value) || 0,
          placement: item.placement,
        })) || [],
      tournamentCalcuttas:
        body.tournamentCalcuttas?.map((item: TournamentCalcuttaPayload) => ({
          calcuttaName: item.calcuttaName,
          entryFee: Number(item.entryFee) || 0,
          payoutStructure: item.payoutStructure || "",
          minTeamLimit: Number(item.minTeamLimit) || 0,
          maxTeamLimit: Number(item.maxTeamLimit) || 0,
          speciesIds: item.speciesIds || [],
        })) || [],
    };
    const res = await fetch(`${API_BASE_URL}/api/tournaments/${id}`, {
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
    console.error("PUT Charter Service Error:", error);

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

    const res = await fetch(`${API_BASE_URL}/api/tournaments/${id}`, {
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
    console.error("DELETE Charter Service Error:", error);

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

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    const res = await fetch(`${API_BASE_URL}/api/tournaments/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
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
    console.error("GET Tournament Detail Error:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
