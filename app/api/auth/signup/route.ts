import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/src/lib/supabase';
import { z } from 'zod';
import { prisma } from '@/src/lib/db';

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

    // Sign up with Supabase (disable email confirmation for testing)
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

    // Create user record in Prisma database immediately
    try {
      if (!data.user.email) {
        throw new Error('User email is required');
      }

      await prisma.user.upsert({
        where: { supabaseId: data.user.id },
        update: {
          email: data.user.email,
          name: data.user.user_metadata?.name || data.user.user_metadata?.full_name || name || email.split('@')[0],
          avatarUrl: data.user.user_metadata?.avatar_url,
          updatedAt: new Date(),
        },
        create: {
          supabaseId: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || data.user.user_metadata?.full_name || name || email.split('@')[0],
          avatarUrl: data.user.user_metadata?.avatar_url,
        },
      });
    } catch (dbError) {
      console.error('Error creating user in database:', dbError);
      // Don't fail the signup if DB creation fails, but log it
    }

    // For testing: account created successfully
    return NextResponse.json({
      message: 'Account created successfully! You can now sign in.',
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name,
        emailConfirmed: data.user.email_confirmed_at ? true : false,
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