import { type NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import jwt from "jsonwebtoken";
import { Console } from "console";

export async function GET(request: NextRequest) {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      return NextResponse.json(
        { message: "Server configuration error: JWT_SECRET missing." },
        { status: 500 }
      );
    }

    // 1. Extract and verify token
    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const doctorId = decoded.doctorId;
    if (!doctorId) {
      return NextResponse.json(
        { message: "Only doctors can access this route." },
        { status: 403 }
      );
    }

    // 2. Get doctor info
    const { data: doctor, error: doctorError } = await supabase
      .from("doctors")
      .select("name, email, is_doctor")
      .eq("id", doctorId)
      .single();

    if (doctorError || !doctor) {
      return NextResponse.json(
        { message: "Doctor not found." },
        { status: 404 }
      );
    }

    // 3. Get pets treated by doctor
    const { data: pets, error: petsError } = await supabase
      .from("pets")
      .select("name, type, weight")
      .eq("doctor_id", doctorId);

    if (petsError) {
      console.error("Error fetching pets:", petsError.message);
      return NextResponse.json(
        { message: "Error fetching pets" },
        { status: 500 }
      );
    }

    // 4. Get sessions handled by doctor
    const { data: sessions, error: sessionsError } = await supabase
      .from("sessions")
      .select(
        `
        date,
        report,
        Pet:pet_id( name, type )
      `
      )
      .eq("doctor_id", doctorId);

    if (sessionsError) {
      console.error("Error fetching sessions:", sessionsError.message);
      return NextResponse.json(
        { message: "Error fetching sessions" },
        { status: 500 }
      );
    }

    // console.log(doctor);
    // console.log(pets)
    // console.log(sessions);
    return NextResponse.json({
      doctor,
      pets,
      sessions,
    });
  } catch (error) {
    console.error("Doctor dashboard error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
