// app/api/merch/route.ts
import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "http://mobileapp.designswebs.com:5431/api/merch";

/* =======================
   POST HANDLER (CREATE PRODUCT)
======================= */
export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    // --- Ensure valid image URL ---
    const imageUrl =
      payload.imageUrl && payload.imageUrl.trim() !== ""
        ? payload.imageUrl
        : "https://mobileapp.designswebs.com/placeholder.svg";

    const body = {
      name: payload.name,
      price: payload.price,
      categoryId: payload.categoryId, // must send ID
      description: payload.description || "",
      imageUrl,
      colorIds: payload.colorIds || [],
      sizeIds: payload.sizeIds || [],
      isActive: true,
    };

    const res = await fetch(`${BASE_URL}/products/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("POST error:", err);
    return NextResponse.json(
      { message: "Create product failed" },
      { status: 500 }
    );
  }
}

/* =======================
   GET HANDLER (for categories/colors/sizes)
======================= */
export async function GET(req: NextRequest) {
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

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, { cache: "no-store" });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
