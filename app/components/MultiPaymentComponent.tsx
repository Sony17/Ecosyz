'use client';

import { useState } from 'react';
import * as QRCodeReact from 'qrcode.react';
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

type PaymentMethod = 'upi' | 'paypal';

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

  // UPI Payment URL
  const upiUrl = `upi://pay?pa=${merchantUpiId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&tn=${encodeURIComponent(`${merchantName} ${planType} Plan`)}`;

  // Handle UPI Payment
  const handleUPIClick = () => {
    try {
      window.location.href = upiUrl;
    } catch (error) {
      console.error('UPI payment error:', error);
      const paymentError: PaymentError = new Error(
        error instanceof Error ? error.message : 'UPI payment failed'
      );
      if (error instanceof Error) {
        paymentError.code = 'UPI_PAYMENT_ERROR';
        paymentError.details = error.stack;
      }
      onError?.(paymentError);
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

        {selectedMethod === 'paypal' && (
          <PayPalPayment
            amount={amount}
            planType={planType}
            onSuccess={onSuccess}
            onError={onError}
          />
        )}
      </div>

      {/* Payment Total */}
      <div className="mt-6 text-center">
        <p className="text-lg text-gray-300">Total Amount: ₹{amount}</p>
      </div>
    </div>
  );
}