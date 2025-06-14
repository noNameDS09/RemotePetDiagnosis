// /app/api/me/route.ts (or /pages/api/me.ts if using pages router)
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token, JWT_SECRET) as { isDoctor: boolean };

    return NextResponse.json({ isDoctor: decoded.isDoctor });
  } catch (err) {
    console.error("JWT decode error", err);
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}
