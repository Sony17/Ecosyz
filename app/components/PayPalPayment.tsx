'use client';

import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useSession } from 'next-auth/react';

interface PayPalPaymentProps {
  amount: number;
  planType: string;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export default function PayPalPayment({
  amount,
  planType,
  onSuccess,
  onError
}: PayPalPaymentProps) {
  const { data: session } = useSession();

  const createOrder = async () => {
    try {
      // Create order on your backend
      const response = await fetch('/api/payments/paypal/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          planType,
          currency: 'USD', // PayPal primarily works with USD
        }),
      });

      const order = await response.json();
      return order.id;
    } catch (err) {
      onError?.(err);
      throw err;
    }
  };

  const onApprove = async (data: any) => {
    try {
      // Capture the funds from the transaction
      const response = await fetch('/api/payments/paypal/capture-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: data.orderID,
          planType,
        }),
      });

      const details = await response.json();

      // If it all went well, call the success callback
      if (details.status === 'COMPLETED') {
        onSuccess?.();
      } else {
        throw new Error('Payment not completed');
      }
    } catch (err) {
      onError?.(err);
    }
  };

  return (
    <PayPalScriptProvider 
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
        currency: 'USD',
        intent: 'capture',
      }}
    >
      <div className="w-full bg-white rounded-lg p-4">
        <PayPalButtons
          style={{
            color: 'blue',
            shape: 'rect',
            label: 'pay',
            height: 40,
          }}
          createOrder={createOrder}
          onApprove={onApprove}
          onError={(err) => onError?.(err)}
        />
      </div>
    </PayPalScriptProvider>
  );
}