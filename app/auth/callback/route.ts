import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/src/lib/supabase';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  if (!supabase) {
    return NextResponse.redirect(new URL('/auth/error', req.url));
  }

  try {
    // Handle the OAuth callback
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error('OAuth callback error:', error);
      return NextResponse.redirect(new URL('/auth?error=oauth_callback_failed', req.url));
    }

    if (!data.session) {
      // Try to exchange the code for a session
      const code = req.nextUrl.searchParams.get('code');
      if (code) {
        const { data: sessionData, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);

        if (sessionError || !sessionData.session) {
          console.error('Code exchange error:', sessionError);
          return NextResponse.redirect(new URL('/auth?error=code_exchange_failed', req.url));
        }

        // Set session cookies
        const cookieStore = await cookies();
        cookieStore.set('sb-access-token', sessionData.session.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: sessionData.session.expires_in,
          path: '/',
        });

        cookieStore.set('sb-refresh-token', sessionData.session.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 30, // 30 days
          path: '/',
        });

        return NextResponse.redirect(new URL('/', req.url));
      }

      return NextResponse.redirect(new URL('/auth?error=no_session', req.url));
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
    return NextResponse.redirect(new URL('/auth?error=callback_error', req.url));
  }
}