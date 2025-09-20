'use client';

import { useState } from 'react';
import { init, send } from '@emailjs/browser';
const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? '';
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? '';
const USER_ID = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? '';
const COMPANY_EMAIL = process.env.NEXT_PUBLIC_COMPANY_EMAIL ?? '';

export default function FeedbackForm() {
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(false);
    setError('');
    setLoading(true);

    try {
      if (process.env.NODE_ENV !== 'production') {
        console.info('[FeedbackForm] sending', { SERVICE_ID, TEMPLATE_ID, hasUserId: Boolean(USER_ID), company: COMPANY_EMAIL });
      }
      if (!SERVICE_ID || !TEMPLATE_ID || !USER_ID) throw new Error('EmailJS env not configured');
      await send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          to_email: COMPANY_EMAIL,
          message: `New feedback submission:\n\n${message}`,
          subject: 'New feedback from Open Idea website',
        },
        USER_ID
      );
      setSubmitted(true);
      setMessage('');
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') console.error('[FeedbackForm] send failed', err);
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto" aria-label="Send us feedback">
      <textarea
        className="w-full p-4 rounded-md glass glass-border resize-none focus:outline-none focus:ring-2 focus:ring-emerald-400"
        rows={5}
        value={message}
        placeholder="Share your thoughts..."
        onChange={(e) => setMessage(e.target.value)}
        required
        disabled={loading}
      />
      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          className="px-6 py-2 rounded-md bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 font-semibold shadow hover:scale-105 transition"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Submit'}
        </button>
      </div>
      {submitted && (
        <p className="mt-4 text-emerald-500">Thank you for your feedback!</p>
      )}
      {error && (
        <p className="mt-4 text-red-500">{error}</p>
      )}
    </form>
  );
}
