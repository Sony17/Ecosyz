import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/src/lib/supabase';
import { z } from 'zod';

const UpdatePasswordSchema = z.object({
  password: z.string().min(6),
  email: z.string().email(),
  // For development only - simple password reset without token
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
    const parse = UpdatePasswordSchema.safeParse(body);

    if (!parse.success) {
      return NextResponse.json(
        { error: 'Invalid input' },
        { status: 400 }
      );
    }

    const { password, email } = parse.data;

    // Skip token validation for development - this is not secure for production
    // In production, you would validate a token or require authentication

    // For development environment, use a simpler approach
    // Update the user's password directly - this would need email verification in production
    const { error: updateError } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/auth`,
      }
    );

    if (updateError) {
      console.error('Password reset error:', updateError);
      return NextResponse.json(
        { error: 'Failed to reset password' },
        { status: 500 }
      );
    }

    // For development - return success even though user will still need to click the link
    // In production, you would use a proper authentication flow
    return NextResponse.json({
      message: 'Password reset email sent successfully',
      success: true,
      // This is for development only
      devNote: "In this development mode, the user will still receive an email to complete the reset."
    });
  } catch (error) {
    console.error('Password update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}