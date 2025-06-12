// src/app/api/auth/signup/route.ts
import { type NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: 'Invalid email format' }, { status: 400 });
    }

    // Basic password strength (e.g., minimum length)
    if (password.length < 6) {
      return NextResponse.json({ message: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    // Check if user already exists
    const { data: existingUser, error: existingUserError } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    if (existingUserError && existingUserError.code !== 'PGRST116') { // PGRST116: Row not found, which is good here
      console.error('Supabase error checking existing user:', existingUserError.message);
      return NextResponse.json({ message: 'Error checking user existence' }, { status: 500 });
    }

    if (existingUser) {
      return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 }); // 409 Conflict
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Insert new user
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([{ email, password_hash }])
      .select('id, email, created_at')
      .single();

    if (insertError) {
      console.error('Supabase error inserting new user:', insertError.message);
      return NextResponse.json({ message: 'Could not create user' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Signup successful', user: newUser }, { status: 201 });

  } catch (error) {
    console.error('Signup error:', error);
    if (error instanceof SyntaxError && error.message.includes("JSON")) {
        return NextResponse.json({ message: 'Invalid request format. Expected JSON.' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
