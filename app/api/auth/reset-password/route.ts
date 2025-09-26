import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/src/lib/supabase';
import { z } from 'zod';
import { randomBytes } from 'crypto';

const ResetPasswordSchema = z.object({
  email: z.string().email(),
});

// Storage for tokens - this will be lost on server restart
// In production with multiple instances, consider using Redis or a database
const resetTokens = new Map();

const TOKEN_EXPIRY = 60 * 60 * 1000; // 1 hour in milliseconds

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

    // Generate a secure random token
    const token = randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + TOKEN_EXPIRY);
    
    // Store the token
    resetTokens.set(email, { token, expires });
    
    // Generate reset URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/auth/reset-password?email=${encodeURIComponent(email)}&token=${token}`;
    
    // Prepare email HTML and text content
    const emailHtml = `
      <h2>Password Reset Request</h2>
      <p>We received a request to reset your password for the Open Idea platform.</p>
      <p>Click the link below to reset your password:</p>
      <p><a href="${resetUrl}" style="padding: 12px 24px; background-color: #10b981; color: white; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a></p>
      <p>Or copy and paste this URL into your browser:</p>
      <p>${resetUrl}</p>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this password reset, please ignore this email or contact support if you have concerns.</p>
      <p>Thank you,<br>The Open Idea Team</p>
    `;

    const emailText = `
      Password Reset Request
      
      We received a request to reset your password for the Open Idea platform.
      
      Click the link below to reset your password:
      ${resetUrl}
      
      This link will expire in 1 hour.
      
      If you didn't request this password reset, please ignore this email or contact support if you have concerns.
      
      Thank you,
      The Open Idea Team
    `;

    // Log detailed info about the email sending attempt
    console.log('[ResetPassword] Preparing to send email:', { 
      to: email,
      usingSupabase: !!supabase,
      hasFunctionsAPI: !!(supabase && supabase.functions),
      isDev: process.env.NODE_ENV !== 'production'
    });

    try {
      // Comment this section to test actual email sending
      // To enable actual email sending in development mode, just uncomment the block below
      /*
      if (process.env.NODE_ENV !== 'production') {
        console.log('[ResetPassword] Development mode - skipping actual email sending');
        // Simulate success
        const emailData = { success: true, id: 'dev-mode-no-email-sent' };
        const emailError = null;
        
        console.log('[ResetPassword] Email sending skipped in development. Using direct URL instead.');
        return NextResponse.json({
          message: 'Password reset link generated. Using direct URL for development.',
          resetUrl: resetUrl
        });
      }
      */

      // Production mode - actually send the email
      if (!supabase) {
        throw new Error('Supabase client is not available');
      }

      // Send email via Supabase Edge Function
      const { data: emailData, error: emailError } = await supabase.functions.invoke('send-email', {
        body: {
          to: email,
          subject: 'Reset Your Password - Open Idea Platform',
          html: emailHtml,
          text: emailText,
          // Add from field explicitly like ChatBot does
          from: 'noreply@openidea.world'
        },
      });

      console.log('[ResetPassword] Email function response:', { 
        success: !emailError, 
        data: emailData,
        errorMessage: emailError?.message
      });

      if (emailError) {          
        // For development, we'll return the URL directly if email sending fails
        if (process.env.NODE_ENV !== 'production') {
          console.warn('[ResetPassword] Email failed but returning reset URL for development');
          return NextResponse.json({
            message: 'Password reset link generated, but email sending failed. Using direct URL for development.',
            resetUrl: resetUrl,
            emailError: emailError.message,
          });
        }
        
        throw new Error('Failed to send password reset email');
      }

      console.log('[ResetPassword] Email sent successfully:', emailData);

      // Success response
      return NextResponse.json({
        message: 'Password reset email sent successfully. Please check your inbox.',
        // In development, also return the URL for easy testing
        resetUrl: process.env.NODE_ENV !== 'production' ? resetUrl : undefined,
      });
    } catch (emailSendError) {
      console.error('Exception during email sending:', emailSendError);
      
      // For development, return the direct URL
      if (process.env.NODE_ENV !== 'production') {
        return NextResponse.json({
          message: 'Password reset link generated, but email sending failed. Using direct URL for development.',
          resetUrl: resetUrl,
          emailError: emailSendError instanceof Error ? emailSendError.message : 'Unknown error',
        });
      }
      
      throw emailSendError;
    }
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
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
    console.error('Password reset token validation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}