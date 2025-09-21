import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/src/lib/supabase';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Authentication service unavailable' },
      { status: 503 }
    );
  }

  try {
    // Sign out from Supabase
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Sign out error:', error);
    }

    // Clear session cookies regardless of Supabase response
    const cookieStore = await cookies();
    cookieStore.delete('sb-access-token');
    cookieStore.delete('sb-refresh-token');

    return NextResponse.json({
      message: 'Signed out successfully',
    });
  } catch (error) {
    console.error('Sign out error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}