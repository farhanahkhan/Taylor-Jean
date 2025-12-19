import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const apiRes = await fetch(
      "http://mobileapp.designswebs.com:5431/api/Auth/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    const result = await apiRes.json();

    if (!apiRes.ok) {
      return NextResponse.json(
        { message: result.message || "Login failed" },
        { status: 400 }
      );
    }

    // ✅ Create response WITHOUT tokens
    const response = NextResponse.json({
      message: "Login successful",
      statusCode: 200,
      status: true,
      data: {
        email: result.data.email,
        role: result.data.role,
      },
    });

    // 🔒 accessToken → httpOnly cookie
    response.cookies.set({
      name: "accessToken",
      value: result.data.accessToken,
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    // 🔒 refreshToken → httpOnly cookie
    response.cookies.set({
      name: "refreshToken",
      value: result.data.refreshToken,
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err) {
    return NextResponse.json(
      {
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}
