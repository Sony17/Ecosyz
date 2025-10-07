'use client';

import { useState } from 'react';
import * as QRCodeReact from 'qrcode.react';
import PayPalPayment from './PayPalPayment';

interface PaymentMethodProps {
  amount: number;
  planType: string;
  merchantUpiId: string;
  merchantName: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

type PaymentMethod = 'upi' | 'paypal';

export default function PaymentComponent({
  amount,
  planType,
  merchantUpiId,
  merchantName,
  onSuccess,
  onError
}: PaymentMethodProps) {
  // For Plus plan, only show PayPal (will be replaced with Razorpay later)
  const availableMethods = planType === 'Plus' ? ['paypal'] : ['upi', 'paypal'];
  const defaultMethod = planType === 'Plus' ? 'paypal' : 'upi';
  
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(defaultMethod as PaymentMethod);
  const [showQR, setShowQR] = useState(false);

  // UPI Payment URL
  const upiUrl = `upi://pay?pa=${merchantUpiId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&tn=${encodeURIComponent(`${merchantName} ${planType} Plan`)}`;

  // Handle UPI Payment
  const handleUPIClick = () => {
    window.location.href = upiUrl;
  };

  return (
    <div className="w-full max-w-md mx-auto bg-gray-800 rounded-lg p-6">
      {/* Payment Method Selection */}
      <div className="flex gap-2 mb-6">
        {availableMethods.includes('upi') && (
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
        )}
        {availableMethods.includes('paypal') && (
          <button
            onClick={() => setSelectedMethod('paypal')}
            className={`flex-1 py-2 px-4 rounded-md ${
              selectedMethod === 'paypal'
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-700 text-gray-300'
            }`}
          >
            {planType === 'Plus' ? 'Razorpay' : 'PayPal'}
          </button>
        )}
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
          <div className="text-center py-4">
            <p className="text-gray-300 mb-4">
              {planType === 'Plus' 
                ? 'Razorpay payment integration coming soon. Please contact sales for Plus plan.' 
                : 'PayPal payment processing...'}
            </p>
            {planType !== 'Plus' && (
              <PayPalPayment
                amount={amount}
                planType={planType}
                onSuccess={onSuccess}
                onError={onError}
              />
            )}
            {planType === 'Plus' && (
              <button
                onClick={() => window.location.href = '/contact?enquiry=enterprise'}
                className="w-full py-3 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
              >
                Contact Sales for Plus Plan
              </button>
            )}
          </div>
        )}
      </div>

      {/* Security Badge */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-400">
          🔒 Secure payments
        </p>
      </div>
    </div>
  );
}