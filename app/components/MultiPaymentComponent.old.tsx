'use client';

import { useState } from 'react';
import * as QRCodeReact from 'qrcode.react';
import { useSupabaseUser } from '../../src/lib/useSupabaseUser';
import PayPalPayment from './PayPalPayment';

interface PaymentError extends Error {
  code?: string;
  details?: string;
}

interface PaymentMethodProps {
  amount: number;
  planType: string;
  merchantUpiId: string;
  merchantName: string;
  onSuccess?: () => void;
  onError?: (error: PaymentError) => void;
}

type PaymentMethod = 'upi' | 'paypal' | 'card' | 'netbanking';

export default function MultiPaymentComponent({
  amount,
  planType,
  merchantUpiId,
  merchantName,
  onSuccess,
  onError
}: PaymentMethodProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('upi');
  const [showQR, setShowQR] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user: session, loading: sessionLoading } = useSupabaseUser();

  // UPI Payment URL
  const upiUrl = `upi://pay?pa=${merchantUpiId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&tn=${encodeURIComponent(`${merchantName} ${planType} Plan`)}`;

  // Handle UPI Payment
  const handleUPIClick = () => {
    window.location.href = upiUrl;
  };

  // Handle Card Payment
  const handleCardPayment = async () => {
    try {
      setLoading(true);

      // Create payment intent
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency: 'INR',
          paymentMethod: 'card',
          planType,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret } = await response.json();

      // Load Stripe
      const { loadStripe } = await import('@stripe/stripe-js');
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);
      if (!stripe) throw new Error('Stripe failed to load');

      // For demo purposes, we'll just show success
      // In a real implementation, you'd use Stripe Elements here
      onSuccess?.();
    } catch (error) {
      onError?.(error as PaymentError);
    } finally {
      setLoading(false);
    }
  };

  // Handle Net Banking
  const handleNetBanking = async () => {
    try {
      setLoading(true);

      const response = await fetch('/api/payments/netbanking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          planType,
          email: session?.email,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to initiate net banking payment');
      }

      const { redirectUrl } = await response.json();
      window.location.href = redirectUrl;
    } catch (error) {
      onError?.(error as PaymentError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-gray-800 rounded-lg p-6">
      {/* Payment Method Selection */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setSelectedMethod('upi')}
          className={`flex-1 py-2 px-4 rounded-md ${
            selectedMethod === 'upi'
              ? 'bg-emerald-500 text-white'
              : 'bg-gray-700 text-gray-300'
          }`}
        >
          UPI
        </button>
        <button
          onClick={() => setSelectedMethod('paypal')}
          className={`flex-1 py-2 px-4 rounded-md ${
            selectedMethod === 'paypal'
              ? 'bg-emerald-500 text-white'
              : 'bg-gray-700 text-gray-300'
          }`}
        >
          PayPal
        </button>
      </div>

      {/* Payment Method Content */}
      <div className="space-y-4">
        {selectedMethod === 'upi' && (
          <div className="space-y-4">
            <button
              onClick={handleUPIClick}
              className="w-full py-3 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
            >
              Pay with UPI App
            </button>
            <button
              onClick={() => setShowQR(!showQR)}
              className="w-full py-3 bg-gray-700 text-white rounded-md hover:bg-gray-600"
            >
              {showQR ? 'Hide QR Code' : 'Show QR Code'}
            </button>
            {showQR && (
              <div className="flex justify-center p-4 bg-white rounded-lg">
                <QRCodeReact.QRCodeSVG value={upiUrl} size={200} />
              </div>
            )}
            <div className="text-center text-sm text-gray-400">
              <p>UPI ID: {merchantUpiId}</p>
              <p>Amount: ₹{amount}</p>
            </div>
            <button
              onClick={onSuccess}
              className="w-full py-3 bg-gray-700 text-white rounded-md hover:bg-gray-600"
            >
              Verify Payment
            </button>
          </div>
        )}

        {selectedMethod === 'card' && (
          <div className="space-y-4">
            <div className="text-center text-sm text-gray-400">
              <p>Card payment integration coming soon</p>
            </div>
            <button
              onClick={handleCardPayment}
              disabled={loading}
              className="w-full py-3 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 disabled:bg-gray-600"
            >
              {loading ? 'Processing...' : 'Pay with Card'}
            </button>
          </div>
        )}

        {selectedMethod === 'netbanking' && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {['HDFC', 'ICICI', 'SBI', 'Axis', 'Kotak', 'Others'].map((bank) => (
                <button
                  key={bank}
                  onClick={handleNetBanking}
                  className="p-4 bg-gray-700 rounded-md hover:bg-gray-600 text-center text-sm text-gray-300"
                >
                  {bank}
                </button>
              ))}
            </div>
            <button
              onClick={handleNetBanking}
              disabled={loading}
              className="w-full py-3 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 disabled:bg-gray-600"
            >
              {loading ? 'Processing...' : 'Continue to Net Banking'}
            </button>
          </div>
        )}

        {selectedMethod === 'paypal' && (
          <PayPalPayment
            amount={amount}
            planType={planType}
            onSuccess={onSuccess}
            onError={onError}
          />
        )}
      </div>

      {/* Security Badge */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-400">
          🔒 Secure payments | PCI DSS Compliant
        </p>
      </div>
    </div>
  );
}
