import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!token || !JWT_SECRET) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    // Fetch user info
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, name, email, is_doctor')
      .eq('id', decoded.userId)
      .single();

    if (userError || !user) {
      console.error('Error fetching user:', userError?.message);
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Fetch user's pets
    const { data: pets, error: petError } = await supabase
      .from('pets')
      .select('id, name, type')
      .eq('owner_id', user.id);

    if (petError) {
      console.error('Error fetching pets:', petError.message);
      return NextResponse.json({ message: 'Failed to fetch pets' }, { status: 500 });
    }

    // Fetch sessions with pet details
    const { data: sessions, error: sessionError } = await supabase
      .from('sessions')
      .select('id, date, pet_id, pets(name, type)')
      .eq('pet_id', user.id)
      .order('date', { ascending: false });

    if (sessionError) {
      console.error('Error fetching sessions:', sessionError.message);
      return NextResponse.json({ message: 'Failed to fetch sessions' }, { status: 500 });
    }

    return NextResponse.json(
      {
        user: {
          name: user.name,
          email: user.email,
          isDoctor: user.is_doctor,
        },
        pets,
        sessions,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('Dashboard error:', err);
    return NextResponse.json({ message: 'Invalid token or internal error' }, { status: 401 });
  }
}
