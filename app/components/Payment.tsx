import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentProps {
  amount: number;
  planType: string;
  currency?: string;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
}

export default function Payment({ 
  amount, 
  planType, 
  currency = 'INR',
  onSuccess,
  onError 
}: PaymentProps) {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    // Load Razorpay SDK
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    try {
      // Initialize payment
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          planType,
        }),
      });

      if (!response.ok) {
        throw new Error('Payment initialization failed');
      }

      const data = await response.json();

      // Create Razorpay instance
      const razorpay = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        order_id: data.orderId,
        name: 'Open Idea',
        description: `${planType} Plan Subscription`,
        prefill: {
          email: session?.user?.email,
        },
        handler: function (response: any) {
          // Handle success
          onSuccess?.(response);
          router.push('/thank-you');
        },
        modal: {
          ondismiss: function () {
            console.log('Payment cancelled');
          },
        },
      });

      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      onError?.(error);
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="w-full px-4 py-2 text-sm font-medium text-white bg-emerald-500 rounded-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
    >
      Pay with UPI/Card
    </button>
  );
}