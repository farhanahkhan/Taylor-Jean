import { NextResponse } from "next/server";

const API_URL = "http://mobileapp.designswebs.com:5431/api/CharterServiceItem";

export async function GET() {
  const res = await fetch(API_URL, { cache: "no-store" });
  const data = await res.json();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      serviceName: body.name,
      description: body.description,
      price: body.amount,
    }),
  });

  const data = await res.json();
  return NextResponse.json(data);
}
