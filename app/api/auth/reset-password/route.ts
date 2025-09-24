import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/src/lib/supabase';
import { z } from 'zod';
import { randomBytes } from 'crypto';

const ResetPasswordSchema = z.object({
  email: z.string().email(),
});

// In-memory store for reset tokens (in production, use Redis or a database)
// Format: { email: { token: string, expires: Date } }
const resetTokens = new Map();

export async function POST(req: NextRequest) {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Authentication service unavailable' },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const parse = ResetPasswordSchema.safeParse(body);

    if (!parse.success) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    const { email } = parse.data;

    // For development, skip email verification
    // In production, you would check if the email exists in your auth system
    // We're bypassing this check for now to make development easier

    // Generate a secure random token
    const token = randomBytes(32).toString('hex');
    const expiresIn = 60 * 60 * 1000; // 1 hour in milliseconds
    const expires = new Date(Date.now() + expiresIn);
    
    // Store the token (in memory for now - would use database in production)
    resetTokens.set(email, { token, expires });
    
    // Generate reset URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/auth/reset-password?email=${encodeURIComponent(email)}&token=${token}`;

    // In production, you would send an email here
    // For development, return the URL directly
    return NextResponse.json({
      message: 'Password reset link generated successfully.',
      // Only return the URL in development - in production this would be sent by email
      resetUrl: process.env.NODE_ENV === 'production' ? null : resetUrl,
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Function to validate a reset token
export function validateResetToken(email: string, token: string): boolean {
  const resetData = resetTokens.get(email);
  
  if (!resetData) {
    return false;
  }
  
  const { token: storedToken, expires } = resetData;
  
  if (Date.now() > expires.getTime()) {
    // Token has expired, remove it
    resetTokens.delete(email);
    return false;
  }
  
  return token === storedToken;
}

// Endpoint to verify a reset token
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get('email');
    const token = url.searchParams.get('token');
    
    if (!email || !token) {
      return NextResponse.json(
        { valid: false },
        { status: 400 }
      );
    }
    
    const valid = validateResetToken(email, token);
    
    return NextResponse.json({ valid });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}