import { type NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import jwt from "jsonwebtoken";

// DELETE /api/pets/[id]
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    // 3. Validate pet ID
    const petId = params.id;
    if (!petId) {
      return NextResponse.json({ message: "Pet ID is required" }, { status: 400 });
    }

    // 4. Confirm the pet belongs to the authenticated user
    const { data: pet, error: fetchError } = await supabase
      .from("pets")
      .select("id, owner_id")
      .eq("id", petId)
      .single();

    if (fetchError || !pet) {
      return NextResponse.json({ message: "Pet not found" }, { status: 404 });
    }

    if (pet.owner_id !== decoded.userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // 5. Delete the pet
    const { error: deleteError } = await supabase
      .from("pets")
      .delete()
      .eq("id", petId);

    if (deleteError) {
      console.error("Error deleting pet:", deleteError.message);
      return NextResponse.json(
        { message: "Could not delete pet" },
        { status: 500 }
      );
    }

    // 6. Return success
    return NextResponse.json({ message: "Pet deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("Delete pet error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
