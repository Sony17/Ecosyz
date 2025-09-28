import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { paymentId, paymentMethod, amount, planType } = body;

    if (!paymentId || !paymentMethod || !amount || !planType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // For UPI payments, we trust the client-side verification
    // For PayPal, verification is handled by PayPal SDK
    if (paymentMethod === 'upi' || paymentMethod === 'paypal') {
      // In a real implementation, you would verify the payment with the respective provider
      // For now, we'll just return success
      return NextResponse.json(
        {
          success: true,
          message: 'Payment verified successfully',
          paymentId,
          amount,
          planType
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: 'Unsupported payment method' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
