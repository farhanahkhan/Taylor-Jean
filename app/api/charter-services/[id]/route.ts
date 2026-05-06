// import { API_BASE_URL } from "@/lib/constants/route";
// import { NextRequest, NextResponse } from "next/server";

// export async function PUT(
//   req: NextRequest,
//   context: { params: { id: string } }
// ) {
//   const { params } = context;

//   console.log("PARAM ID:", params?.id);

//   const accessToken = req.cookies.get("accessToken")?.value;

//   if (!accessToken) {
//     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     const body = await req.json();

//     const res = await fetch(
//       `${API_BASE_URL}/api/charter-services/${params.id}`,
//       {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(body),
//       }
//     );

//     const data = await res.json();

//     // return NextResponse.json(data);
//     return NextResponse.json(data, { status: res.status });
//   } catch (error) {
//     return NextResponse.json(
//       { status: false, message: "Something went wrong" },
//       { status: 500 }
//     );
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/constants/route";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
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
      charterName: body.charterName,
      description: body.description,
      baseAmount: body.baseAmount,
      categoryId: body.categoryId,
      imageUrl: body.imageUrl,
      isActive: body.isActive,
    };

    const res = await fetch(`${API_BASE_URL}/api/charter-services/${id}`, {
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
      }
    );
  } catch (error) {
    console.error("PUT Charter Service Error:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
