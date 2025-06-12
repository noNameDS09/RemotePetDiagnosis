// src/app/api/auth/login/route.ts
import { type NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      console.error('JWT_SECRET environment variable is not set.');
      return NextResponse.json({ message: 'Server configuration error: JWT_SECRET is missing.' }, { status: 500 });
    }

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, password_hash')
      .eq('email', email)
      .single();

    if (userError || !user) {
      // Log the Supabase error for server-side debugging if it exists
      if (userError) {
        console.error('Supabase error fetching user:', userError.message);
      }
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '1h', // Token expires in 1 hour
    });

    const response = NextResponse.json({ message: 'Login successful', user: { id: user.id, email: user.email } });
    
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60, // 1 hour in seconds
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    // Check if the error is due to parsing request.json()
    if (error instanceof SyntaxError && error.message.includes("JSON")) {
        return NextResponse.json({ message: 'Invalid request format. Expected JSON.' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
