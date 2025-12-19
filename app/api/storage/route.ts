import { NextResponse } from "next/server";
import * as jwt from "jsonwebtoken";
import { cookies } from "next/headers";

type UserPayload = {
  sub: string;
  email: string;
  role: string;
};

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;

    return NextResponse.json({
      userId: decoded.sub,
      email: decoded.email,
      role: decoded.role,
    });
  } catch {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}
