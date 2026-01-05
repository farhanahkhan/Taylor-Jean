// app/api/merch/route.ts
import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "http://mobileapp.designswebs.com:5431/api/merch";

/* =======================
   TYPES
======================= */
interface ColorPayload {
  id: string;
  name: string;
  hex: string;
}

interface SizePayload {
  id: string;
  sizeValue: string;
}

interface CreateProductPayload {
  name: string;
  price: number;
  category: string;
  description?: string;
  image?: string;
  colors?: ColorPayload[];
  sizes?: SizePayload[];
}

/* =======================
   GET HANDLER
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
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      cache: "no-store",
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

/* =======================
   POST HANDLER (CREATE PRODUCT)
======================= */
export async function POST(req: NextRequest) {
  try {
    const payload: CreateProductPayload = await req.json();

    const body = {
      name: payload.name,
      price: payload.price,
      categoryName: payload.category,
      description: payload.description,
      imageUrl: payload.image,
      colors: payload.colors?.map((c) => ({
        id: c.id,
        name: c.name,
        hexCode: c.hex,
      })),
      sizes: payload.sizes,
    };

    const res = await fetch(`${BASE_URL}/products/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { message: "Create product failed" },
      { status: 500 }
    );
  }
}
