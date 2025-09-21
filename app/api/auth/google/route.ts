import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/src/lib/supabase';

export async function GET(req: NextRequest) {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Authentication service unavailable' },
      { status: 503 }
    );
  }

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${req.nextUrl.origin}/auth/callback`,
      },
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    if (data.url) {
      return NextResponse.redirect(data.url);
    }

    return NextResponse.json(
      { error: 'Failed to initiate Google login' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Google login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}