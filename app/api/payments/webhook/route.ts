import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const signature = req.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    // Verify signature
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || '';
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(JSON.stringify(body));
    const generatedSignature = hmac.digest('hex');

    if (signature !== generatedSignature) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    const { 
      payload: { payment: { entity } }
    } = body;

    // Handle successful payment
    if (entity.status === 'captured') {
      // Update user's subscription status based on the notes in the payment
      const { planType, userEmail } = entity.notes;
      
      // TODO: Update user's subscription in the database
      // await prisma.user.update({
      //   where: { email: userEmail },
      //   data: {
      //     subscriptionPlan: planType,
      //     subscriptionStatus: 'active',
      //     subscriptionStartDate: new Date(),
      //   }
      // });
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}