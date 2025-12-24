import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;

  // Protect dashboard routes
  if (req.nextUrl.pathname.startsWith("/dashboard") && !accessToken) {
    // Agar token nahi hai → redirect to login
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// Apply middleware only on dashboard routes
export const config = {
  matcher: ["/dashboard/:path*"],
};
