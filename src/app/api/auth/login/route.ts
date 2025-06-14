import { type NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      console.error("JWT_SECRET environment variable is not set.");
      return NextResponse.json(
        { message: "Server configuration error: JWT_SECRET is missing." },
        { status: 500 }
      );
    }

    const { email, password, isDoctor } = await request.json();

    if (!email || !password || isDoctor == null || isDoctor === undefined) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    if (!isDoctor) {
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("id, email, name, phone_no, address, password, is_doctor")
        .eq("email", email)
        .single();

      if (userError || !user) {
        if (userError) {
          console.error("Supabase error fetching user:", userError.message);
        }
        return NextResponse.json(
          { message: "Invalid email or password" },
          { status: 401 }
        );
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        user.password
      );

      if (!isPasswordValid) {
        return NextResponse.json(
          { message: "Invalid email or password" },
          { status: 401 }
        );
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email, isDoctor: false, sub:user.id },
        JWT_SECRET,
        { expiresIn: "1d" }
      );

      const response = NextResponse.json({
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone_no: user.phone_no,
          address: user.address,
          isDoctor:user.is_doctor
        },
      });

      response.cookies.set("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60,
      });

      return response;
    } else {
      const { data: doctor, error: doctorError } = await supabase
        .from("doctors")
        .select("id, email, password, is_doctor")
        .eq("email", email)
        .single();

      if (doctorError || !doctor) {
        if (doctorError) {
          console.error("Supabase error fetching doctor:", doctorError.message);
        }
        return NextResponse.json(
          { message: "Invalid email or password" },
          { status: 401 }
        );
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        doctor.password
      );

      if (!isPasswordValid) {
        return NextResponse.json(
          { message: "Invalid email or password" },
          { status: 401 }
        );
      }

      const token = jwt.sign(
        { doctorId: doctor.id, email: doctor.email, isDoctor: true },
        JWT_SECRET,
        { expiresIn: "1d" }
      );

      const response = NextResponse.json({
        message: "Login successful",
        doctor: {
          id: doctor.id,
          email: doctor.email,
          isDoctor:doctor.is_doctor
        },
      });

      response.cookies.set("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60,
      });

      return response;
    }
  } catch (error) {
    console.error("Login error:", error);
    if (error instanceof SyntaxError && error.message.includes("JSON")) {
      return NextResponse.json(
        { message: "Invalid request format. Expected JSON." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
