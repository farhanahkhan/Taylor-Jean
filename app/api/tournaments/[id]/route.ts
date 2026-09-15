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
  remarks: string;
};
type TournamentCalcuttaPayload = {
  calcuttaName: string;
  entryFee: number;
  adminFeePercentage: number;
  payoutStructure: string; // ADD BACK
  minTeamLimit: number;
  maxTeamLimit: number;
  remarks: string;
  speciesIds: string[];

  prizes: {
    prizeName: string;
    prizeType: string;
    value: number;
    placement: string;
    remarks: string;
  }[];
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
    console.log("BODY FROM FRONTEND:", body);

    const payload = {
      name: body.name,
      place: body.place,
      tournamentTypeId: body.tournamentTypeId,
      isAutoPoint: body.isAutoPoint ?? false,
      startDate: body.startDate,
      endDate: body.endDate,

      latitude: Number(body.latitude) || 0,
      longitude: Number(body.longitude) || 0,
      adminFeePercentage: Number(body.adminFeePercentage) || 0,
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
          remarks: item.remarks || "",
        })) || [],

      tournamentCalcuttas:
        body.tournamentCalcuttas?.map((item: TournamentCalcuttaPayload) => ({
          calcuttaName: item.calcuttaName,

          entryFee: Number(item.entryFee) || 0,

          adminFeePercentage: Number(item.adminFeePercentage) || 0,
          payoutStructure: item.payoutStructure || "Winner Takes All",

          minTeamLimit: Number(item.minTeamLimit) || 0,

          maxTeamLimit: Number(item.maxTeamLimit) || 0,

          remarks: item.remarks || "",

          speciesIds: item.speciesIds || [],

          prizes:
            item.prizes?.map((prize) => ({
              prizeName: prize.prizeName,

              prizeType: prize.prizeType,

              value: Number(prize.value) || 0,

              placement: prize.placement,

              remarks: prize.remarks || "",
            })) || [],
        })) || [],
    };
    console.log("PAYLOAD TO BACKEND:", payload);
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
    console.log("BACKEND RESPONSE:", responseBody);

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
