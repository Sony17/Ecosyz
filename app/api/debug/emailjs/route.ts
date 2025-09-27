import { NextResponse } from 'next/server';

export async function POST() {
  // Debug endpoint to log EmailJS environment variables server-side
  console.log('[API Debug] EmailJS Environment Variables:');
  console.log('NEXT_PUBLIC_EMAILJS_SERVICE_ID:', process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID);
  console.log('NEXT_PUBLIC_EMAILJS_TEMPLATE_ID:', process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID);
  console.log('NEXT_PUBLIC_EMAILJS_PUBLIC_KEY:', process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY);
  console.log('NEXT_PUBLIC_COMPANY_EMAIL:', process.env.NEXT_PUBLIC_COMPANY_EMAIL);

  return NextResponse.json({
    message: 'EmailJS env vars logged',
    timestamp: new Date().toISOString(),
    env: {
      hasServiceId: Boolean(process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID),
      hasTemplateId: Boolean(process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID),
      hasPublicKey: Boolean(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY),
      hasCompanyEmail: Boolean(process.env.NEXT_PUBLIC_COMPANY_EMAIL),
    }
  });
}