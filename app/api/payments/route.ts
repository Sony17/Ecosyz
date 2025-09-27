import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, paymentMethod, planType } = body;

    if (!amount || !paymentMethod || !planType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Currently only handling UPI and PayPal
    // PayPal is handled client-side with the PayPal SDK
    if (paymentMethod === 'upi') {
      // UPI payments are handled client-side with QR code
      return NextResponse.json(
        { message: 'UPI payment initiated' },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: 'Unsupported payment method' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
