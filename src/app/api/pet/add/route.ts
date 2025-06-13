import { type NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      return NextResponse.json(
        { message: "Server configuration error: JWT_SECRET missing." },
        { status: 500 }
      );
    }

    // 1. Extract token from cookies
    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 2. Verify token
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // 3. Only allow users (not doctors)
    if (!decoded.userId) {
      return NextResponse.json(
        { message: "Only users are allowed to add pets." },
        { status: 403 }
      );
    }

    // 4. Parse request body
    const { name, typeOfAnimal } = await request.json();
    if (!name || !typeOfAnimal) {
      return NextResponse.json(
        { message: "Please provide all the fields!" },
        { status: 400 }
      );
    }

    // 5. Optional: Prevent duplicate pets by name (per user)
    const { data: existingPet, error: existingPetError } = await supabase
      .from("pets")
      .select("id")
      .eq("name", name)
      .eq("owner_id", decoded.userId)
      .single();

    if (existingPet && !existingPetError) {
      return NextResponse.json(
        { message: "You already added a pet with this name." },
        { status: 409 }
      );
    }

    // 6. Insert new pet
    const { data: newPet, error: insertError } = await supabase
      .from("pets")
      .insert([{ name, type:typeOfAnimal, owner_id: decoded.userId }])
      .select("id, name, type")
      .single();

    if (insertError) {
      console.error("Error inserting pet:", insertError.message);
      return NextResponse.json(
        { message: "Could not add pet detail" },
        { status: 500 }
      );
    }

    // 7. Return success
    return NextResponse.json(
      { message: "Pet added successfully", pet: newPet },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add pet error:", error);
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
