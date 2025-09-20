'use client';
import { useState, useEffect } from "react";
import emailjs from "emailjs-com";

export default function BetaAccessForm({ title = "Join the Beta" }) {
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
        emailjs.init(USER_ID);
      } catch (err) {
        console.warn('EmailJS init warning:', err);
      }
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

  // Compose the single message
  const message = `
New Beta Signup!
Name: ${name}
Email: ${email}
  `.trim();

  try {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[BetaAccessForm] sending');
    }
    const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? '';
    const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? '';
    const USER_ID = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? '';
    const COMPANY_EMAIL = process.env.NEXT_PUBLIC_COMPANY_EMAIL ?? '';
    if (!SERVICE_ID || !TEMPLATE_ID || !USER_ID) throw new Error('EmailJS env not configured');
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        message,
        subject: 'New Beta Signup',
        to_email: COMPANY_EMAIL,
        from_email: email,
      },
      USER_ID
    );
    setSuccess("Thank you for signing up! 🚀");
    setName('');
    setEmail('');
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.error('[BetaAccessForm] send failed', err);
    setError("Failed to send. Please try again.");
  }
  setLoading(false);
}

  return (
    <div className="glass-strong glass-border p-8 rounded-2xl max-w-md w-full mx-auto shadow-lg">
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
