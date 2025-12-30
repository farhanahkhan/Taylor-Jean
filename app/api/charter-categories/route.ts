// app/api/charter-categories/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch(
    "http://mobileapp.designswebs.com:5431/api/charter-categories"
  );
  const data = await res.json();

  return NextResponse.json(data);
}
