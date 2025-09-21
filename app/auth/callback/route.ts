import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/src/lib/supabase';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  if (!supabase) {
    return NextResponse.redirect(new URL('/auth/error', req.url));
  }

  try {
    const { data, error } = await supabase.auth.getSession();

    if (error || !data.session) {
      console.error('OAuth callback error:', error);
      return NextResponse.redirect(new URL('/auth/error', req.url));
    }

    // Set session cookies
    const cookieStore = await cookies();
    cookieStore.set('sb-access-token', data.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: data.session.expires_in,
      path: '/',
    });

    cookieStore.set('sb-refresh-token', data.session.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    // Redirect to dashboard or home
    return NextResponse.redirect(new URL('/', req.url));
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(new URL('/auth/error', req.url));
  }
}