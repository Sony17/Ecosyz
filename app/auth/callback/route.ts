import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/src/lib/supabase';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  if (!supabase) {
    return NextResponse.redirect(new URL('/auth/error', req.url));
  }

  try {
    // Parse URL to handle both code exchange and hash fragments
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');
    const hash = url.hash; // This will contain access_token in fragment

    // Handle error parameter if present
    if (error) {
      console.error('OAuth error parameter:', error);
      return NextResponse.redirect(new URL(`/auth?error=${error}`, req.url));
    }

    // Handle hash fragments (contains access_token)
    if (hash && hash.includes('access_token=')) {
      console.log('Hash fragment found in URL, processing OAuth tokens directly');
      try {
        // Extract tokens from hash fragment
        const accessToken = hash.match(/access_token=([^&]*)/)?.[1];
        const refreshToken = hash.match(/refresh_token=([^&]*)/)?.[1];
        
        if (accessToken && refreshToken) {
          // Set session cookies manually from hash params
          const cookieStore = await cookies();
          cookieStore.set('sb-access-token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 3600, // 1 hour default
            path: '/',
          });

          cookieStore.set('sb-refresh-token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: '/',
          });

          // Verify session was set properly
          const { data: sessionData } = await supabase.auth.getSession();
          if (sessionData?.session) {
            console.log('Session established successfully from hash tokens');
            return NextResponse.redirect(new URL('/profile', req.url));
          }
        }
      } catch (hashError) {
        console.error('Error processing hash fragment:', hashError);
      }
    }

    // Code-based flow
    if (code) {
      console.log('Authorization code found, exchanging for session');
      const { data: sessionData, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);

      if (sessionError || !sessionData?.session) {
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

      console.log('Session established successfully from code exchange');
      return NextResponse.redirect(new URL('/profile', req.url));
    }

    // Try getting session directly (if cookies already exist)
    console.log('No code or hash fragments, checking for existing session');
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (sessionData?.session) {
      console.log('Existing session found');
      return NextResponse.redirect(new URL('/profile', req.url));
    }

    // No session could be established
    console.error('No session could be established');
    return NextResponse.redirect(new URL('/auth?error=no_session_found', req.url));
    
    // This line should not be here - removing the extra closing brace
    // No session could be established through other methods
    console.error('All OAuth methods failed, trying existing session');
    return NextResponse.redirect(new URL('/auth?error=session_methods_failed', req.url));
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(new URL('/auth?error=callback_error', req.url));
  }
}