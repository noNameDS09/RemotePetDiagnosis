import { type NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, isDoctor, phone_no, address } = await request.json();

    if (!name || !email || !password || isDoctor === undefined) {
      return NextResponse.json(
        { message: "Please provide all the required fields!" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: "Invalid email format" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { data: existingUser, error: userError } = await supabase
      .from("users")
      .select("email")
      .eq("email", email)
      .maybeSingle();

    if (userError && userError.code !== "PGRST116") {
      return NextResponse.json({ message: "Error checking user" }, { status: 500 });
    }
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 409 });
    }

    // Check if doctor already exists
    const { data: existingDoctor, error: doctorError } = await supabase
      .from("doctors")
      .select("email")
      .eq("email", email)
      .maybeSingle();

    if (doctorError && doctorError.code !== "PGRST116") {
      return NextResponse.json({ message: "Error checking doctor" }, { status: 500 });
    }
    if (existingDoctor) {
      return NextResponse.json({ message: "Doctor already exists" }, { status: 409 });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (!isDoctor) {
      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert([
          {
            name,
            email,
            phone_no,
            address,
            password: hashedPassword,
            is_doctor:isDoctor
          },
        ])
        .select("id, email, created_at")
        .single();

      if (insertError) {
        return NextResponse.json({ message: "Could not create user" }, { status: 500 });
      }

      return NextResponse.json(
        { message: "Signup successful", user: newUser },
        { status: 201 }
      );
    } else {
      const { data: newDoctor, error: insertError } = await supabase
        .from("doctors")
        .insert([
          {
            name,
            email,
            password: hashedPassword,
            is_doctor:isDoctor
          },
        ])
        .select("id, email, created_at")
        .single();

      if (insertError) {
        return NextResponse.json({ message: "Could not create doctor" }, { status: 500 });
      }

      return NextResponse.json(
        { message: "Signup successful", doctor: newDoctor },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
