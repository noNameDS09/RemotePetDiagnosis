import { type NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { email, password, isDoctor } = await request.json();
    const { name, typeOfAnimal,  } = await request.json();

    if (!email || !password || isDoctor == null || undefined) {
      return NextResponse.json(
        { message: "Please provide all the fields!" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    const { data: existingUser, error: existingUserError } = await supabase
      .from("users")
      .select("email")
      .eq("email", email)
      .single();

    if (existingUserError && existingUserError.code !== "PGRST116") {
      console.error(
        "Supabase error checking existing user:",
        existingUserError.message
      );
      return NextResponse.json(
        { message: "Error checking user existence" },
        { status: 500 }
      );
    }

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 }
      );
    }

    const { data: existingDoctor, error: existingDoctorError } = await supabase
      .from("doctor")
      .select("email")
      .eq("email", email)
      .single();

    if (existingDoctorError && existingDoctorError.code !== "PGRST116") {
      console.error(
        "Supabase error checking existing doctor:",
        existingUserError.message
      );
      return NextResponse.json(
        { message: "Error checking doctor existence" },
        { status: 500 }
      );
    }

    if (existingDoctor) {
      return NextResponse.json(
        { message: "Doctor with this email already exists" },
        { status: 409 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    if (isDoctor == false) {
      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert([{ email, password_hash }])
        .select("id, email, created_at")
        .single();
      if (insertError) {
        console.error(
          "Supabase error inserting new user:",
          insertError.message
        );
        return NextResponse.json(
          { message: "Could not create user" },
          { status: 500 }
        );
      }
      return NextResponse.json(
        { message: "Signup successful", user: newUser },
        { status: 201 }
      );
    } else {
      const { data: newDoctor, error: insertError } = await supabase
        .from("doctor")
        .insert([{ email, password_hash, isDoctor }])
        .select("id, email, created_at, isDoctor")
        .single();
      if (insertError) {
        console.error(
          "Supabase error inserting new doctor:",
          insertError.message
        );
        return NextResponse.json(
          { message: "Could not create doctor" },
          { status: 500 }
        );
      }
      return NextResponse.json(
        { message: "Signup successful", doctor: newDoctor },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Signup error:", error);
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
