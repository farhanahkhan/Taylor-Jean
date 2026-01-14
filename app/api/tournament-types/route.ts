import { NextRequest, NextResponse } from "next/server";

// APIs
const TOURNAMENT_TYPES_API =
  "http://mobileapp.designswebs.com:5431/api/setup/tournament-types/get-all";
const SPECIES_API =
  "http://mobileapp.designswebs.com:5431/api/charter-categories/species_type";

// Interfaces
interface TournamentType {
  id: string;
  name: string;
  isActive: boolean;
}
interface Species {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}
interface ApiResponse<T> {
  message: string;
  status: boolean;
  statusCode: number;
  data: T[];
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type")?.toLowerCase().trim();

  let API_URL = "";
  switch (type) {
    case "tournament-types":
      API_URL = TOURNAMENT_TYPES_API;
      break;
    case "species":
      API_URL = SPECIES_API;
      break;
    default:
      return NextResponse.json<ApiResponse<unknown>>(
        {
          message: "Invalid API type",
          status: false,
          statusCode: 400,
          data: [],
        },
        { status: 400 }
      );
  }

  try {
    const res = await fetch(API_URL, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!res.ok) {
      return NextResponse.json<ApiResponse<unknown>>(
        {
          message: "Failed to fetch data",
          status: false,
          statusCode: res.status,
          data: [],
        },
        { status: res.status }
      );
    }

    const result: { data: TournamentType[] | Species[] } = await res.json();

    const filteredData = result.data.filter((item) => item.isActive);

    return NextResponse.json<ApiResponse<TournamentType | Species>>(
      { message: "Success", status: true, statusCode: 200, data: filteredData },
      { status: 200 }
    );
  } catch {
    return NextResponse.json<ApiResponse<unknown>>(
      {
        message: "Internal Server Error",
        status: false,
        statusCode: 500,
        data: [],
      },
      { status: 500 }
    );
  }
}
