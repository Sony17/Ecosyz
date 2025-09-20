'use client';
import { useState, useEffect } from "react";
import { init, send } from '@emailjs/browser';

interface BetaAccessFormProps {
  title?: string;
  onClose?: () => void;
}

export default function BetaAccessForm({ title = "Join the Beta", onClose }: BetaAccessFormProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize EmailJS on component mount
  useEffect(() => {
    const USER_ID = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
    if (USER_ID) {
      try {
        init(USER_ID);
        if (process.env.NODE_ENV !== 'production') {
          console.info('[BetaAccessForm] EmailJS initialized with config:', {
            hasServiceId: Boolean(process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID),
            hasTemplateId: Boolean(process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID),
            hasPublicKey: Boolean(USER_ID),
            hasCompanyEmail: Boolean(process.env.NEXT_PUBLIC_COMPANY_EMAIL)
          });
        }
      } catch (err) {
        console.warn('[BetaAccessForm] EmailJS init warning:', err);
      }
    } else {
      console.warn('[BetaAccessForm] Missing EmailJS public key');
    }
  }, []);

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);
  setSuccess(null);
  setError(null);

  if (!email.includes('@')) {
    setError("Please enter a valid email address.");
    setLoading(false);
    return;
  }

  // Compose the message to match the template structure
  const message = `Message: Beta Access Request\nName: ${name}\nEmail: ${email}`.trim();

  try {
    const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? '';
    const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? '';
    const USER_ID = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? '';
    const COMPANY_EMAIL = process.env.NEXT_PUBLIC_COMPANY_EMAIL ?? '';

    if (process.env.NODE_ENV !== 'production') {
      console.info('[BetaAccessForm] Attempting to send with config:', {
        serviceId: SERVICE_ID,
        templateId: TEMPLATE_ID,
        publicKey: USER_ID ? `${USER_ID.slice(0, 4)}...` : '',
        companyEmail: COMPANY_EMAIL,
        name,
        email
      });
      
      // Log the template parameters for verification
      console.info('[BetaAccessForm] Template parameters:', {
        message,
        subject: 'New Beta Signup',
        to_email: COMPANY_EMAIL,
        from_email: email,
        from_name: name,
        user_name: name,
        user_email: email
      });
    }

    // Validate all required env vars
    if (!SERVICE_ID) throw new Error('Missing EmailJS service ID');
    if (!TEMPLATE_ID) throw new Error('Missing EmailJS template ID');
    if (!USER_ID) throw new Error('Missing EmailJS public key');
    if (!COMPANY_EMAIL) throw new Error('Missing company email');

    // Keep it simple - just like in your template
    const templateParams = {
      to_email: COMPANY_EMAIL,
      from_email: email,
      message: message
    };

    const result = await send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      USER_ID
    );

    if (process.env.NODE_ENV !== 'production') {
      console.info('[BetaAccessForm] Send successful:', result);
    }
    setSuccess("Thank you for signing up! 🚀");
    setName('');
    setEmail('');
  } catch (err: any) {
    console.error('[BetaAccessForm] send failed:', {
      error: err,
      message: err?.message,
      status: err?.status,
      text: err?.text
    });
    
    // Provide more specific error messages
    if (err?.message?.includes('service')) {
      setError("Configuration error with email service. Please try again later.");
    } else if (err?.message?.includes('template')) {
      setError("Email template error. Please try again later.");
    } else if (err?.status === 412) {
      setError("Email service policy error. Please try again later.");
    } else {
      setError("Failed to send. Please try again or contact support.");
    }
  }
  setLoading(false);
}

  return (
    <div className="glass-strong glass-border p-8 rounded-2xl max-w-md w-full mx-auto shadow-lg relative">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors z-10"
          aria-label="Close form"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
      <h2 className="text-2xl font-bold mb-4 text-cyan-300">{title}</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="block mb-1 text-teal-200 font-medium">
            Name
          </label>
          <input
            id="name"
            name="name"
            autoComplete="name"
            className="w-full rounded-lg glass glass-border px-4 py-2 text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your Name"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block mb-1 text-teal-200 font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className="w-full rounded-lg glass glass-border px-4 py-2 text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@email.com"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-lg bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 font-semibold shadow hover:scale-105 transition disabled:opacity-70"
        >
          {loading ? "Submitting..." : title}
        </button>
        {success && <p className="text-green-400 text-center mt-3">{success}</p>}
        {error && <p className="text-red-400 text-center mt-3">{error}</p>}
      </form>
    </div>
  );
}
