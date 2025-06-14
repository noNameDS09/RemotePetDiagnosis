import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET_KEY = process.env.JWT_SECRET;

async function verifyAndDecodeToken(token: string) {
  if (!JWT_SECRET_KEY) {
    console.error("JWT_SECRET environment variable is not set.");
    return null;
  }

  try {
    const secret = new TextEncoder().encode(JWT_SECRET_KEY);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    console.warn(
      "Token verification failed:",
      error instanceof Error ? error.message : error
    );
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const pathname = request.nextUrl.pathname;

  // console.log("🔍 pathname:", pathname);
  // console.log("🔍 token present:", !!token);

  if (!token) {
    // console.log("❌ No token — redirecting to /login");
    if (pathname === "/auth/login" || pathname === "/auth/signup") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  const payload = await verifyAndDecodeToken(token);
  // console.log("🔍 decoded payload:", payload);

  if (!payload) {
    // console.log("❌ Invalid token — redirecting to /login and deleting cookie");
    const res = NextResponse.redirect(new URL("/auth/login", request.url));
    res.cookies.delete("auth_token");
    return res;
  }

  const isDoctor = payload.isDoctor;
  // console.log("✅ isDoctor:", isDoctor);

  if (isDoctor && pathname.startsWith("/dashboard/user")) {
    // console.log("🔁 Doctor trying to access /user — redirecting to /doctor");
    return NextResponse.redirect(new URL("/dashboard/doctor", request.url));
  }

  if (!isDoctor && pathname.startsWith("/dashboard/doctor")) {
    // console.log("🔁 User trying to access /doctor — redirecting to /user");
    return NextResponse.redirect(new URL("/dashboard/user", request.url));
  }

  if (pathname === "/auth/login" || pathname === "/auth/signup") {
    // console.log("🔁 Already logged in — redirecting to home");
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}


export const config = {
  matcher: [
    "/dashboard/doctor/:path*",
    "/dashboard/user/:path*",
    "/auth/login",
    "/auth/signup",
    "/", // optional: home
  ],
};
