import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/src/lib/supabase';
import { z } from 'zod';

const SignUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
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
    const parse = SignUpSchema.safeParse(body);

    if (!parse.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parse.error.message },
        { status: 400 }
      );
    }

    const { email, password, name } = parse.data;

    // Sign up with Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || email.split('@')[0], // Default name from email
        },
      },
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    if (!data.user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    // Return success (user will need to verify email)
    return NextResponse.json({
      message: 'User created successfully. Please check your email for verification.',
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name,
      },
    });
  } catch (error) {
    console.error('Sign up error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}