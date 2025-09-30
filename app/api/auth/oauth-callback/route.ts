import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/src/lib/supabase';
import { z } from 'zod';
import { ensureUserInDb } from '@/src/lib/auth';

const OAuthCallbackSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  expires_in: z.number().optional(),
});

export async function POST(req: NextRequest) {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Authentication service unavailable' },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const parse = OAuthCallbackSchema.safeParse(body);

    if (!parse.success) {
      return NextResponse.json(
        { error: 'Invalid token data', details: parse.error.message },
        { status: 400 }
      );
    }

    const { access_token, refresh_token, expires_in } = parse.data;

    // Set the session in Supabase to verify the tokens
    const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });

    if (sessionError || !sessionData.session || !sessionData.user) {
      console.error('Session verification error:', sessionError);
      return NextResponse.json(
        { error: 'Invalid session tokens' },
        { status: 400 }
      );
    }

    // Ensure user exists in our database
    await ensureUserInDb(sessionData.user);

    // Create response and set secure cookies
    const response = NextResponse.json({
      message: 'OAuth authentication successful',
      user: {
        id: sessionData.user.id,
        email: sessionData.user.email,
        name: sessionData.user.user_metadata?.name || sessionData.user.user_metadata?.full_name,
        avatar_url: sessionData.user.user_metadata?.avatar_url,
      },
    });

    // Set session cookies
    response.cookies.set('sb-access-token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: expires_in || 3600,
      path: '/',
    });

    response.cookies.set('sb-refresh-token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Authentication service unavailable' },
      { status: 503 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      return NextResponse.json(
        { error: 'OAuth error: ' + error },
        { status: 400 }
      );
    }

    if (!code) {
      return NextResponse.json(
        { error: 'Authorization code not found' },
        { status: 400 }
      );
    }

    // Exchange code for session
    const { data: sessionData, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);

    if (sessionError || !sessionData?.session) {
      console.error('Code exchange error:', sessionError);
      return NextResponse.json(
        { error: 'Failed to exchange authorization code' },
        { status: 400 }
      );
    }

    // Ensure user exists in our database
    if (sessionData.user) {
      await ensureUserInDb(sessionData.user);
    }

    // Create response and set cookies
    const response = NextResponse.json({
      message: 'OAuth authentication successful',
      user: {
        id: sessionData.user?.id,
        email: sessionData.user?.email,
        name: sessionData.user?.user_metadata?.name || sessionData.user?.user_metadata?.full_name,
        avatar_url: sessionData.user?.user_metadata?.avatar_url,
      },
    });

    // Set session cookies
    response.cookies.set('sb-access-token', sessionData.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: sessionData.session.expires_in,
      path: '/',
    });

    response.cookies.set('sb-refresh-token', sessionData.session.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('OAuth GET callback error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}